<template>
<div>
  <!--面包屑导航栏-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>专家管理</el-breadcrumb-item>
    <el-breadcrumb-item>专家信息</el-breadcrumb-item>
  </el-breadcrumb>
  <!--卡片区域-->
  <el-card class="box-card">
    <!--搜索框区域-->
    <el-row :gutter="20">
      <el-col :span="8" style="position: absolute;right: 1%">
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary">添加专家</el-button>
      </el-col>
    </el-row>
  </el-card>
</div>
</template>

<script>
export default {
  name: 'expertInfo',
  data() {
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 2
      },
      expertList: [],
      total: 0
    }
  },
  created () {
    this.getExpertList()
  },
  methods: {
    async getExpertList() {
      const { data: res } = await this.$http.get('/commonExpertInfoController/selectAllForPage', { params: this.queryInfo })
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取专家列表失败')
      this.expertList = res.data.dataList
    }
  }
}
</script>

<style lang="less" scoped>

</style>
