<template>
    <div class="login_container">
      <div class="login_box">
          <div class="avatar_box">
            <img src="../assets/logo.png" alt="">
          </div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form" status-icon>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-account" ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-password" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="restLoginForm">重置</el-button>
            <el-button type="success" @click="addDialogVisible = true">注册</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div>
        <el-dialog title="注册" :visible.sync="addDialogVisible" @close="addDialogClosed">
          <!--主体-->
          <el-form  :model="addForm" :rules="addFormRules" ref="addFormRef"
                    size="large" label-position="right" label-width="100px" status-icon>
            <el-form-item label="用户名:" prop="username">
              <el-input v-model="addForm.username"/>
            </el-form-item>
            <el-form-item label="输入密码:" prop="newPassword">
              <el-input type="password" v-model="addForm.newPassword" />
            </el-form-item>
            <el-form-item label="再次输入密码:" prop="checkNewPassword">
              <el-input type="password" v-model="addForm.checkNewPassword" />
            </el-form-item>
            <el-form-item label="性别:">
              <el-radio v-model="addForm.sex" label="男">男</el-radio>
              <el-radio v-model="addForm.sex" label="女">女</el-radio>
            </el-form-item>
            <el-form-item label="电话号:" prop="phone">
              <el-input v-model="addForm.phone" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="registerUser">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
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
      } else if (value !== this.addForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 表单数据绑定
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到5个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在6到10个字符', trigger: 'blur' }
        ]
      },
      addDialogVisible: false,
      addForm: {
        username: '',
        newPassword: '',
        checkNewPassword: '',
        sex: '男'
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 10,
            message: '用户名长度为5到10之间',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
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
  methods: {
    restLoginForm () {
      // console.log(this)
      // 表单重置
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/loginController/login', this.loginForm)
        console.log(res)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.$message.success('登陆成功')
        // 1.将登陆成功后的token保存再seeionStorage中
        // 2.api必须必须登陆后可用，token只在网站打开生效，所以存在sessionStorage中
        // 3.跳转网页
        window.sessionStorage.setItem('token', 'Bearer ' + res.data)
        await this.$router.push('/home')
      })
    },
    async registerUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/loginController/register', this.addForm)
        console.log(res)
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.$message.success('注册成功')
        this.addDialogVisible = false
      })
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: dodgerblue;
  height: 100%;
}

.login_box{
  width: 450px;
  height: 300px;
  background-color: aliceblue;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  .avatar_box{
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border: 1px solid beige;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: aliceblue;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #dddddd;
    }
  }
}

.login_form{
position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns{
     display: flex;
     justify-content: flex-end;
}
</style>
