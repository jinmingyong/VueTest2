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
      <el-col :span="8" style="position: absolute;right: 1%" >
        <el-input placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary">添加专家</el-button>
      </el-col>
    </el-row>
    <el-table :data="expertList" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
      <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="right" class="expandFrom" inline size="medium">
          <div style="width:80%;display:inline-block">
          <el-form-item label="生日">
            <span>{{ props.row.birthday }}</span>
          </el-form-item>
          <el-form-item label="民族">
            <span>{{ props.row.nationlity }}</span>
          </el-form-item>
          <el-form-item label="身份证号">
            <span>{{ props.row.icCard }}</span>
          </el-form-item>
          <el-form-item label="职务">
            <span>{{ props.row.job }}</span>
          </el-form-item>
          <el-form-item label="职称">
            <span>{{ props.row.jobGrade }}</span>
          </el-form-item>
          <el-form-item label="所属行业">
            <span>{{ props.row.industry }}</span>
          </el-form-item>
          <el-form-item label="工作单位">
            <span>{{ props.row.company }}</span>
          </el-form-item>
          <el-form-item label="工作年限">
            <span>{{ props.row.workingYear }}</span>
          </el-form-item>
          <el-form-item label="学历">
            <span>{{ props.row.degree }}</span>
          </el-form-item>
          <el-form-item label="专业类型">
            <span>{{ props.row.major }}</span>
          </el-form-item>
          <el-form-item label="毕业学院">
            <span>{{ props.row.college }}</span>
          </el-form-item>
          <el-form-item label="手机号">
            <span>{{ props.row.phone }}</span>
          </el-form-item>
          <el-form-item label="座机号">
            <span>{{ props.row.tellPhone }}</span>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <span>{{ props.row.email }}</span>
          </el-form-item>
          <el-form-item label="所在城市">
            <span>{{ props.row.city }}</span>
          </el-form-item>
          </div>
          <div style="display: inline-block;width: 20%;height: 300px;position: absolute;top: 5%;">
            <el-form-item label="个人照片" style="width: 100%">
              <img src="" style="width: 200px;height: 180px">{{ props.row.picture }}
            </el-form-item>
            <el-form-item label="评价分数" style="position: absolute;bottom: 0;width: 100%;left: 0;">
              <div style="display: inline-block;width: 50px;height: 50px">1111<span>{{ props.row.estimate }}</span></div>
            </el-form-item>
          </div>
        </el-form>
      </template>
      </el-table-column>
      <el-table-column type="index"/>
      <el-table-column label="姓名" prop="name"/>
      <el-table-column label="年龄" prop="age"/>
      <el-table-column label="性别" prop="sex"/>
      <el-table-column label="状态" prop="status">
        <!--scope为这一行的数据-->
        <template slot-scope="scope">
          <!--active-value控制激活状态-->
          <el-switch
          v-model="scope.row.status"
          active-value="1"
          inactive-value="0"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
          <el-button type="danger" icon="el-icon-delete" size="mini"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
          <el-button type="primary" icon="el-icon-edit" size="mini"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[1, 5, 8, 10]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
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
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange(newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getExpertList()
    },
    // 监听页码
    handleCurrentChange(newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getExpertList()
    }
  }
}
</script>

<style lang="less" scoped>
  .expandFrom {
    color: #99a9bf;
    .el-form-item {
      width: 30%;
    }
  }

</style>
