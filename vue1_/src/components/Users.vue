<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 10px;">
      <el-input placeholder="搜索" v-model="search" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click.stop="search_btn"></el-button>
      </el-input>
      <el-button type="success" icon="el-icon-edit" @click="showBox">添加用户</el-button>
    </div>
    <!-- 表格  @current-change="handleCurrentChange"-->
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="150"></el-table-column>
      <el-table-column property="username" label="姓名" width="200"></el-table-column>
      <el-table-column property="email" label="邮箱" width="220"></el-table-column>
      <el-table-column property="mobile" label="电话" width="220"></el-table-column>
      <!-- 状态栏 -->
      <el-table-column property label="状态" width="220">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="mgStateChange(scope)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>

      <!-- 操作栏 -->
      <el-table-column property label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="userBox(scope)"></el-button>
          <el-button type="warning" plain icon="el-icon-check" size="mini" @click="roleBox(scope)" ></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click.stop="user_delet(scope)" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页   
      @current-change="handleCurrentChange"
      :current-page="currentPage4"-->

    <el-pagination
     @size-change="SizeChange"
     @current-change="CurrentChange"
      :page-sizes="[10, 5, 2, 1]"
      :page-size="7"
      layout="total, sizes, prev, pager, next"
      :total="totalf">
    </el-pagination>

    <!-- 添加用户面板 -->

    <el-dialog title="添加用户" :visible.sync="adduserShow">
      <el-form :model="addData" status-icon :rules="rules" ref="addData">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="addData.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="addData.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addData.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="adduserShow=false">取 消</el-button>
        <el-button type="primary" @click.stop="dataPOST">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户界面 -->
    <el-dialog title="修改用户" :visible.sync="changeuser">
      <el-form :model="userEData" :rules="rules">
        <el-form-item label="用户名" label-width="200px" prop="username">
          <el-input v-model="userEData.username" :disabled="true" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="200px">
          <el-input v-model="userEData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="200px">
          <el-input v-model="userEData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="back_userPUT">取 消</el-button>
        <el-button type="primary" @click="userPUT">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色面板 -->
    <el-dialog title="分配角色" :visible.sync="rolesShow">
  <el-form :model="rolesData">
    <el-form-item label="用户名称" label-width="200px">
    <span > {{rolesData.username}}</span>   
     </el-form-item>
     <el-form-item label="用户角色" label-width="200px">
    <span > {{rolesData.role_name}}</span>   
     </el-form-item>
    <el-form-item label="重新配置角色" label-width="200px">
      <el-select v-model='roleId' placeholder='请选择' >
    <el-option
      v-for="item in options"
      :key="item.roleName"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="rolesShow = false">取 消</el-button>
    <el-button type="primary" @click="rolePUT">确 定</el-button>
  </div>
</el-dialog>


  </div>
