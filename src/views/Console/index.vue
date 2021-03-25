<template>
  <div class="wrapper">
    <el-image
      class="el-image"
      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      fit="contain"
    ></el-image>
    <h2>欢迎进入汽车租赁管理后台</h2>
    <ABC :value="id"></ABC>
    <div class="el-image">{{ id }}</div>
    <button @click="add">+1</button>
  </div>
</template>
<script>
import ABC from "./abc.vue";
export default {
  components: {
    ABC,
  },
  data() {
    return {
      id: "123",
    };
  },
  methods: {
    add() {
      this.id += 1;
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 120px;
  h2 {
    font-size: 36px;
    font-weight: 600;
  }
  .el-image {
    width: 200px;
    height: 200px;
  }
}
</style>