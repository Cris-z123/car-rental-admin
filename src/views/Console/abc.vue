<template>
  <div class="wrapper">
    <p>{{ newVal }}</p>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String, default: "" },
  },
  data() {
    return {
      newVal: this.value,
    };
  },
  watch: {
    value: {
      handler(newValue) {
        this.newVal = newValue;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 200px;
  width: 200px;
  border: 1px solid red;
}
</style>