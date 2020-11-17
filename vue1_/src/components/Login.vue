<template>
  <div class="login-wrap">
      <el-form status-icon :model="form" :rules="rules" ref="form"  label-width="80px" class="login-from" >
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="loginClick">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
     form:{
         username:'',
         password:'',
     },
    rules:{
      username:[
          {required:true,message:'请输入用户名',tiggre:'blur'},
      ],
      password:[
          { required: true, message: '密码在3-12个字符', trigger: 'blur' ,min:3,max:12},
          
      ]
    },
    };

  },
  methods: {
    loginClick() {
      //validate：接收错误信息
       this.$refs.form.validate(res=>{
      //  正确，跳转路径
        if(res){
        //  console.log("2222")
      this.$myHttp
    //  将输入的用户名和密码使用post发送到接口地址
        .post("login", this.form)
        .then(back_data => {
          // console.log(this.from)
          if (back_data.data.meta.status == 200) { 
            //  登录成功，跳转到首页
           this.$router.push('/'); 
          console.log('登录成功');
           window.sessionStorage.setItem('token',back_data.data.data.token);
            this.$message({
              message: "登录成功",
              type: "success"
            });
          }
        });

        }else{
           //如果有错误信息，停止代码，不发送
            this.$message.error('请输入正确的用户名和密码');
        
          return
          
        }
       });
     
    }
  }
};
</script>


<style >
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-from {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-from .login-btn {
  width: 100%;
}
.el-form-item{
  margin-bottom: 30px
}
</style>