<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="18">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item label="车辆品牌">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="车牌号">
              <el-input></el-input>
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
            <router-link to="/carsAdd">
              <el-button type="danger">新增车辆</el-button>
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
      <template v-slot:operation="slotData">
        <el-button type="danger" size="small" @click="edit(slotData.data.id)"
          >编辑</el-button
        >
        <el-button size="small" @click="del(slotData.data.id)">删除</el-button>
      </template>
    </VueTable>
  </div>
</template>
<script>
import { parkingAdd, carsDelete, carsStatus } from "@/api/cars";
import { address } from "@/utils/common";
import VueTable from "@c/table/VueTable";
export default {
  name: "Parking",
  components: { VueTable },
  data() {
    return {
      table_config: {
        thead: [
          { label: "车牌号", prop: "carsNumber" },
          { label: "车辆品牌", prop: "carsBrand", width: "100px" },
          {
            label: "年检",
            prop: "year_check",
            type: "function",
            callback: (row, prop) => {
              const data = this.year_check.filter(
                (item) => item.value === row[prop]
              );
              if (data && data.length > 0) {
                return data[0].label;
              }
            },
            width: "80px",
          },
          {
            label: "能源类型",
            prop: "energy_type",
            type: "function",
            callback: (row, prop) => {
              const data = this.energy_type.filter(
                (item) => item.value === row[prop]
              );
              if (data && data.length > 0) {
                return data[0].label;
              }
            },
            width: "80px",
          },
          { label: "停车场", prop: "parkingName" },
          { label: "区域", prop: "area" },
          {
            label: "禁启用",
            prop: "status",
            type: "slot",
            slotName: "status",
            width: "80px",
          },
          { label: "操作", type: "slot", slotName: "operation" },
        ],
        url: "carsList",
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
      },
      parking_status: this.$store.state.config.radio_disabled,
      year_check: this.$store.state.config.year_check,
      energy_type: this.$store.state.config.energy_type,
      pageSize: 10,
      pageNumber: 1,
      form: {
        area: "",
        type: "",
        status: "",
      },
      search_key: "",
      keyword: "",
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
    // getType(value) {
    //   const data = this.parking_type.filter((item) => item.value === value);
    //   if (data && data.length > 0) {
    //     return data[0].label;
    //   }
    // },
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
      carsStatus(requestData)
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
        name: "CarsAdd",
        query: {
          id,
        },
      });
    },
    del(id) {
      this.$confirm("此操作将永久删除该车辆信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          carsDelete({ id }).then((response) => {
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
  },
};
</script>
<style lass="scss" scoped>
</style>