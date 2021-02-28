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
        <div
          class="cars-attr-list"
          v-for="(item, index) in cars_attr"
          :key="item.key"
        >
          <el-row :gutter="10">
            <el-col :span="2"><el-input value="100"></el-input></el-col>
            <el-col :span="3"><el-input value="100"></el-input></el-col>
            <el-col :span="6">
              <el-button type="primary" v-if="index == 0" @click="addCarsAttr"
                >+</el-button
              >
              <el-button v-else>-</el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-slot:cardesc>
        <div ref="editorDom" style="text-align: left"></div>
      </template>
    </vue-form>
  </div>
</template>
<script>
// 富文本编辑器
import Editor from "wangeditor";
import VueForm from "@c/form/VueForm";
import { getCarsBrand, getParking } from "@/api/common";
export default {
  name: "ParkingAdd",
  components: { VueForm },
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
        electric: "",
        oil: "",
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
          type: "Select",
          prop: "carsMode",
          label: "车辆型号",
          options: [],
          placeholder: "请选择车辆型号",
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
      // 富文本对象
      editor: null,
      cars_attr: [
        { key1: 111, value1: 222 },
        { key2: 111, value2: 222 },
        { key3: 111, value3: 222 },
        { key4: 111, value4: 222 },
      ],
      energyType: this.$store.state.config.energy_type,
    };
  },
  beforeMount() {
    this.getCarsBrandList();
    this.getParkingList();
  },
  mounted() {
    this.createEditor();
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
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
    /** 添加车辆属性 */
    addCarsAttr() {
      this.cars_attr.push({ key4: 111, value4: 222 });
    },
    /** 创建富文本对象 */
    createEditor() {
      this.editor = new Editor(this.$refs.editorDom);
      this.editor.customConfig.onchange = (html) => {};
      this.editor.create(); // 创建富文本实例
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>