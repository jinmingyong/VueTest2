<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专业管理</el-breadcrumb-item>
      <el-breadcrumb-item>专业信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="8" style="position: absolute;right: 1%" >
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.major" clearable @clear="getMajorList">
            <el-button slot="append" icon="el-icon-search" @click="getMajorList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加专业</el-button>
        </el-col>
      </el-row>
      <el-table :data="majorList" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
        <el-table-column type="index"/>
        <el-table-column label="专业名称" prop="major"/>
        <el-table-column label="状态" prop="status">
          <!--scope为这一行的数据-->
          <template slot-scope="scope">
            <!--active-value控制激活状态-->
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="majorStateChange(scope.row)"
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
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteMajor(scope.row.id)"/>
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
    <el-dialog title="添加专业" :visible.sync="addDialogVisible" @close="addDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" status-icon
               size="large" label-position="right" label-width="80px" class="addFrom">
          <el-form-item label="专业名称" prop="major">
            <el-input v-model="addForm.major" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMajor">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" @close="editDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
               size="large" label-position="right" label-width="80px" class="addFrom" status-icon>
          <el-form-item label="专业名称" prop="major">
            <el-input v-model="editForm.major" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateMajor">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'majorInfo',
  data () {
    return {
      queryInfo: {
        major: '',
        pageNum: 1,
        pageSize: 3
      },
      majorList: [],
      total: 0,
      imageUrl: '',
      // 控制对话框的显示
      addDialogVisible: false,
      editDialogVisible: false,
      // 添加表单数据
      addForm: {
        major: '',
        status: ''
      },
      editForm: {
        id: '',
        major: '',
        status: ''
      },
      addFormRules: {
        major: [
          {
            required: true,
            message: '请输入专业名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '专业名长度为1到10之间',
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        major: [
          {
            required: true,
            message: '请输入专业名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '专业名长度为1到10之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getMajorList()
  },
  methods: {
    async getMajorList () {
      const { data: res } = await this.$http.get('/commonMajorInfoController/selectAllForPage', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error('获取专业列表失败')
      this.majorList = res.data.dataList
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getMajorList()
    },
    // 监听页码
    handleCurrentChange (newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getMajorList()
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
    // 添加专业信息
    addMajor () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/commonMajorInfoController/insert', this.addForm)
        if (res.code !== 200) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        // 重新获取数据
        this.getMajorList()
      })
    },
    // 显示编辑信息对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/commonMajorInfoController/selectById/' + id)
      if (res.code !== 200) {
        return this.$message.error('查找失败')
      }
      this.editForm = res.data
    },
    // 状态改变
    async majorStateChange (majorInfo) {
      const { data: res } = await this.$http.put('/commonMajorInfoController/updateById', {
        id: majorInfo.id,
        status: majorInfo.status
      })
      if (res.code !== 200) {
        majorInfo.status = !majorInfo.status
        return this.$message.error('修改状态失败')
      }
    },
    // 更新专业
    updateMajor () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/commonMajorInfoController/updateById', this.editForm)
        if (res.code !== 200) {
          return this.$message.error('更新失败')
        }
        this.editDialogVisible = false
        // 重新获取数据
        this.getMajorList()
        this.$message.success('更新成功')
      })
    },
    // 删除专业
    async deleteMajor (id) {
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
        const { data: res } = await that.$http.delete('/commonMajorInfoController/deleteById/' + id)
        if (res.code !== 200) {
          return that.$message.error('删除失败')
        }
        that.queryInfo.pageNum = 1
        await that.getMajorList()
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
