<template>
  <el-container class="home-container">
    <!-- 头部区域-->
    <el-header>
      <div>
       <img src="../assets/logo.png" alt="">
        <span>专家库管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollpase ? '64px' :'200px'">
        <div class="toggle-button" @click="toggleCollapse()"><span :class="isCollpase? 'el-icon-s-unfold':'el-icon-s-fold'"></span></div>
          <el-menu background-color="#407ff6" text-color="#fff" active-text-color="#9EF6BC" unique-opened :collapse="isCollpase"
                   :collapse-transition="false" router>
            <!--一级菜单,设置v-for index来确定展开哪个,并且必须加上toSting()转成字符串-->
            <el-submenu :index="item.menuId.toString()" v-for=" item in menulsit" :key="item.menuId">
              <!--一级菜单模板区域-->
              <template slot="title">
                <!--图标-->
                <i :class="'iconfont '+iconsObj[item.menuId]"></i>
                <!--文本-->
                <span>{{item.menuName}}</span>
              </template>
                <el-menu-item :index="subItem.menuUrl.toString()" v-for="subItem in item.menuDtoList" :key="subItem.menuId">
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
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单
      menulsit: [],
      iconsObj: {
        1: 'icon-fencengpeizhi',
        2: 'icon-bussiness-man',
        3: 'icon-feeds',
        4: 'icon-usercenter',
        5: 'icon-Customermanagement-fill',
        13: 'icon-kehupandian'
      },
      isCollpase: false
    }
  },
  created () {
    this.getMenuList()
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
      this.menulsit = res.data.menuDtoList
    },
    // 菜单折叠
    toggleCollapse() {
      this.isCollpase = !this.isCollpase
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #00bef6;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #dddddd;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
          margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #407ff6;
    .el-menu{
      //解决不齐
      border-right:none;
      .iconfont{
        font-size: 25px;
        color: #4434af;
        margin-right: 10px;
      }
    }
  }

  .el-main {
    background-color: #e1edf5;
  }

  .toggle-button{
    background-color: #b3d4fc;
    font-size: 20px;
    line-height: 30px;
    color: white;
    text-align: center;
    cursor: pointer;
  }

</style>
