<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资源管理</el-breadcrumb-item>
      <el-breadcrumb-item>资源信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="8" style="position: absolute;right: 1%" >
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.resourceName" clearable @clear="getResourceList">
            <el-button slot="append" icon="el-icon-search" @click="getResourceList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 50px">
        <el-table :data="resourceList" stripe border :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
        <el-table-column type="index"/>
        <el-table-column label="资源名称" prop="name"/>
        <el-table-column label="资源路径" prop="url"/>
        <el-table-column label="资源等级" prop="type"
        :filters="[{ text: '一级', value:1 }, { text: '二级', value:2 }, { text: '三级', value:3 }]"
        :filter-method="filterTag"
        filter-placement="bottom">
          <template slot-scope="scope">
            <el-tag  type="danger" v-if="scope.row.type ===1">一级</el-tag>
            <el-tag  type="success" v-else-if="scope.row.type ===2">二级</el-tag>
            <el-tag  type="waring" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
        <!--分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[5, 8, 12, 15]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'resourceInfo',
  data () {
    return {
      queryInfo: {
        resourceName: '',
        pageNum: 1,
        pageSize: 8
      },
      resourceList: [],
      total: 0
    }
  },
  created () {
    this.getResourceList()
  },
  methods: {
    async getResourceList () {
      const { data: res } = await this.$http.get('/menuResourceManagementController/selectAllResource', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error('获取资源列表失败')
      this.resourceList = res.data.dataList
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getResourceList()
    },
    // 监听页码
    handleCurrentChange (newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getResourceList()
    },
    filterTag(value, row) {
      return row.type === value
    }
  }
}
</script>

<style lang="less" scoped>

</style>
