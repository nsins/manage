<template>
    <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item >权限管理</el-breadcrumb-item>
  <el-breadcrumb-item >权限列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 表单 
 @current-change="handleCurrentChange"-->
 <el-table ref="singleTable" :data="rightsD"
  height="600"
    border
  highlight-current-rowstyle="width: 100%">
    <el-table-column
      type="index"
       label="#"
      width="80">
    </el-table-column>
    <el-table-column
      property="authName"
      label="权限名称"
      width="280">
    </el-table-column>
    <el-table-column
      property="path"
      label="路径"
      width="280">
    </el-table-column>
    <el-table-column
      property="level"
      label="层级">
    </el-table-column>
  </el-table>
</div>


</template>

<script>
  export default {
     mounted(){
        this.getRights()
 },
   
    data(){
       return{  
           rightsD:[],
    //      rightsData:{
    //          authName:'',
    //          level:'',
    //          path:''
    //    },

          }
     
    },
     methods:{
        getRights(){
           this.$myHttp({
            url:'rights/list',
            method:'get'
        }).then(data_back=>{
            // console.log(data_back)
            let{data,meta}=data_back.data;
            this.rightsD=data;



        })
          
        },
      
 },

  }


</script>

<style>
.el-main {
     background-color: #bbcad9;
     line-height: 70px;
}
   
.el-table{
    margin-top:20px
}

</style>