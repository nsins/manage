<template>
  <el-container class="height100">
    <el-header>
      <el-row :gutter="10">
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <div class="grid-content bg-purple">电商管理后台</div>
        </el-col>
        <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
          <div class="grid-content bg-purple-light"></div>
        </el-col>
        <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
          <div class="grid-content bg-purple-light">
            <el-button type="primary" @click.stop="login_out">退出</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <!-- 侧边 -->
    <el-container>
      <el-aside width="200px">
        <el-col :span="24">
          <el-menu :router="true" default-active="2" class="el-menu-vertical-demo">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="users">用户列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
             <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
              <el-menu-item index="roles">角色列表</el-menu-item>
                <el-menu-item index="rights">权限列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
            <!-- <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
            </el-menu-item>-->
          </el-menu>
        </el-col>
      </el-aside>
      <!-- 主体 -->
      <el-main>
      
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  mounted() {
    var token = window.sessionStorage.getItem("token");
    if (!token) {
      this.$message.error("请先登录");
      this.$router.push({ name: "login" });
    }
  },
  methods: {
    login_out() {
      this.$notify({
        dangerouslyUseHTMLString: true,
        duration: "1000",
        message: "退出成功"
      });
      window.sessionStorage.removeItem("token"),
        this.$router.push({ name: "login" });
    }
  }
};
</script>
<style>
.el-header,
.el-footer {
  background-color: #dee1e6;
  text-align: center;
  line-height: 60px;
  color: #333;
  padding-left: 0;
}

.height100 {
  height: 100%;
}

.el-aside {
  background-color: #dee1e6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
/* header里的布局 */
.el-col {
  border-radius: 4px;
  font-size: larger;
}

.grid-content {
  border-radius: 4px;
  min-height: 60px;
}
</style>