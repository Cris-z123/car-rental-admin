<template>
  <div class="parking-add">
    <vue-form
      ref="vueForm"
      :formItem="formItem"
      :formHandler="formHandler"
      :formData="formData"
    >
      <template v-slot:maintain>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-date-picker
              v-model="formData.maintainDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择保养日期"
            ></el-date-picker>
          </el-col>
          <el-col :span="6">下次保养日期：2020-12-12</el-col>
        </el-row>
      </template>
      <template v-slot:energy>
        <el-radio-group v-model="formData.energyType">
          <el-radio
            v-for="item in energyType"
            :label="item.value"
            :key="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
        <div
          class="progress-bar-wrap"
          v-if="formData.energyType === 3 || formData.energyType === 1"
        >
          <span class="label-text">电量：</span>
          <el-row>
            <el-col :span="14">
              <el-slider v-model="formData.electric" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
        <div
          class="progress-bar-wrap"
          v-if="formData.energyType === 3 || formData.energyType === 2"
        >
          <span class="label-text">油量：</span>
          <el-row>
            <el-col :span="14">
              <el-slider v-model="formData.oil" show-input></el-slider>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-slot:carattr>
        <el-button type="primary" @click="addCarsAttr">添加汽车属性</el-button>
        <div class="cars-attr-list" v-for="item in cars_attr" :key="item.key">
          <el-row :gutter="10">
            <el-col :span="2"
              ><el-input v-model="item.attrKey"></el-input
            ></el-col>
            <el-col :span="3"
              ><el-input v-model="item.attrValue"></el-input
            ></el-col>
            <el-col :span="6">
              <el-button @click="removeCarsAttr">-</el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-slot:cardesc>
        <Editor
          ref="wangEditor"
          :value="formData.content"
          :content.sync="formData.content"
        />
      </template>
    </vue-form>
  </div>
