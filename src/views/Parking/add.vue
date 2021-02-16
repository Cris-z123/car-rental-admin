<template>
  <div class="parking-add">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="停车场名称" prop="parkingName">
        <el-input v-model="form.parkingName"></el-input>
      </el-form-item>
      <el-form-item label="区域" prop="area">
        <CityArea
          ref="cityArea"
          :mapLocation="true"
          :cityAreaValue.sync="form.area"
          @callback="callbackComponent"
        />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio
            v-for="item in type"
            :label="item.value"
            :key="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可停放车辆" prop="carsNumber">
        <el-input v-model.number="form.carsNumber"></el-input>
      </el-form-item>
      <el-form-item label="禁启用">
        <el-radio-group v-model="form.status">
          <el-radio
            v-for="item in status"
            :label="item.value"
            :key="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="位置">
        <div class="address-map">
          <AMap
            ref="amap"
            :options="option_map"
            @callback="callbackComponent"
            @getLngLat="lnglatValue"
          />
        </div>
      </el-form-item>
      <el-form-item label="经纬度" prop="lnglat">
        <el-input v-model="form.lnglat"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="danger"
          @click="onSubmit('form')"
          :loading="button_loading"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// AMAP
import AMap from "../amap";
// 组件
import CityArea from "@c/common/cityArea";
import { parkingAdd, parkingDetailed, parkingEdit } from "@/api/parking";
export default {
  name: "ParkingAdd",
  data() {
    return {
      id: this.$route.query.id,
      status: this.$store.state.config.parking_status,
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
      rules: {
        parkingName: [
          { required: true, message: "请输入停车场名称", trigger: "change" },
        ],
        carsNumber: [{ type: "number", message: "请输入数字" }],
        area: [{ required: true, message: "请输入区域", trigger: "change" }],
        lnglat: [
          { required: true, message: "请输入经纬度", trigger: "change" },
        ],
      },
      button_loading: false,
    };
  },
  components: { AMap, CityArea },
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
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
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
      let requestData = JSON.parse(JSON.stringify(this.form));
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
            if (Object.keys(this.form).includes(key)) {
              this.form[key] = data[key];
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
      this.form.lnglat = e.value;
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