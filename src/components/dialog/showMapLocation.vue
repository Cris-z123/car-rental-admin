<template>
  <!--dialog 弹窗
    子组件接收父组件的数据，是通过属性接收
  -->
  <el-dialog
    :title="data.parkingName"
    :visible.sync="dialogVisible"
    class="cars-dialog-center"
    @opened="opened"
    @close="close"
    :close-on-click-modal="false"
  >
    <!--内容区-->
    <div style="height: 400px">
      <AMap ref="aMap"></AMap>
    </div>
  </el-dialog>
</template>

<script>
import AMap from "@/views/amap";
export default {
  name: "",
  components: { AMap },
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
      // 弹窗显示/关闭标记
      dialogVisible: false,
    };
  },
  methods: {
    opened() {
      this.$refs.aMap.mapCreate();
      this.$nextTick(() => {
        const splitLngLat = this.data.lnglat.split(",");
        const lnglat = {
          lng: splitLngLat[0],
          lat: splitLngLat[1],
        };
        this.$refs.aMap.setMarker(lnglat);
      });
    },
    close() {
      this.$refs.aMap.mapDestroy();
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