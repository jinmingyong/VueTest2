<template>
  <div>
    <!--面包屑导航栏-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人主页</el-breadcrumb-item>
    </el-breadcrumb>
      <el-tabs tab-position="left" style="height: 500px;width: 800px;margin: 30px auto" type="border-card" @tab-click="clickTabs" :value="tabsValue">
        <el-tab-pane name="personalInfo">
          <span slot="label"><i class="iconfont icon-usercenter" style="vertical-align: middle"></i> 个人信息</span>
          <el-form style="margin:20px 0 0 20px">
            <el-form-item label="用户名:">
              <span>{{users.username}}</span>
            </el-form-item>
            <el-form-item label="性别:">
              <span style="margin-left: 15px">{{users.sex}}</span>
            </el-form-item>
            <el-form-item label="电话号:">
              <span>{{users.phone}}</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane name="edit">
          <span slot="label"><i class="iconfont icon-editor" style="vertical-align: middle"></i> 修改信息</span>
          <el-form style="margin-top: 40px;width: 300px;margin-bottom: 80px" :model="editForm" :rules="editFormRules" ref="editFormRef"
                   size="large" label-position="right" label-width="80px" status-icon>
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
          <el-divider><i class="iconfont icon-save"></i></el-divider>
          <div style="text-align: center;margin-top: 50px">
            <el-button type="primary" icon="el-icon-edit"  @click="updateUser">保存</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane name="editPassword">
          <span slot="label"><i class="iconfont icon-password" style="vertical-align: middle"></i> 修改密码</span>
          <el-form style="margin-top: 40px;width: 350px;margin-bottom: 80px" :model="editPasswordForm" :rules="editPasswordFormRules" ref="editPasswordFormRef"
                   size="large" label-position="right" label-width="120px" status-icon>
            <el-form-item label="输入旧密码:" prop="oldPassword">
              <el-input type="password" v-model="editPasswordForm.oldPassword" />
            </el-form-item>
            <el-form-item label="输入新密码:" prop="newPassword">
              <el-input type="password" v-model="editPasswordForm.newPassword" />
            </el-form-item>
            <el-form-item label="再次输入新密码:" prop="checkNewPassword">
              <el-input type="password" v-model="editPasswordForm.checkNewPassword" />
            </el-form-item>
          </el-form>
          <el-divider><i class="iconfont icon-save"></i></el-divider>
          <div style="text-align: center;margin-top: 50px">
            <el-button type="primary" icon="el-icon-edit" @click="updateUser">保存</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="iconfont icon-guanliyuan" style="vertical-align: middle"></i> 查看角色</span>
          <div style="margin: 50px 0 0 20px">
            您目前的角色为：
            <el-tag :type="typeList[users.roleId]" effect="dark">{{users.roleName}}</el-tag>
          </div>
        </el-tab-pane>
        <el-tab-pane name="message">
          <span slot="label"><i class="iconfont icon-messagecenter" style="vertical-align: middle"></i> 消息管理</span>
          消息
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'personalInfo',
  data () {
    // 验证手机号
    var checkPhone = (rule, value, cb) => {
      const reg = /^(13[0-9]|17[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('输入不合法'))
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.editPasswordForm.oldPassword !== '' || this.editPasswordForm.newPassword !== '') {
          this.$refs.editPasswordFormRef.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editPasswordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      users: {
      },
      // 对应的标签样式
      typeList: {
        1: 'danger',
        2: ''
      },
      // 默认点开哪个
      tabsValue: '',
      editForm: {},
      editPasswordForm: {
        id: '',
        username: '',
        oldPassword: '',
        newPassword: '',
        checkNewPassword: ''
      },
      editFormRules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      editPasswordFormRules: {
        oldPassword: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 15, message: '长度为6到15之间', trigger: 'blur' }
        ],
        newPassword: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 15, message: '长度为6到15之间', trigger: 'blur' }
        ],
        checkNewPassword: [
          { validator: validatePass2, trigger: 'blur' },
          { min: 6, max: 15, message: '长度为6到15之间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getPersonalInfo()
    this.tabsValue = window.sessionStorage.getItem('tabsValue')
  },
  methods: {
    async getPersonalInfo () {
      const { data: res } = await this.$http.get('/personalInfoController/getUserInfoByToken')
      if (res.code !== 200) {
        this.$message.error('获取个人信息失败')
      }
      this.users = res.data
      this.editForm = this.users
    },
    clickTabs (targetName) {
      window.sessionStorage.setItem('tabsValue', targetName.name)
      switch (targetName.name) {
        case 'edit':
          this.editForm = this.users
          break
        case 'editPassword':
          this.editPasswordForm.id = this.users.id
          this.editPasswordForm.username = this.users.username
          break
        default:
      }
    },
    async updateUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/commonUsersController/updateById', this.editForm)
        if (res.code !== 200) {
          this.$message.error('更新失败')
        }
        this.getPersonalInfo()
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