</template>
<script>
import Editor from "@c/common/wangEditor";
import VueForm from "@c/form/VueForm";
import { getCarsBrand, getParking } from "@/api/common";
import { addCars, carsDetailed, carsEdit } from "@/api/cars";
export default {
  name: "ParkingAdd",
  components: { VueForm, Editor },
  data() {
    return {
      formData: {
        carsBrandId: "",
        carsMode: "",
        parkingId: "",
        carsNumber: "",
        carsFrameNumber: "",
        engineNumber: "",
        yearCheck: true,
        maintainDate: "",
        gear: 1,
        energyType: 1,
        electric: 0,
        oil: 0,
        status: true,
        carsAttr: "",
        content: "",
      },
      formItem: [
        {
          type: "Select",
          prop: "carsBrandId",
          label: "车辆品牌",
          options: [],
          placeholder: "请选择车辆品牌名称",
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
          prop: "carsMode",
          label: "车辆型号",
          placeholder: "请输入车辆型号",
          rules: [
            {
              required: true,
              message: "车辆型号不能为空",
              trigger: "change",
            },
          ],
        },
        {
          type: "Select",
          prop: "parkingId",
          label: "停车场",
          options: [],
          placeholder: "请选择停车场",
        },
        {
          type: "Input",
          prop: "carsNumber",
          label: "车牌号",
          placeholder: "请输入车牌号",
          rules: [
            {
              required: true,
              message: "车牌号不能为空",
              trigger: "change",
            },
          ],
        },
        {
          type: "Input",
          prop: "carsFrameNumber",
          label: "车架号",
          placeholder: "请输入车架号",
          rules: [
            {
              required: true,
              message: "车架号不能为空",
              trigger: "change",
            },
          ],
        },
        {
          type: "Input",
          prop: "engineNumber",
          label: "发动机号",
          placeholder: "请输入发动机号",
          rules: [
            {
              required: true,
              message: "发动机号不能为空",
              trigger: "change",
            },
          ],
        },
        {
          type: "Radio",
          options: this.$store.state.config.year_check,
          prop: "yearCheck",
          label: "年检",
          rules: [
            {
              required: true,
              message: "请选择年检状态",
              trigger: "change",
            },
          ],
        },
        {
          type: "Slot",
          slotName: "maintain",
          prop: "maintainDate",
          label: "保养日期",
        },
        {
          type: "Radio",
          options: this.$store.state.config.radio_gear,
          prop: "gear",
          label: "挡位",
        },
        {
          type: "Slot",
          slotName: "energy",
          prop: "energyType",
          label: "能源类型",
        },
        {
          type: "Radio",
          options: this.$store.state.config.radio_disabled,
          prop: "status",
          label: "禁启用",
        },
        {
          type: "Slot",
          slotName: "carattr",
          prop: "carsAttr",
          label: "车辆属性",
        },
        {
          type: "Slot",
          slotName: "cardesc",
          prop: "content",
          label: "车辆描述",
        },
      ],
      formHandler: [
        {
          type: "danger",
          label: "确定",
          handler: () => this.onSubmit(),
        },
      ],
      cars_attr: [],
      energyType: this.$store.state.config.energy_type,
      id: this.$route.query.id,
    };
  },
  beforeMount() {
    this.getCarsBrandList();
    this.getParkingList();
    this.getCarsDetailed();
  },
  methods: {
    /** 提交表单 */
    onSubmit() {
      this.formatCarsAttr();
      this.$refs.vueForm.$refs.form.validate((valid) => {
        if (valid) {
          this.id ? this.addCarsDetailed() : this.editCarsDetailed();
        } else {
          this.$message({
            type: "warning",
            message: "表单内容有误，请修改",
          });
          return false;
        }
      });
    },
    /** 获取车辆品牌列表 */
    getCarsBrandList() {
      getCarsBrand()
        .then((response) => {
          const data = response.data.data;
          if (data) {
            const carsBrand = this.formItem.filter(
              (item) => item.prop === "carsBrandId"
            );
            if (carsBrand.length > 0) {
              carsBrand[0].options = data;
            }
          }
        })
        .catch((error) => {});
    },
    /** 获取停车场列表 */
    getParkingList() {
      getParking()
        .then((response) => {
          const data = response.data.data;
          if (data) {
            const carsParking = this.formItem.filter(
              (item) => item.prop === "parkingId"
            );
            if (carsParking.length > 0) {
              carsParking[0].options = data;
            }
          }
        })
        .catch((error) => {});
    },
    /** 新增汽车详情 */
    addCarsDetailed() {
      addCars(this.formData)
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });
          this.$refs.vueForm.resetForm();
          this.cars_attr = [];
          this.$refs.wangEditor.clearContent();
        })
        .catch((error) => {});
    },
    /** 编辑汽车详情 */
    editCarsDetailed() {
      carsEdit({ ...this.formData, id: this.id })
        .then((response) => {
          this.$message({
            type: "success",
            message: response.message,
          });
          this.$refs.vueForm.resetForm();
          this.cars_attr = [];
          this.$refs.wangEditor.clearContent();
        })
        .catch();
    },
    /** 获取汽车详情 */
    getCarsDetailed() {
      if (!this.id) return false;
      carsDetailed({ id: this.id })
        .then((response) => {
          const data = response.data;
          for (let key in data) {
            if (Object.keys(this.formData).includes(key)) {
              this.formData[key] = data[key];
            }
          }
          const carsAttr = JSON.parse(data.carsAttr);
          const arr = [];
          for (let key in carsAttr) {
            const json = {};
            json.attrKey = key;
            json.attrValue = carsAttr[key];
            arr.push(json);
          }
          this.cars_attr = arr;
        })
        .catch();
    },
    /** 添加车辆属性 */
    addCarsAttr() {
      this.cars_attr.push({ attrKey: "", attrValue: "" });
    },
    /** 移除车辆属性 */
    removeCarsAttr(index) {
      this.cars_attr.splice(index, 1);
    },
    /** 格式化车辆属性数据 */
    formatCarsAttr() {
      const carsAttrData = {};
      if (this.cars_attr.length === 0) {
        return false;
      }
      this.cars_attr.forEach((item) => {
        if (item.attrKey) {
          carsAttrData[item.attrKey] = item.attrValue;
        }
      });
      this.formData.carsAttr = JSON.stringify(carsAttrData);
    },
  },
};
</script>
<style lang="scss" scoped>
.cars-attr-list {
  margin-top: 15px;
  overflow: hidden;
}
</style>