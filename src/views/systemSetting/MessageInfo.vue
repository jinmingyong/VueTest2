<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>消息管理</el-breadcrumb-item>
      <el-breadcrumb-item>消息信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加消息</el-button>
        </el-col>
      </el-row>
      <el-table :data="systemMessageList" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
        <el-table-column type="index"/>
        <el-table-column label="消息内容" prop="mesInfo"/>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!--提示-->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false" :open-delay="700">
              <!--操作按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.messageId)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false" :open-delay="700">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSystemMessage(scope.row.messageId)"/>
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
    <el-dialog title="添加消息" :visible.sync="addDialogVisible" @close="addDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" status-icon
               size="large" label-position="right" label-width="80px" class="addFrom">
          <el-form-item label="消息内容" prop="mesInfo">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                      maxlength="500"
                      show-word-limit
                      v-model="addForm.mesInfo" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSystemMessage">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" @close="editDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
               size="large" label-position="right" label-width="80px" class="addFrom" status-icon>
          <el-form-item label="消息名称" prop="mesInfo">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                      maxlength="500"
                      show-word-limit
                      v-model="editForm.mesInfo" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSystemMessage">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'systemMessageInfo',
  data () {
    var checkMessage = (rule, value, cb) => {
      const reg = /(\{expertName\})/
      const reg2 = /(\{createTime\})/
      const reg3 = /(\{projectName\})/
      if (value === null) { return cb() }
      if (reg.test(value) && reg2.test(value) && reg3.test(value)) {
        return cb()
      }
      cb(new Error('必须包含{expertName}、{createTime}、{projectName}'))
    }
    return {
      queryInfo: {
        pageNum: 1,
        pageSize: 3
      },
      systemMessageList: [],
      total: 0,
      imageUrl: '',
      // 控制对话框的显示
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加表单数据
      addForm: {
        mesInfo: ''
      },
      editForm: {
        messageId: '',
        mesInfo: ''
      },
      addFormRules: {
        mesInfo: [{
          validator: checkMessage,
          trigger: 'blur'
        }]
      },
      editFormRules: {
        mesInfo: [{
          validator: checkMessage,
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getSystemMessageList()
  },
  methods: {
    getSystemMessageList: async function () {
      const { data: res } = await this.$http.get('/commonSystemMessageController/selectAllForPage', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error('获取消息列表失败')
      this.systemMessageList = res.data.dataList
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getSystemMessageList()
    },
    // 监听页码
    handleCurrentChange (newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getSystemMessageList()
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
    // 添加消息信息
    addSystemMessage () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/commonSystemMessageController/insert', this.addForm)
        if (res.code !== 200) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        // 重新获取数据
        this.getSystemMessageList()
      })
    },
    // 显示编辑信息对话框
    async showEditDialog (messageId) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/commonSystemMessageController/selectById/' + messageId)
      if (res.code !== 200) {
        return this.$message.error('查找失败')
      }
      this.editForm = res.data
    },
    // 更新消息
    updateSystemMessage () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/commonSystemMessageController/updateById', this.editForm)
        if (res.code !== 200) {
          return this.$message.error('更新失败')
        }
        this.editDialogVisible = false
        // 重新获取数据
        this.getSystemMessageList()
        this.$message.success('更新成功')
      })
    },
    // 删除消息
    async deleteSystemMessage (messageId) {
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
        const { data: res } = await that.$http.delete('/commonSystemMessageController/deleteById/' + messageId)
        if (res.code !== 200) {
          return that.$message.error('删除失败')
        }
        that.queryInfo.pageNum = 1
        await that.getSystemMessageList()
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
