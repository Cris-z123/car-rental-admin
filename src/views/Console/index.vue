<template>
  <div class="wrapper">
    <el-image style="width: 100px; height: 100px" :src="url" fit></el-image>
    <h2>欢迎进入汽车租赁管理后台</h2>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fit: ["fill"],
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    };
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 200px;
  h2 {
    font-size: 36px;
    font-weight: 600;
  }
}
</style>