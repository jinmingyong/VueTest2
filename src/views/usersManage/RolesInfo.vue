<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card class="box-card">
      <!--搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="8" style="position: absolute;right: 1%" >
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.roleName" clearable @clear="getRolesList">
            <el-button slot="append" icon="el-icon-search" @click="getRolesList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe :header-cell-style="{ 'font-size':'15px'}" style="width: 100%">
        <el-table-column type="expand">
          <template  slot-scope="scope">
            <el-row :class="['bdbottom',index===0 ? 'bdtop' :'','vcenter']" v-for="(item1,index) in scope.row.allResources" :key="item1.permissionId">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeById(scope.row,item1.permissionId)">
                  {{item1.name}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二级和三级-->
              <el-col :span="19">
                <el-row :class="[i2===0? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.permissionId" >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeById(scope.row,item2.permissionId)">
                      {{item2.name}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.permissionId" closable @close="removeById(scope.row,item3.permissionId)">
                      {{item3.name}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-form label-position="right" label-width="100px" class="expandFrom" inline >
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index"/>
        <el-table-column label="角色名称" prop="roleName"/>
        <el-table-column label="角色编号" prop="roleNumber"/>
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <!--提示-->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false" :open-delay="700">
              <!--操作按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.roleId)">编辑</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false" :open-delay="700">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(scope.row.roleId)">删除</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false" :open-delay="700">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetPermissionDialog(scope.row)">分配权限</el-button>
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
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" @close="addDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" status-icon
               size="large" label-position="right" label-width="80px" class="addFrom">
       <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" />
       </el-form-item>
        <el-form-item label="角色编号" prop="roleNumber">
          <el-input v-model="addForm.roleNumber" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" @close="editDialogClosed" width="30%">
      <!--主体-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
               size="large" label-position="right" label-width="80px" class="addFrom" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" />
        </el-form-item>
        <el-form-item label="角色编号" prop="roleNumber">
          <el-input v-model="editForm.roleNumber" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRoles">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="setPermssionDialogVisible" @close="PermissionDialogClosed" width="50%">
      <!--主体-->
      <el-tree
        :data="permissionList"
        ref="treeRef"
        show-checkbox
        node-key="permissionId"
        default-expand-all
        check-on-click-node
        :default-checked-keys="defKeys"
        :props="treeProps">
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePermission">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'rolesInfo',
  data () {
    return {
      queryInfo: {
        roleName: '',
        pageNum: 1,
        pageSize: 3
      },
      list: [{ children: [] }],
      permissionList: [],
      rolesList: [],
      total: 0,
      imageUrl: '',
      // 控制对话框的显示
      addDialogVisible: false,
      editDialogVisible: false,
      setPermssionDialogVisible: false,
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'name',
        children: 'children'
      },
      // 默认选中的选项
      defKeys: [],
      // 更新权限时的角色Id
      roleId: '',
      // 添加表单数据
      addForm: {
        roleName: '',
        roleNumber: ''
      },
      editForm: {
        roleId: '',
        roleName: '',
        roleNumber: ''
      },
      addFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '角色名长度为1到10之间',
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '角色名长度为1到10之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('/menuResourceManagementController/allResourceForTree', { params: this.queryInfo })
      if (res.code !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data.dataList
      this.total = res.data.total
    },
    // 监听pagesize
    handleSizeChange (newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pageSize = newPageSize
      this.getRolesList()
    },
    // 监听页码
    handleCurrentChange (newCurrPage) {
      // console.log(newCurrPage)
      this.queryInfo.pageNum = newCurrPage
      this.getRolesList()
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
    PermissionDialogClosed() {
      this.defKeys = []
      this.roleId = ''
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
    // 添加角色信息
    addRoles () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/commonRolesController/insert', this.addForm)
        if (res.code !== 200) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        // 重新获取数据
        this.getRolesList()
      })
    },
    // 显示编辑信息对话框
    async showEditDialog (rolesId) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('/commonRolesController/selectById/' + rolesId)
      if (res.code !== 200) {
        this.$message.error('查找失败')
      }
      this.editForm = res.data
    },
    // 更新角色
    updateRoles () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/commonRolesController/updateById', this.editForm)
        if (res.code !== 200) {
          this.$message.error('更新失败')
        }
        this.editDialogVisible = false
        // 重新获取数据
        this.getRolesList()
        this.$message.success('更新成功')
      })
    },
    // 删除角色
    async deleteRoles (roleId) {
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
        const { data: res } = await that.$http.delete('/roleController/deleteById/' + roleId)
        if (res.code !== 200) {
          return that.$message.error(res.msg)
        }
        await that.getRolesList()
        that.$swal(
          '删除！',
          '已经被删除。',
          'success'
        )
      }).catch(this.$swal.noop)
    },
    async removeById (role, permissionId) {
      const configResult = await this.$confirm('删除此权限', '是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (configResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$http.get('/roleController/deleteRolePermission', {
        params: {
          roleId: role.roleId,
          permissionId: permissionId
        }
      })
      if (res.code !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.allResources = res.data.allResources
      this.$message.success('已删除')
    },
    async showSetPermissionDialog (role) {
      // 获取权限数据
      const { data: res } = await this.$http.get('/menuResourceManagementController/selectAllResourceForTree')
      if (res.code !== 200) { return this.$message.error('获取权限数据失败') }
      this.permissionList = res.data
      // 递归获取节点role.allResources
      this.list.children = role.allResources
      this.roleId = role.roleId
      this.getLeafKeys(this.list, this.defKeys)
      this.setPermssionDialogVisible = true
    },
    // 递归获得三级权限的id
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.permissionId)
      }
      node.children.forEach(item =>
        this.getLeafKeys(item, arr)
      )
    },
    async updatePermission () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const { data: res } = await this.$http.put('/roleController/updateRolePermission', {
        roleId: this.roleId,
        permIds: keys
      })
      if (res.code !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('更新权限成功')
      this.getRolesList()
      this.setPermssionDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
 .el-tag{
   margin: 7px;
 }
 .bdtop{
    border-top:  1px solid #f0f0f0;
  }
.bdbottom{
   border-bottom:  1px solid #f0f0f0;
 }
 .vcenter{
   display: flex;
   align-items: center;
 }
</style>
