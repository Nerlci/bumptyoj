<template>
  <el-button type="primary" @click="openDialog">发布帖子</el-button>
</template>

<script>
export default {
  methods: {
    openDialog() {
      this.$emit('click');
    }
  }
}
</script>
