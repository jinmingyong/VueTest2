<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>抽取结果</el-breadcrumb-item>
      <el-breadcrumb-item>抽取结果</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="8" style="position: absolute;right: 1%" >
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.proName" clearable @clear="getResultList">
            <el-button slot="append" icon="el-icon-search" @click="getResultList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 50px">
        <el-table :data="resultList" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.children" stripe border :header-cell-style="{ 'font-size':'13px'}">
                <el-table-column type="index"/>
                <el-table-column label="专家名字" prop="name"/>
                <el-table-column label="年龄" prop="age"/>
                <el-table-column label="性别" prop="sex"/>
                <el-table-column label="职称" prop="jobGrade"/>
                <el-table-column label="行业" prop="industry"/>
                <el-table-column label="单位" prop="company"/>
                <el-table-column label="专业" prop="major"/>
                <el-table-column label="城市" prop="city"/>
                <el-table-column label="发送情况">
                  <template slot-scope="scope">
                    <span v-if="scope.row.flagEmail==='0'">发送失败<i class="iconfont icon-close" style="color: #c90015;vertical-align: bottom"></i></span>
                    <span v-else-if="scope.row.flagEmail==='1'">发送成功<i class="iconfont icon-check" style="color: #25c91b;vertical-align: bottom"></i></span>
                    <span v-else>未发送<i class="iconfont icon-question" style="color: #ecee00;vertical-align: bottom"></i></span>
                  </template>
                </el-table-column>
                <el-table-column label="是否参加" prop="flagSts">
                  <template slot-scope="scope">
                    <span v-if="scope.row.flagSts==='0'">不参加<i class="iconfont icon-close" style="color: #c90015;vertical-align: bottom"></i></span>
                    <span v-else-if="scope.row.flagSts==='1'">参加<i class="iconfont icon-check" style="color: #25c91b;vertical-align: bottom"></i></span>
                    <span v-else>未确认<i class="iconfont icon-question" style="color: #ecee00;vertical-align: bottom"></i></span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index"/>
          <el-table-column label="项目名称" prop="proName"/>
          <el-table-column label="抽取类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type==='1'">直接抽取</span>
              <span v-else-if="scope.row.type==='2'">随机抽取</span>
              <span v-else>补足抽取</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime"/>
          <el-table-column v-if="resultList.type !== '3'" label="抽取次数" prop="extractNum"/>
          <el-table-column v-else label="抽取次数" prop="moreExtNum"/>
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
      <el-dialog title="最新结果" :visible.sync="DialogVisible" width="70%">
        <el-table :data="newResult" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%;min-height: 500px">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.children" stripe border :header-cell-style="{ 'font-size':'13px'}">
                <el-table-column type="index"/>
                <el-table-column label="专家名字" prop="name"/>
                <el-table-column label="年龄" prop="age"/>
                <el-table-column label="性别" prop="sex"/>
                <el-table-column label="职称" prop="jobGrade"/>
                <el-table-column label="行业" prop="industry"/>
                <el-table-column label="单位" prop="company"/>
                <el-table-column label="专业" prop="major"/>
                <el-table-column label="城市" prop="city"/>
                <el-table-column label="发送情况">
                  <template slot-scope="scope">
                    <span v-if="scope.row.flagEmail==='0'">发送失败<i class="iconfont icon-close" style="color: #c90015;vertical-align: bottom"></i></span>
                    <span v-else-if="scope.row.flagEmail==='1'">发送成功<i class="iconfont icon-check" style="color: #25c91b;vertical-align: bottom"></i></span>
                    <span v-else>未发送<i class="iconfont icon-question" style="color: #ecee00;vertical-align: bottom"></i></span>
                  </template>
                </el-table-column>
                <el-table-column label="是否参加" prop="flagSts">
                  <template slot-scope="scope">
                    <span v-if="scope.row.flagSts==='0'">不参加<i class="iconfont icon-close" style="color: #c90015;vertical-align: bottom"></i></span>
                    <span v-else-if="scope.row.flagSts==='1'">参加<i class="iconfont icon-check" style="color: #25c91b;vertical-align: bottom"></i></span>
                    <span v-else>未确认<i class="iconfont icon-question" style="color: #ecee00;vertical-align: bottom"></i></span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column type="index"/>
          <el-table-column label="项目名称" prop="proName"/>
          <el-table-column label="抽取类型">
            <template slot-scope="scope">
              <span v-if="scope.row.type==='1'">直接抽取</span>
              <span v-else-if="scope.row.type==='2'">随机抽取</span>
              <span v-else>补足抽取</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime"/>
          <el-table-column v-if="resultList.type !== '3'" label="抽取次数" prop="extractNum"/>
          <el-table-column v-else label="抽取次数" prop="moreExtNum"/>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="DialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'resultInfo',
  data () {
    return {
      queryInfo: {
        proName: '',
        pageNum: 1,
        pageSize: 8
      },
      resultList: [],
      total: 0,
      newResult: [],
      DialogVisible: false
    }
  },
  created () {
    this.getResultList()
    const resId = this.$route.params.resultId
    if (resId) { this.getNewResult(resId) }
  },
  methods: {
    async getResultList () {
      const { data: res } = await this.$http.get('/expertExtractionController/selectAllResult', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error('获取结果列表失败')
      this.resultList = res.data.dataList
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getResultList()
    },
    // 监听页码
    handleCurrentChange (newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getResultList()
    },
    async getNewResult (resId) {
      this.newResult = []
      this.DialogVisible = true
      const { data: res } = await this.$http.get('/expertExtractionController/selectResultById', { params: { resId: resId } })
      if (res.code !== 200) return this.$message.error('查询失败')
      this.newResult.push(res.data)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
