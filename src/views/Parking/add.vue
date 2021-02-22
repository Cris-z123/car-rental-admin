<template>
  <div class="parking-add">
    <VueForm
      ref="vueForm"
      :formItem="formItem"
      :formHandler="formHandler"
      :formData="formData"
    >
      <template v-slot:city>
        <CityArea
          ref="cityArea"
          :mapLocation="true"
          :cityAreaValue.sync="form.area"
          @callback="callbackComponent"
        />
      </template>
      <template v-slot:amap>
        <div class="address-map">
          <AMap
            ref="amap"
            :options="option_map"
            @callback="callbackComponent"
            @getLngLat="lnglatValue"
          />
        </div>
      </template>
    </VueForm>
  </div>
</template>
<script>
// AMAP
import AMap from "../amap";
// 组件
import CityArea from "@c/common/cityArea";
import VueForm from "@c/form/VueForm";
import { parkingAdd, parkingDetailed, parkingEdit } from "@/api/parking";
export default {
  name: "ParkingAdd",
  data() {
    return {
      formData: {
        parkingName: "",
        area: "",
        type: "",
        carsNumber: "",
        status: "",
        lnglat: "",
        content: "",
      },
      formItem: [
        {
          type: "Input",
          prop: "parkingName",
          label: "停车场名称",
          placeholder: "请输入停车场名称",
          rules: [
            {
              required: true,
              message: "停车场名称不能为空",
              trigger: "change",
            },
          ],
        },
        {
          type: "Slot",
          slotName: "city",
          prop: "area",
          label: "区域",
          rules: [
            { required: true, message: "区域选择不能为空", trigger: "change" },
          ],
        },
        {
          type: "Radio",
          options: this.$store.state.config.parking_type,
          prop: "type",
          label: "类型",
        },
        {
          type: "Input",
          prop: "carsNumber",
          label: "可停放车辆",
          placeholder: "请输入可停放车辆数",
          rules: [{ required: true, type: "number", message: "请输入数字" }],
        },
        {
          type: "Radio",
          options: this.$store.state.config.radio_disabled,
          prop: "status",
          label: "禁启用",
        },
        {
          type: "Slot",
          slotName: "amap",
          label: "位置",
        },
        {
          type: "Input",
          prop: "lnglat",
          label: "经纬度",
          placeholder: "请从地图中选择停车场位置",
          readonly: true,
          rules: [
            { required: true, message: "区域选择不能为空", trigger: "change" },
          ],
        },
      ],
      formHandler: [
        {
          type: "danger",
          label: "确定",
          handler: () => this.onSubmit(),
        },
      ],
      id: this.$route.query.id,
      status: this.$store.state.config.radio_disabled,
      type: this.$store.state.config.parking_type,
      option_map: {
        mapLoad: true,
      },
      form: {
        parkingName: "",
        area: "",
        type: "",
        carsNumber: "",
        status: "",
        lnglat: "",
        content: "",
      },
      button_loading: false,
    };
  },
  components: { AMap, CityArea, VueForm },
  beforeMount() {},
  mounted() {},
  methods: {
    callbackComponent(params) {
      if (params.function) {
        this[params.function](params.data);
      }
    },
    mapLoad() {
      this.getDetaile();
    },
    setMapCenter(data) {
      this.$refs.amap.setMapCenter(data.address);
    },
    onSubmit() {
      this.$refs.vueForm.$refs.form.validate((valid) => {
        if (valid) {
          this.id ? this.editParking() : this.addParking();
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    addParking() {
      this.button_loading = true;
      parkingAdd(this.form)
        .then((response) => {
          this.$message({
            type: "primary",
            message: response.message,
          });
          this.reset("form");
          this.button_loading = false;
        })
        .catch((error) => {
          this.button_loading = false;
        });
    },
    editParking() {
      let requestData = JSON.parse(JSON.stringify(this.formData));
      requestData.id = this.id;
      this.button_loading = true;
      parkingEdit(requestData)
        .then((response) => {
          this.$message({
            type: "primary",
            message: response.message,
          });
          this.button_loading = false;
          this.$router.push({
            name: ParingIndex,
          });
        })
        .catch((error) => {
          this.button_loading = false;
        });
    },
    getDetaile() {
      parkingDetailed({ id: this.id })
        .then((response) => {
          const data = response.data;
          for (let key in data) {
            if (Object.keys(this.formData).includes(key)) {
              this.formData[key] = data[key];
            }
          }
          const splitLngLat = data.lnglat.split(",");
          const lnglat = {
            lng: splitLngLat[0],
            lat: splitLngLat[1],
          };
          this.$refs.amap.setMarker(lnglat);
          this.$refs.cityArea.initDefaultArea(data.region);
        })
        .catch((error) => {});
    },
    //重置表单
    reset(formName) {
      this.$refs[formName].resetFields();
      this.$refs.cityArea.clear();
      this.$refs.amap.clearMarker();
    },
    lnglatValue(e) {
      this.formData.lnglat = e.value;
    },
  },
};
</script>
<style lass="scss" scoped>
.address-map {
  width: 90%;
  height: 400px;
  border: 1px solid #fff;
  border-radius: 20px;
  overflow: hidden;
}
</style>