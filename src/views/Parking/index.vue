<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="区域">
              <CityArea
                ref="cityArea"
                :cityAreaValue.sync="form.area"
                @callback="callbackComponent"
              />
            </el-form-item>
            <el-form-item label="停车场类型">
              <el-select v-model="form.type" placeholder="室内/室外">
                <el-option
                  v-for="item in parking_type"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="停车场状态">
              <el-select v-model="form.status" placeholder="禁/启用">
                <el-option
                  v-for="item in parking_status"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字">
              <el-select v-model="search_key" placeholder="请选择">
                <el-option label="停车场名称" value="parkingName"></el-option>
                <el-option label="详细区域" value="adress"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="keyword"
                placeholder="请输出关键字搜索"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div class="pull-right">
            <router-link to="/parkingAdd">
              <el-button type="danger">新增停车场</el-button>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格数据 -->
    <VueTable ref="table" :config="table_config">
      <template v-slot:status="slotData">
        <el-switch
          v-model="slotData.data.status"
          @change="switchChange(slotData.data)"
          :disabled="switch_disabled === slotData.data.id"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>
      <template v-slot:lnglat="slotData">
        <el-button type="success" size="mini" @click="showMap(slotData.data)"
          >查看地图</el-button
        >
      </template>
      <template v-slot:operation="slotData">
        <el-button type="danger" size="small" @click="edit(slotData.data.id)"
          >编辑</el-button
        >
        <el-button size="small" @click="del(slotData.data.id)">删除</el-button>
      </template>
    </VueTable>
    <showMapLocation
      :flagVisible.sync="map_show"
      :data="parking_loaction"
    ></showMapLocation>
  </div>
</template>
<script>
import { GetCity } from "@/api/common";
import { parkingAdd, parkingDelete, parkingStatus } from "@/api/parking";
import { address } from "@/utils/common";
import CityArea from "@c/common/cityArea";
import VueTable from "@c/table/VueTable";
import showMapLocation from "@c/dialog/showMapLocation";
export default {
  name: "Parking",
  components: { CityArea, showMapLocation, VueTable },
  data() {
    return {
      table_config: {
        thead: [
          { label: "停车场名称", prop: "parkingName" },
          {
            label: "类型",
            prop: "type",
            type: "function",
            callback: (row, prop) => {
              const data = this.parking_type.filter(
                (item) => item.value === row[prop]
              );
              if (data && data.length > 0) {
                return data[0].label;
              }
            },
            width: "80px",
          },
          {
            label: "区域",
            prop: "address",
            type: "function",
            callback: (row, prop) => {
              address(row[prop]);
            },
          },
          { label: "可停放车辆", prop: "carsNumber", width: "120px" },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            slotName: "status",
            width: "80px",
          },
          {
            label: "查看位置",
            prop: "lnglat",
            type: "slot",
            slotName: "lnglat",
            width: "120px",
          },
          { label: "操作", type: "slot", slotName: "operation" },
        ],
        url: "parkingList",
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
      },
      parking_status: this.$store.state.config.radio_disabled,
      parking_type: this.$store.state.config.parking_type,
      pageSize: 10,
      pageNumber: 1,
      form: {
        area: "",
        type: "",
        status: "",
      },
      search_key: "",
      keyword: "",
      map_show: false,
      parking_loaction: {},
      table_loading: false,
      switch_disabled: "",
    };
  },
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    getType(value) {
      const data = this.parking_type.filter((item) => item.value === value);
      if (data && data.length > 0) {
        return data[0].label;
      }
    },
    search() {
      const requestData = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };
      const filterData = JSON.parse(JSON.stringify(this.form));
      for (let key in filterData) {
        if (filterData[key]) {
          requestData[key] = filterData[key];
        }
      }
      if (this.keyword && this.search_key) {
        requestData[this.search_key] = this.keyword;
      }
      this.$refs.table.requestData(requestData);
    },
    switchChange(data) {
      const requestData = {
        id: data.id,
        status: data.status,
      };
      this.switch_disabled = data.id;
      parkingStatus(requestData)
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });
          this.switch_disabled = "";
        })
        .catch((error) => {
          this.switch_disabled = "";
        });
    },
    edit(id) {
      this.$router.push({
        name: "ParkingAdd",
        query: {
          id,
        },
      });
    },
    del(id) {
      this.$confirm("此操作将永久删除该停车场, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          parkingDelete({ id }).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
            });
            this.$refs.table.requestData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    showMap(data) {
      this.map_show = true;
      this.parking_loaction = data;
    },
  },
};
</script>
<style lass="scss" scoped>
</style>