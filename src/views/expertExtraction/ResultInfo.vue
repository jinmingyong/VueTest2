<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>抽取结果</el-breadcrumb-item>
      <el-breadcrumb-item>抽取结果</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'resultInfo'
}
</script>

<style scoped>

</style>
