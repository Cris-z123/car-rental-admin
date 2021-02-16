<template>
  <div>
    <div class="filter-form">
      <el-row>
        <el-col :span="18">
          <el-form
            :inline="true"
            :model="form"
            class="demo-form-inline"
            label-width="100px"
          >
            <el-form-item label="车辆品牌：">
              <el-input
                v-model="form.brand"
                placeholder="请输入车辆品牌"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <div class="pull-right">
            <el-button type="danger" @click="dialog_show = true"
              >新增车辆品牌</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格数据 -->
    <Table ref="table" :config="table_config">
      <template v-slot:status="slotData">
        <el-switch
          v-model="slotData.data.status"
          :disabled="switch_disabled === slotData.data.id"
          @change="switchChange(slotData.data)"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button type="danger" size="small" @click="edit(slotData.data)"
          >编辑</el-button
        >
        <el-button size="small" @click="del(slotData.data.id)">删除</el-button>
      </template>
    </Table>
    <AddCarsBrand
      :flagVisible.sync="dialog_show"
      :data="data_brand"
    /><!--父组件往子组件传数据时，是一个单向数据流-->
  </div>
</template>
<script>
import AddCarsBrand from "@c/dialog/addCarsBrand";
import Table from "@c/table/table";
import { brandDelete, brandStatus } from "@/api/brand";
export default {
  name: "Parking",
  components: { AddCarsBrand, Table },
  data() {
    return {
      // 弹窗标记
      dialog_show: false,
      switch_disabled: "",
      data_brand: {},
      form: {
        brand: "",
      },
      table_config: {
        thead: [
          {
            label: "LOGO",
            prop: "imgUrl",
            type: "image",
            width: 150,
          },
          {
            label: "车辆品牌",
            prop: "nameCh",
            type: "function",
            callback: (row, prop) => {
              return `${row.nameCh} / ${row.nameEn}`;
            },
          },
          { label: "禁启用", prop: "status", type: "slot", slotName: "status" },
          { label: "操作", type: "slot", slotName: "operation" },
        ],
        url: "brandList",
        data: {
          pageSize: 10,
          pageNumber: 1,
        },
      },
    };
  },
  methods: {
    search() {
      const requestData = {
        pageSize: 10,
        pageNumber: 1,
      };
      if (this.form.brand) {
        requestData.brand = this.form.brand;
      }
      this.$refs.table.requestData(requestData);
    },
    del(id) {
      this.$confirm("此操作将永久删除该车辆品牌, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          brandDelete({ id }).then((response) => {
            this.$message({
              type: "success",
              message: response.message,
            });
          });
          this.$refs.table.requestData();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit(data) {
      this.data_brand = JSON.parse(JSON.stringify(data));
      this.dialog_show = true;
    },
    switchChange(data) {
      const requestData = {
        id: data.id,
        status: data.status,
      };
      this.switch_disabled = data.id;
      brandStatus(requestData)
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
  },
};
</script>
<style lass="scss" scoped></style>