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
            <el-button type="primary" icon="el-icon-edit" @click="updatePassword">保存</el-button>
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
          <span slot="label"><i class="iconfont icon-messagecenter" style="vertical-align: middle"></i> <el-badge :value="newMessageCount" :hidden="newMessageCount !==0?false:true ">消息管理</el-badge></span>
            <div v-for="item in messageList" :key="item.mesId" style="margin: 20px 0">
              <el-badge value="new">
                <el-card shadow="hover" style="width:580px;">
                  <div slot="header">
                    <span>{{item.mesTitle}}</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="showreplyDialog(item)">回复</el-button>
                  </div>
                  <div>
                    <p>{{item.mesContent}}</p>
                  </div>
                </el-card>
              </el-badge>
            </div>
        </el-tab-pane>
      </el-tabs>
    <el-dialog title="回复消息" :visible.sync="replyDialogVisible"  width="50%">
      <!--主体-->
     <div>
       {{message.mesContent}}
     </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="replyMessage('0')">不参加</el-button>
        <el-button type="primary" @click="replyMessage('1')">参加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Utils from '../../assets/util.js'
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
      },
      replyDialogVisible: false,
      messageList: [],
      message: {},
      newMessageCount: 0
    }
  },
  created () {
    this.getPersonalInfo()
    this.getNewMessageCount()
    this.tabsValue = window.sessionStorage.getItem('tabsValue')
    if (this.tabsValue === 'message') {
      this.getMessage()
    }
  },
  methods: {
    async getPersonalInfo () {
      const { data: res } = await this.$http.get('/personalInfoController/getUserInfoByToken')
      if (res.code !== 200) {
        return this.$message.error('获取个人信息失败')
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
        case 'message':
          this.getMessage()
          break
        default:
      }
    },
    // 编辑信息
    async updateUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/commonUsersController/updateById', this.editForm)
        if (res.code !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('修改成功')
        this.getPersonalInfo()
      })
    },
    // 修改密码
    async updatePassword() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/personalInfoController/updatePasswordByToken', this.editPasswordForm)
        if (res.code !== 200) {
          if (res.msg === '旧密码错误') {
            this.$refs.editPasswordFormRef.fields[0].validateMessage = res.msg
            this.$refs.editPasswordFormRef.fields[0].validateState = 'error'
            return
          } else {
            this.$refs.editPasswordFormRef.fields[1].validateMessage = res.msg
            this.$refs.editPasswordFormRef.fields[1].validateState = 'error'
            return
          }
        }
        this.$swal(
          '修改密码成功',
          '请重新登录',
          'success'
        )
        await this.$router.push('/login')
      })
    },
    async getMessage () {
      const { data: res } = await this.$http.get('/personalInfoController/selectMessageByToken')
      if (res.code !== 200) {
        return this.$message.error('获取消息失败')
      }
      this.messageList = res.data
    },
    showreplyDialog(row) {
      this.message = row
      this.replyDialogVisible = true
    },
    async replyMessage (flagSts) {
      const { data: res } = await this.$http.put('/personalInfoController/replayMessage', {
        mesId: this.message.mesId,
        resId: this.message.resId,
        expId: this.message.expId,
        flagSts: flagSts
      })
      if (res.code !== 200) {
        return this.$message.error('回复失败')
      }
      this.replyDialogVisible = false
      this.getMessage()
      this.getNewMessageCount()
      Utils.$emit('getNewMessageCount')
    },
    async getNewMessageCount() {
      const { data: res } = await this.$http.get('/personalInfoController/selectMessageCount')
      if (res.code !== 200) return this.$message.error(res.msg)
      this.newMessageCount = res.data
    }
  }
}
</script>

<style lang="less" scoped>
  .el-card.is-hover-shadow{
    box-shadow: none!important;
  }
  .el-card.is-always-shadow,.el-card.is-hover-shadow:hover {
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1) !important;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  .el-tab-pane{
    height: 400px;
    overflow-y:scroll;
  }
  .element::-webkit-scrollbar { width: 0 !important }
</style>
