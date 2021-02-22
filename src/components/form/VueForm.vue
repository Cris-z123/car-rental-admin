<template>
  <el-form
    ref="form"
    :rules="rules"
    :inline="true"
    :model="form"
    label-width="100px"
  >
    <el-form-item label="车辆品牌：">
      <el-input v-model="form.brand" placeholder="请输入车辆品牌"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "",
};
</script>

<style lang="scss" scoped>
</style>