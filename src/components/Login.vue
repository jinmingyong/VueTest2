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
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
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
