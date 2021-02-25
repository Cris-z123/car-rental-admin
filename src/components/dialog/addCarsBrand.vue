<template>
  <!--dialog 弹窗
    子组件接收父组件的数据，是通过属性接收
  -->
  <el-dialog
    title="新增车辆品牌"
    :visible.sync="dialogVisible"
    class="cars-dialog-center"
    @close="close"
    @opened="opened"
    :close-on-click-modal="false"
  >
    <!--内容区-->
    <vue-form
      ref="vueForm"
      :formItem="formItem"
      :formHandler="formHandler"
      :formData="formData"
    >
      <template v-slot:logo>
        <div class="upload-img-wrap">
          <div class="upload-img">
            <img v-show="logo_current" :src="logo_current" />
          </div>
          <ul class="img-list">
            <li
              v-for="item in logo"
              :key="item.id"
              @click="logo_current = item.img"
            >
              <img :src="item.img" :alt="item.name" />
            </li>
          </ul>
        </div>
      </template>
    </vue-form>
    <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>-->
  </el-dialog>
</template>

<script>
import { brandLogo, brandAdd, brandEdit } from "@/api/brand";
import VueForm from "@c/form/VueForm";
export default {
  name: "",
  components: { VueForm },
  props: {
    flagVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formData: {
        nameCh: "",
        nameEn: "",
        imgUrl: "",
        status: "",
        content: "",
      },
      formItem: [
        {
          type: "Input",
          prop: "nameCh",
          label: "品牌名称",
          placeholder: "请输入车辆品牌名称",
          rules: [
            {
              required: true,
              message: "车辆品牌名称不能为空",
              trigger: "change",
            },
          ],
        },
        {
          type: "Input",
          prop: "nameEn",
          label: "品牌英文",
          placeholder: "请输入车辆品牌英文名称",
        },
        {
          type: "Slot",
          slotName: "logo",
          prop: "imgUrl",
          label: "LOGO",
          rules: [
            { required: true, message: "LOGO选择不能为空", trigger: "change" },
          ],
        },
        {
          type: "Radio",
          options: this.$store.state.config.radio_disabled,
          prop: "status",
          label: "禁启用",
        },
      ],
      formHandler: [
        {
          type: "danger",
          label: "确定",
          handler: () => this.submit(),
        },
      ],
      // 弹窗显示/关闭标记
      dialogVisible: false,
      logo_current: "",
      logo: [],
    };
  },
  methods: {
    opened() {
      this.getBrandLogo();
      this.getDetailed();
    },
    getBrandLogo() {
      if (this.logo.length !== 0) {
        return false;
      }
      brandLogo()
        .then((response) => {
          const data = response.data;
          if (data) {
            this.logo = data;
          }
        })
        .catch((error) => {});
    },
    getDetailed() {
      this.formData = this.data;
      this.logo_current = this.data.imgUrl;
      this.formData.imgUrl = this.logo_current;
    },
    submit() {
      this.data.id ? this.edit() : this.add();
    },
    add() {
      this.formData.imgUrl = this.logo_current;
      brandAdd(this.formData)
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });
          this.close();
        })
        .catch((error) => {});
    },
    edit() {
      this.formData.imgUrl = this.logo_current;
      const requestData = JSON.parse(JSON.stringify(this.formData));
      brandEdit(requestData)
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });
          this.close();
        })
        .catch((error) => {});
    },
    reset() {
      for (let key in this.formData) {
        this.formData[key] = "";
      }
      this.logo_current = "";
    },
    close() {
      this.reset();
      this.dialogVisible = false;
      this.$emit("update:flagVisible", false); // {}
    },
  },
  watch: {
    flagVisible: {
      handler(newValue, oldValue) {
        this.dialogVisible = newValue;
      },
    },
  },
};
</script>
<style lang='scss' scoped>
</style>