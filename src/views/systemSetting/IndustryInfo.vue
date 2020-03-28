<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>行业管理</el-breadcrumb-item>
      <el-breadcrumb-item>行业信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="8" style="position: absolute;right: 1%" >
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.industry" clearable @clear="getIndustryList">
            <el-button slot="append" icon="el-icon-search" @click="getIndustryList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加行业</el-button>
        </el-col>
      </el-row>
      <el-table :data="industryList" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
        <el-table-column type="index"/>
        <el-table-column label="行业名称" prop="industry"/>
        <el-table-column label="状态" prop="status">
          <!--scope为这一行的数据-->
          <template slot-scope="scope">
            <!--active-value控制激活状态-->
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="industryStateChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!--提示-->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false" :open-delay="700">
              <!--操作按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false" :open-delay="700">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteIndustry(scope.row.id)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 3, 5, 8]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--添加用户的对话框-->
    <el-dialog title="添加行业" :visible.sync="addDialogVisible" @close="addDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" status-icon
               size="large" label-position="right" label-width="80px" class="addFrom">
          <el-form-item label="行业名称" prop="industry">
            <el-input v-model="addForm.industry" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addIndustry">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" @close="editDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
               size="large" label-position="right" label-width="80px" class="addFrom" status-icon>
          <el-form-item label="行业名称" prop="industry">
            <el-input v-model="editForm.industry" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateIndustry">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'industryInfo',
  data () {
    return {
      queryInfo: {
        industry: '',
        pageNum: 1,
        pageSize: 3
      },
      industryList: [],
      total: 0,
      imageUrl: '',
      // 控制对话框的显示
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加表单数据
      addForm: {
        industry: '',
        status: ''
      },
      editForm: {
        id: '',
        industry: '',
        status: ''
      },
      addFormRules: {
        industry: [
          {
            required: true,
            message: '请输入行业名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '行业名长度为1到10之间',
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        industry: [
          {
            required: true,
            message: '请输入行业名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '行业名长度为1到10之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getIndustryList()
  },
  methods: {
    async getIndustryList () {
      const { data: res } = await this.$http.get('/commonIndustryInfoController/selectAllForPage', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error('获取行业列表失败')
      this.industryList = res.data.dataList
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getIndustryList()
    },
    // 监听页码
    handleCurrentChange (newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getIndustryList()
    },
    // 监听添加对话框关闭操作
    addDialogClosed () {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      // 重置表单
      this.$refs.editFormRef.resetFields()
    },
    // 添加行业信息
    addIndustry () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/commonIndustryInfoController/insert', this.addForm)
        if (res.code !== 200) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        // 重新获取数据
        this.getIndustryList()
      })
    },
    // 显示编辑信息对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/commonIndustryInfoController/selectById/' + id)
      if (res.code !== 200) {
        this.$message.error('查找失败')
      }
      this.editForm = res.data
    },
    // 状态改变
    async industryStateChange (industryInfo) {
      const { data: res } = await this.$http.put('/commonIndustryInfoController/updateById', {
        id: industryInfo.id,
        status: industryInfo.status
      })
      if (res.code !== 200) {
        industryInfo.status = !industryInfo.status
        return this.$message.error('修改状态失败')
      }
    },
    // 更新行业
    updateIndustry () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/commonIndustryInfoController/updateById', this.editForm)
        if (res.code !== 200) {
          this.$message.error('更新失败')
        }
        this.editDialogVisible = false
        // 重新获取数据
        this.getIndustryList()
        this.$message.success('更新成功')
      })
    },
    // 删除行业
    async deleteIndustry (id) {
      const that = this
      this.$swal({
        title: '确定删除吗？',
        text: '你将无法恢复它！',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '确定删除！',
        allowOutsideClick: false
      }).then(async function (result) {
        if (result.dismiss === 'cancel') return
        const { data: res } = await that.$http.delete('/commonIndustryInfoController/deleteById/' + id)
        if (res.code !== 200) {
          return that.$message.error('删除失败')
        }
        await that.getIndustryList()
        that.$swal(
          '删除！',
          '已经被删除。',
          'success'
        )
      }).catch(this.$swal.noop)
    }
  }
}
</script>

<style lang="less" scoped>
  .expandFrom {
    color: #99a9bf;
    .el-form-item {
      width: 40%;
    }
  }
  .addFrom{
    .el-form-item{
      padding-left: 40px;
      margin-right: 120px;
    }
  }
</style>
