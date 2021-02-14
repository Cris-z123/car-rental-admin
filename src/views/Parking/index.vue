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
              <el-button type="danger" @click="getParkingList">搜索</el-button>
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
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="parkingName" label="停车场名称"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="address" label="区域"></el-table-column>
      <el-table-column prop="carsNumber" label="可停放车辆"></el-table-column>
      <el-table-column prop="disabled" label="禁启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.disabled"
            active-value="2"
            inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="lnglat" label="查看位置">
        <template slot-scope="scoped">
          <el-button type="success" size="mini" @click="showMap(scoped.row)"
            >查看地图</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button type="danger" size="small" @click="edit(scoped.row.id)"
            >编辑</el-button
          >
          <el-button size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <showMapLocation
      :flagVisible.sync="map_show"
      :data="parking_loaction"
    ></showMapLocation>
  </div>
</template>
<script>
import { GetCity } from "@/api/common";
import { ParkingAdd, parkingList } from "@/api/parking";
import CityArea from "@c/common/cityArea";
import showMapLocation from "@c/dialog/showMapLocation";
export default {
  name: "Parking",
  components: { CityArea, showMapLocation },
  data() {
    return {
      parking_status: this.$store.state.config.parking_status,
      parking_type: this.$store.state.config.parking_type,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageNumber: 1,
      form: {
        parking_name: "",
        area: "",
        type: "",
        status: "",
      },
      search_key: "",
      keyword: "",
      options: [],
      tableData: [],
      map_show: false,
      parking_loaction: {},
    };
  },
  beforeMount() {
    this.getParkingList();
  },
  mounted() {},
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    getParkingList() {
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
      parkingList(requestData).then((response) => {
        const data = response.data;
        if (data) {
          this.tableData = data.data;
        }
        if (data.total) {
          this.total = data.total;
        }
      });
    },
    edit(data) {
      console.log(data);
    },
    showMap(data) {
      this.map_show = true;
      this.parking_loaction = data;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getParkingList();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getParkingList();
    },
  },
};
</script>
<style lass="scss" scoped>
.container {
  float: right;
  margin-top: 30px;
}
</style>