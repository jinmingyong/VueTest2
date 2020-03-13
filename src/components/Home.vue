<template>
  <el-container class="home-container">
    <!-- 头部区域-->
    <el-header>
      <div>
       <img src="../assets/logo.png" alt="">
        <span>专家库管理系统</span>
      </div>
      <el-button type="info">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
          <el-menu background-color="#407ff6" text-color="#fff" active-text-color="#ffd04b">
            <!--一级菜单-->
            <el-submenu index="1">
              <!--一级菜单模板区域-->
              <template slot="title">
                <!--图标-->
                <i class="el-icon-location"></i>
                <!--文本-->
                <span>导航一</span>
              </template>
                <el-menu-item index="1-4-1">
                  <!--二级菜单模板区域-->
                  <template slot="title">
                    <!--图标-->
                    <i class="el-icon-location"></i>
                    <!--文本-->
                    <span>导航一</span>
                  </template>
                </el-menu-item>
            </el-submenu>
          </el-menu>
      </el-aside>
      <!--右侧主体-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: 'Home'
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
      border-right-width: 0;
    }
  }

  .el-main {
    background-color: #e1edf5;
  }
</style>
