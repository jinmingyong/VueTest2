<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>单位管理</el-breadcrumb-item>
      <el-breadcrumb-item>单位信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="8" style="position: absolute;right: 1%" >
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.company" clearable @clear="getCompanyList">
            <el-button slot="append" icon="el-icon-search" @click="getCompanyList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加单位</el-button>
        </el-col>
      </el-row>
      <el-table :data="companyList" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
        <el-table-column type="index"/>
        <el-table-column label="单位名称" prop="company"/>
        <el-table-column label="状态" prop="status">
          <!--scope为这一行的数据-->
          <template slot-scope="scope">
            <!--active-value控制激活状态-->
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="companyStateChange(scope.row)"
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
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCompany(scope.row.id)"/>
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
    <el-dialog title="添加单位" :visible.sync="addDialogVisible" @close="addDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" status-icon
               size="large" label-position="right" label-width="80px" class="addFrom">
          <el-form-item label="单位名称" prop="company">
            <el-input v-model="addForm.company" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCompany">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" @close="editDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
               size="large" label-position="right" label-width="80px" class="addFrom" status-icon>
          <el-form-item label="单位名称" prop="company">
            <el-input v-model="editForm.company" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCompany">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'companyInfo',
  data () {
    return {
      queryInfo: {
        company: '',
        pageNum: 1,
        pageSize: 3
      },
      companyList: [],
      total: 0,
      imageUrl: '',
      // 控制对话框的显示
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加表单数据
      addForm: {
        company: '',
        status: ''
      },
      editForm: {
        id: '',
        company: '',
        status: ''
      },
      addFormRules: {
        company: [
          {
            required: true,
            message: '请输入单位名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '单位名长度为1到10之间',
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        company: [
          {
            required: true,
            message: '请输入单位名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '单位名长度为1到10之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getCompanyList()
  },
  methods: {
    async getCompanyList () {
      const { data: res } = await this.$http.get('/commonCompanyInfoController/selectAllForPage', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error('获取单位列表失败')
      this.companyList = res.data.dataList
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getCompanyList()
    },
    // 监听页码
    handleCurrentChange (newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getCompanyList()
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
    // 添加单位信息
    addCompany () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/commonCompanyInfoController/insert', this.addForm)
        if (res.code !== 200) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        // 重新获取数据
        this.getCompanyList()
      })
    },
    // 显示编辑信息对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/commonCompanyInfoController/selectById/' + id)
      if (res.code !== 200) {
        this.$message.error('查找失败')
      }
      this.editForm = res.data
    },
    // 状态改变
    async companyStateChange (companyInfo) {
      const { data: res } = await this.$http.put('/commonCompanyInfoController/updateById', {
        id: companyInfo.id,
        status: companyInfo.status
      })
      if (res.code !== 200) {
        companyInfo.status = !companyInfo.status
        return this.$message.error('修改状态失败')
      }
    },
    // 更新单位
    updateCompany () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/commonCompanyInfoController/updateById', this.editForm)
        if (res.code !== 200) {
          this.$message.error('更新失败')
        }
        this.editDialogVisible = false
        // 重新获取数据
        this.getCompanyList()
        this.$message.success('更新成功')
      })
    },
    // 删除单位
    async deleteCompany (id) {
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
        const { data: res } = await that.$http.delete('/commonCompanyInfoController/deleteById/' + id)
        if (res.code !== 200) {
          return that.$message.error('删除失败')
        }
        await that.getCompanyList()
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
    .avatar-uploader{
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
</style>
