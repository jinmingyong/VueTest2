<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="8" style="position: absolute;right: 1%" >
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.username" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
        <el-table-column type="index"/>
        <el-table-column label="用户名称" prop="username"/>
        <el-table-column label="性别" prop="sex"/>
        <el-table-column label="电话" prop="phone"/>
        <el-table-column label="角色" prop="roleName"/>
        <el-table-column label="状态" prop="status">
          <!--scope为这一行的数据-->
          <template slot-scope="scope">
            <!--active-value控制激活状态-->
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              @change="usersStateChange(scope.row)"
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
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUsers(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false" :open-delay="700">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"/>
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" status-icon
               size="large" label-position="right" label-width="80px" class="addFrom">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="addForm.sex" label="男">男</el-radio>
          <el-radio v-model="addForm.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addForm.phone" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" @close="editDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
               size="large" label-position="right" label-width="80px" class="addFrom" status-icon>
        <el-form-item label="用户名:">
          <el-input v-model="editForm.username" disabled/>
        </el-form-item>
        <el-form-item label="性别:">
          <el-radio v-model="editForm.sex" label="男">男</el-radio>
          <el-radio v-model="editForm.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="电话号:" prop="phone">
          <el-input v-model="editForm.phone" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUsers">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" @close="setRoleDialogClosed" width="50%">
      <!--主体-->
      <div>
        <p>当前的用户： {{userInfo.username}}</p>
        <p>当前的角色： {{userInfo.roleName}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" style="width: 200px" placeholder="请选择角色">
          <el-option
            v-for="item in rolesList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId">
          </el-option>
        </el-select></p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'usersInfo',
  data () {
    // 验证手机号
    var checkPhone = (rule, value, cb) => {
      const reg = /^(13[0-9]|17[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('输入不合法'))
    }
    var checkUsername = async (rule, value, cb) => {
      const { data: res } = await this.$http.post('/usersController/selectUsersByUsername', { username: this.addForm.username })
      if (res.data === true) {
        return cb()
      } else {
        cb(new Error('用户名已存在'))
      }
    }
    return {
      queryInfo: {
        username: '',
        pageNum: 1,
        pageSize: 3
      },
      usersList: [],
      total: 0,
      imageUrl: '',
      // 控制对话框的显示
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      // 添加表单数据
      addForm: {
        username: '',
        sex: '男',
        phone: '',
        status: ''
      },
      editForm: {
        id: '',
        username: '',
        sex: '',
        phone: '',
        status: ''
      },
      userInfo: {},
      // 角色列表
      rolesList: {},
      // 已选择的角色
      selectedRoleId: '',
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '用户名长度为1到10之间',
            trigger: 'blur'
          },
          { validator: checkUsername, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      editFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '用户名长度为1到10之间',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUsersList()
  },
  methods: {
    async getUsersList () {
      const { data: res } = await this.$http.get('/commonUsersController/selectAllForPage', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error('获取用户列表失败')
      this.usersList = res.data.dataList
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getUsersList()
    },
    // 监听页码
    handleCurrentChange (newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getUsersList()
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
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = ''
    },
    // 添加用户信息
    addUsers () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/usersController/insertUsersInfo', this.addForm)
        if (res.code !== 200) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        // 重新获取数据
        this.getUsersList()
      })
    },
    // 显示编辑信息对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/commonUsersController/selectById/' + id)
      if (res.code !== 200) {
        return this.$message.error('查找失败')
      }
      this.editForm = res.data
      console.log(this.editForm)
    },
    // 状态改变
    async usersStateChange (usersInfo) {
      const { data: res } = await this.$http.put('/commonUsersController/updateById', {
        id: usersInfo.id,
        status: usersInfo.status
      })
      if (res.code !== 200) {
        usersInfo.status = !usersInfo.status
        return this.$message.error('修改状态失败')
      }
    },
    // 更新用户
    updateUsers () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/commonUsersController/updateById', this.editForm)
        if (res.code !== 200) {
          return this.$message.error('更新失败')
        }
        this.editDialogVisible = false
        // 重新获取数据
        this.getUsersList()
        this.$message.success('更新成功')
      })
    },
    // 删除用户
    async deleteUsers (id) {
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
        const { data: res } = await that.$http.delete('/usersController/deleteById/' + id)
        if (res.code !== 200) {
          return that.$message.error('删除失败')
        }
        that.queryInfo.pageNum = 1
        await that.getUsersList()
        that.$swal(
          '删除！',
          '已经被删除。',
          'success'
        )
      }).catch(this.$swal.noop)
    },
    // 展示分配角色对话框
    async setRole (userInfo) {
      this.userInfo = userInfo
      // 获取角色列表
      const { data: res } = await this.$http.get('/commonRolesController/selectAll')
      if (res.code !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('选择要分配的角色')
      }
      const { data: res } = await this.$http.put('/usersController/updateUserRole', {
        roleId: this.selectedRoleId,
        userId: this.userInfo.id
      })
      if (res.code !== 200) return this.$message.error('更新失败')
      this.$message.success('更新成功')
      this.getUsersList()
      this.setRoleDialogVisible = false
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
