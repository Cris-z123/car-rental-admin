<template>
  <div ref="editorDom"></div>
</template>

<script>
import Editor from "wangeditor";
export default {
  data() {
    return {
      editor: null,
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.createEditor();
  },
  watch: {
    value: {
      handler(newValue) {
        this.editor.txt.html(newValue);
      },
    },
  },
  methods: {
    createEditor() {
      this.editor = new Editor(this.$refs.editorDom);
      this.editor.customConfig.onchange = (html) => {
        this.$emit("update:content", html);
      };
      this.editor.create(); // 创建富文本实例
    },
    clearContent() {
      this.editor.txt.clear();
    },
  },
};
</script>

<style>
</style>