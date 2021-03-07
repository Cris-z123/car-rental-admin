<template>
  <el-form ref="form" :model="formData" label-width="100px">
    <el-form-item
      v-for="item in formItem"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
      :rules="item.rules"
    >
      <el-input
        v-if="item.type === 'Input'"
        :placeholder="item.placeholder"
        v-model.trim="formData[item.prop]"
        :style="{ width: item.width }"
        :disabled="item.disabled"
        :readonly="item.readonly"
      ></el-input>
      <el-select
        v-if="item.type === 'Select'"
        :placeholder="item.placeholder"
        v-model="formData[item.prop]"
        :disabled="item.disabled"
      >
        <el-option
          v-for="selectItem in item.options"
          :key="selectItem.value"
          :label="selectItem.label"
          :value="selectItem.value"
        ></el-option>
      </el-select>
      <slot v-if="item.type === 'Slot'" :name="item.slotName"></slot>
      <el-radio-group
        v-if="item.type === 'Radio'"
        v-model="formData[item.prop]"
      >
        <el-radio
          v-for="radio in item.options"
          :label="radio.value"
          :key="radio.value"
          >{{ radio.label }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button
        v-for="item in formHandler"
        :key="item.key"
        :type="item.type"
        @click="item.handler && item.handler()"
        >{{ item.label }}</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "FormComponent",
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    formItem: {
      type: Array,
      default: () => [],
    },
    formHandler: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {},
    };
  },
  methods: {
    initFormData() {},
    resetForm() {
      this.$refs.form.resetFiedlds();
    },
  },
  watch: {
    formItem: {
      handler(newValue) {
        this.initFormData();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>