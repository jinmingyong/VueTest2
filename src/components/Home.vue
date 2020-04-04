<template>
  <el-container class="home-container">
    <!-- 头部区域-->
    <el-header>
      <div>
       <img src="../assets/logo.png" alt="">
        <span>专家库管理系统</span>
      </div>
      <el-dropdown  @command="handleCommand"  placement="bottom">
      <el-badge :is-dot="newMessageCount===0? false:true"><el-avatar class="iconfont icon-bussiness-man-fill" style="font-size: 25px"></el-avatar></el-badge>
        <el-dropdown-menu slot="dropdown" style="width: 150px;text-align: center">
          <el-dropdown-item disabled style="margin-top: 10px"><span style="color: #00bef6;font-weight: bold">{{userName}}!您好</span></el-dropdown-item>
          <el-divider><i class="iconfont icon-contacts"></i></el-divider>
          <el-dropdown-item v-for=" item in menulistForPre" :key="item.menuId" :command="item.menuUrl.toString()"><el-badge :hidden="(item.menuId ===18 && newMessageCount !== 0 )?false:true" :value="newMessageCount"><i :class="'iconfont '+iconsObj[item.menuId]" style="font-size: 25px; vertical-align: middle"></i>{{item.menuName}}</el-badge>
          </el-dropdown-item>
          <el-dropdown-item divided command="logout"><i class="iconfont icon-logout" style="font-size: 20px; vertical-align: middle"></i>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollpase ? '64px' :'200px'">
        <div class="toggle-button" @click="toggleCollapse()"><span :class="isCollpase? 'el-icon-s-unfold':'el-icon-s-fold'"></span></div>
          <el-menu background-color="#a0d3ff" text-color="#1f3d6e" active-text-color="#fbffc4" unique-opened :collapse="isCollpase"
                   :collapse-transition="false"
                   router
                   :default-active="activePath"
          >
            <!--一级菜单,设置v-for index来确定展开哪个,并且必须加上toSting()转成字符串-->
            <el-submenu :index="item.menuId.toString()"  v-for=" item in menulist" :key="item.menuId">
              <!--一级菜单模板区域-->
              <template slot="title">
                <!--图标-->
                <i :class="'iconfont '+iconsObj[item.menuId]"></i>
                <!--文本-->
                <span>{{item.menuName}}</span>
              </template>

              <!--二级菜单-->
                <el-menu-item :index="subItem.menuUrl.toString()" v-for="subItem in item.menuDtoList" :key="subItem.menuId"
                @click="saveNavState(subItem.menuUrl.toString())"
                >
                  <!--二级菜单模板区域-->
                  <template slot="title">
                    <!--图标-->
                    <i class="el-icon-arrow-right"></i>
                    <!--文本-->
                    <span>{{subItem.menuName}}</span>
                  </template>
                </el-menu-item>
            </el-submenu>
          </el-menu>
      </el-aside>
      <!--右侧主体-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import Utils from '../assets/util.js'
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单
      userName: '',
      menulist: [],
      menulistForPre: [],
      iconsObj: {
        5: 'icon-fencengpeizhi',
        2: 'icon-bussiness-man',
        3: 'icon-feeds',
        6: 'icon-usercenter',
        7: 'icon-Customermanagement-fill',
        4: 'icon-kehupandian',
        16: 'icon-usercenter',
        17: 'icon-password',
        18: 'icon-messagecenter'
      },
      isCollpase: false,
      // 被激活的链接地址
      activePath: '',
      newMessageCount: 0
    }
  },
  created () {
    this.getMenuList()
    this.getNewMessageCount()
    this.activePath = window.sessionStorage.getItem('activePath ')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.post('/menuResourceManagementController/getUserInfoAndMenu')
      console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.userName = res.data.userName
      const list = res.data.menuDtoList
      for (let i = 0; i < list.length; i++) {
        if (list[i].menuId === 4) {
          this.menulistForPre = list[i].menuDtoList
        } else {
          this.menulist.push(list[i])
        }
      }
    },
    // 菜单折叠
    toggleCollapse() {
      this.isCollpase = !this.isCollpase
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case '/personalInfo':
          this.$router.push(command)
          window.sessionStorage.setItem('tabsValue', 'personalInfo')
          break
        case '/modifyPassword':
          window.sessionStorage.setItem('tabsValue', 'editPassword')
          this.$router.push('/personalInfo')
          break
        case '/messageManage':
          window.sessionStorage.setItem('tabsValue', 'message')
          this.$router.push('/personalInfo')
          break
        default:
      }
      location.reload()
    },
    async getNewMessageCount() {
      const { data: res } = await this.$http.get('/personalInfoController/selectMessageCount')
      if (res.code !== 200) return this.$message.error(res.msg)
      this.newMessageCount = res.data
    }
  },
  mounted () {
    var that = this
    Utils.$on('getNewMessageCount', function () {
      that.getNewMessageCount()
    })
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
    padding-left: 2px;
  }

  .el-header {
    border-radius: 5px;
    background-color: #00bef6;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    padding-right: 50px;
    align-items: center;
    color: #dddddd;
    font-size: 20px;
    box-shadow: 3px 3px 10px #0172ad;
    margin-bottom: 10px;
    margin-left: 2px;
    margin-right: 3px;
    > div {
      display: flex;
      align-items: center;
     + span {
          margin-left: 15px;
      }
    }
  }

  .el-aside {
    transition:width 0.5s;
    background-color: #a0d3ff;
    box-shadow: 3px 0 5px #7aa0c3;
    border-radius: 3px;
    margin-right: 10px;
    .el-menu{
      //解决不齐
      .iconfont{
        font-size: 25px;
        color: #172b85;
        margin-right: 10px;
      }
    }
  }

  .el-main {
    background-color: #e1edf5;
    border-radius: 3px;
  }

  .toggle-button{
    background-color: #6799fc;
    font-size: 20px;
    line-height: 30px;
    color: white;
    text-align: center;
    cursor: pointer;
  }
  .el-badge {
    /deep/.el-badge__content
    {
      margin-top:5px;
      margin-right: 5px;
    }
  }
  .el-dropdown-menu{
    .el-badge {
      /deep/.el-badge__content
      {
        margin-right: -6px;
        margin-top: 7px;
      }
    }
  }
</style>
