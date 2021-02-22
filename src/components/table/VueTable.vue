<template>
  <div>
    <el-table
      :data="table_data"
      v-loading="loading_table"
      element-loading-text="拼命加载中"
      border
      style="width: 100%"
    >
      <el-table-column
        v-if="table_config.checkbox"
        type="selection"
        width="40"
      ></el-table-column>
      <template v-for="item in this.table_config.thead">
        <el-table-column
          v-if="item.type === 'function'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span
              v-html="item.callback && item.callback(scope.row, item.prop)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.type === 'slot'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="item.type === 'image'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" :width="item.imgWidth || 50" alt="" />
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </template>
    </el-table>
    <div class="container">
      <el-pagination
        v-if="table_config.pagination"
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
  </div>
</template>

<script>
import { GetTableData } from "@/api/common";
export default {
  name: "TableComponent",
  data() {
    return {
      loading_table: true,
      table_data: [],
      table_config: {
        thead: [],
        checkbox: true,
        url: "",
        pagination: true,
        data: {},
      },
      total: 0,
      currentPage: 1,
    };
  },
  methods: {
    initconfig() {
      for (let key in this.config) {
        if (Object.keys(this.table_config).includes(key)) {
          this.table_config[key] = this.config[key];
        }
      }
      this.loadData();
    },
    loadData() {
      let requestData = {
        url: this.table_config.url,
        data: this.table_config.data,
      };
      this.loading_table = true;
      GetTableData(requestData)
        .then((response) => {
          const data = response.data;
          if (data) {
            this.table_data = data.data;
          }
          this.total = data.total;
          this.loading_table = false;
        })
        .catch((error) => {
          this.loading_table = false;
        });
    },
    requestData(params = "") {
      if (params) {
        this.table_config.data = params;
      }
      this.loadData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
    },
  },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    config: {
      handler(newValue) {
        this.initconfig();
      },
      immediate: true,
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