</template>
<script>
export default {
  //设置钩子函数，在页面渲染前请求到数据库数据
  mounted() {
    this.getUser();
  
  },
  data() {
    return {
      tableData: [],
      // mg_state:[],
      // 操作按钮
      value1: true,
      // /分页
      totalf:0,
      PageSize:'10',
      page:1,
      // 搜索内容
      search: "",
      adduserShow: false,
      changeuser: false,
      rolesShow:false,
    
    //  添加用户
      addData: {
        username: "",
        password: "",
        mobile: "",
        email: ""
      },
      userEData: {
        username: "",
        mobile: "",
        email: "",
         
      },
      rolesData:{
        username: "",
        roles:'',
        role_name:'',
        id:''
       
      },
      roleId:'',
      options:[],
      // 状态列表
      mgState:{
          id:'',
      },
     

        value: '',
      rules: {
        username: [{ required: true, message: "请输入用户名", tiggre: "blur" }],
        password: [
          { required: true, message: "最少4位字符", tiggre: "blur", min: 4 }
        ]
      }
    };
  },
  
  methods: {
    showBox() {
      this.adduserShow = true;
    },
    // 分页
    SizeChange(size){
      this.PageSize =size;
      // console.log(this.PageSize)
      this.getUser()

    },
    CurrentChange(page){
      this.page=page;
      // console.log(page)
      this.getUser()

    },
 
   
    getUser(query = "") {
      //    console.log(query)
      if (query == "") {
        var url ="users?pagenum="+this.page+"&pagesize="+this.PageSize;
      } else {
        //    console.log(query)
        var url = "users?pagenum="+this.page+"&pagesize="+this.PageSize+"&query=" + query;
      }
      this.$myHttp({
        url,
        method: "get"
      }).then(backdata => {
        // console.log(backdata.data)
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          this.tableData = data.users;
          // console.log(this.tableData);
          this.totalf=data.total;
        //  let mg_state=this.tableData.mg_state;
          // console.log(data.users[2].mg_state)
        }
      });
    },
    //搜索框
    search_btn() {
      this.getUser(this.search);
    },
    // 添加用户
    dataPOST() {
      this.$refs.addData.validate(res => {
        //判断输入是否满足要求
        if (res) {
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      //  提交到数据库
      this.$myHttp({
        url: "users",
        method: "post",
        data: this.addData
      }).then(back_data => {
        let { data, meta } = back_data.data;
        //  console.log(data,meta)
        if (meta.status == 201) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.adduserShow = false;
          this.getUser();
        }
      });
    },
    //改变状态栏的change监听事件
    mgStateChange(scope) {
      //  this.mgState=scope.row
      //  let id=this.mgState.id;
        // console.log(id);
        // console.log(scope.row)
      this.$myHttp({
        url:`users/${scope.row.id}/state/${scope.row.mg_state}`,
        method:'put'
      }).then(back_data =>{
        // console.log(back_data)
        let{data,meta}=back_data.data;
        if (meta.status==200) {
           this.$message({
          message: '修改状态成功！',
          type: 'success'
        });
        }
        this.getUser()
      })
      
    },

    //删除用户请求
    user_delet(scope) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除  成功
          var i = scope.row.id;
          //   console.log(i);
          this.$myHttp({
            url: "users/" + i,
            method: "delete"
          }).then(back_data => {
            //到这里已经删除了
            //  console.log(back_data.data)
            let { data, meta } = back_data.data;
            //   console.log(data,meta)
            if (meta.status == 200) {
              //如果成功

              this.getUser();
            }
          });
          //弹窗
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      // console.log(scope.row.id)
    },
    // 改变用户信息
    userBox(scope) {
      this.changeuser = true;
      this.userEData = scope.row;
      // console.log(scope)
    },
    //修改用户数据
    userPUT() {
      let id = this.userEData.id;
      let mobile = this.userEData.mobile;
      let email = this.userEData.email;
      this.changeuser = false;
      // console.log(id)
      this.$myHttp({
        url: "users/" + id,
        method: "put",
        data: this.userEData
      }).then(backdata => {
        //  console.log(backdata)
        let { data, meta } = backdata.data;
        if (meta.status == 200) {
          //修改成功
          this.$message({
            message: "修改成功",
            type: "warning"
          });
        } else {
          this.$message.error("修改失败");
        }
        this.getUser();
      });
    },
    //取消修改，数据不变
    back_userPUT() {
      this.changeuser = false;
      this.getUser();
    },
    // 打开角色列表，就获取角色信息
   roleBox(scope){
        this.rolesShow=true;
        this.rolesData=scope.row;
        //下拉菜单角色展示
        this.$myHttp({
          url:'roles',
          method:'get', 
          }).then(backdata=>{
            this.options=backdata.data.data;
            
            var i= scope;
            // var i=this.rolesData.id
            // console.log(i);
        //  console.log(this.rolesData)
        //  console.log(this.options)
              // console.log(this.options)
            
           
          })

    },
    //确认修改，改变角色
    rolePUT(){
         this.rolesShow=false;
         this.$myHttp({
           url:`users/${this.rolesData.id}/role`,
           method:'put', 
           data:{rid:this.roleId}
         }).then(back_data=>{
            // console.log(this.roleId);
            // console.log(back_data)
            let{data,meta}=back_data.data;
            if (meta.status==200) {
                this.$message({
              message: '配置角色成功',
              type: 'success'
                });
                this.roleId='';
                this.getUser()
            }
            
         })

    },
 

    //------------------------------------------------------
  }
};
</script>
<style>
/* 输入框 */
.el-select .el-input {
  width: 130px;
}
.el-main {
  line-height: 30px;
  text-align: left;
}
.el-input-group {
  width: 40%;
}

.el-table {
  margin-top: 5px;
}
/* 添加用户 */
.el-dialog .el-input__inner {
  width: 85%;
}
.el-dialog {
  width: 40%;
}
.el-select .el-input {
    width: 377px;
}
</style>