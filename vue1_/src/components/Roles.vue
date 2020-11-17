<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="b0">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button plain class="b1" @click="addRolesBox">添加角色</el-button>

    <!-- 表格 -->
    <!-- 展开行 -->
    <el-table :data="roles_Data" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 布局 -->
          <el-row class="rowmargin"  v-for="item1 in scope.row.children" :key="item1.id">
            <!-- 一级区域 -->
            <el-col :span="6">
              <!-- 一级内容展示 -->
              <el-tag closable>{{ item1.authName }} </el-tag> >
            </el-col>

            <el-col :span="18">
              <!-- 二级区域 -->
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="6">
                  <!-- 二级内容 -->
                  <el-tag closable type="success" >{{ item2.authName }} </el-tag>
                  >
                </el-col>
                <el-col :span="18">
                  <!-- 三级内容 -->     <!-- 删除事件 -->  
                  <el-tag  v-for="(item3,key3) in item2.children"  :key="item3.id" closable  @close="CloseT(item2,key3,scope.row.id,item3.id)"
                   type="info">
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 表头信息 -->
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"> </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
      <el-table-column label="操作" prop="desc">
        <template slot-scope="scope"> 
           <el-button type="success" circle icon="el-icon-edit" size="medium" @click="changerBox(scope)" ></el-button>
          <el-button type="el-icon-search" circle icon="el-icon-check"  size="medium"  @click="RigthsBox(scope)" ></el-button>
          <el-button type="info"  circle icon="el-icon-delete" size="medium" @click.stop="Role_delet(scope)" ></el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 增减权限弹窗 -->
   <el-dialog title="权限分配" :visible.sync="rigthsShow">
    <el-tree :data="rigthsList" 
          ref="tree"
          show-checkbox
          :props="defaultProps"
           default-expand-all
          node-key="id"
            :default-expanded-keys="[2, 3]" 
        :default-checked-keys="ristC" >
        
        
    </el-tree> 
  <div slot="footer" class="dialog-footer">
    <el-button @click="rigthsShow = false">取 消</el-button>
    <el-button type="primary" @click="RigthsPUT">确 定</el-button>
  </div>
</el-dialog>
<!-- 修改角色 -->

   <el-dialog title="编辑角色" :visible.sync="changerShow" class="changeB">
  <el-form :model="changrData" :rules="rules">
    <el-form-item label="角色名称" label-width="100px" prop="roleName">
      <el-input v-model="changrData.roleName" autocomplete="off" ></el-input>
    </el-form-item>
    <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
       <el-input v-model="changrData.roleDesc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="changerShow = false">取 消</el-button>
    <el-button type="primary" @click="changerPUT">确 定</el-button>
  </div>
</el-dialog>

<!-- 添加角色 -->
<el-dialog title="添加角色" :visible.sync="addRolesShow" class="addBox">
  <el-form :model="addRolesData">
    <el-form-item label="角色名称"label-width="100px">
      <el-input v-model="addRolesData.roleName" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" label-width="100px">
       <el-input v-model="addRolesData.roleDesc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addRolesShow = false">取 消</el-button>
    <el-button type="primary" @click="addrolesPUT">确 定</el-button>
  </div>
</el-dialog>

  </div>
</template>

<script>
export default {
  mounted() {
    this.getRolesLists();
    //
  },
  data() {
    return {
      rigthsShow:false,
      changerShow:false,
      addRolesShow:false,
      roles_Data: [],
      changrData:{
        roleName:'',
        roleDesc:'',
      },
      // 添加角色
      addRolesData:{
        roleName:'',
        roleDesc:''
      },
      Ri:0,
      roID:0,
      rigthsList: [],
      ristC:[],
      defaultProps: {
          children: 'children',
          label: 'authName'
        },
        rules:{
          roleName:[{ required: true, message: "请输入用户名", tiggre: "blur" }],
          roleDesc:[ { required: true, tiggre: "blur"}]
        }

    };
  },
  methods: {
    getRolesLists(scope) {
      this.$myHttp({
        url: "roles",
        method: "get",
      }).then((data_back) => {
        //
        let { data, meta } = data_back.data;
        this.roles_Data = data;
        // console.log(data_back.data);
      });
    },
// 展示行关闭权限按钮-连接数据库
     CloseT(item,key,scope,I3){
        // console.log(scope);
        item.children.splice(key,1)
          this.$myHttp({
          url:`roles/${scope}/rights/${I3}`,
          method:'delete',
        }).then(data_back=>{
          console.log(data_back);
          let{data,meta}=data_back.data;
          if(meta.status==200){
               this.$message({message:meta.msg,type:'success'})
          }
        })
    },

    RigthsBox(scope){
        this.rigthsShow=true;
        this.Ri=scope.row.id;
      this.$myHttp({
           url:'rights/tree',
           method:'get'
        }).then(data_back=>{
          // console.log(scope);
            // this.rigthsData=data_back.data;
            let{data,meta}=data_back.data;
            this.rigthsList=data;
        // 列表已有权限展示
         this.ristC=[];
           var arr =scope.row.children;
          //  console.log(arr)
            arr.forEach(I1 => {
                I1.children.forEach(I2=>{
                  I2.children.forEach(I3=>{
                    this.ristC.push(I3.id);
                  })
                })
           });

        })
    },

              //  var a= this.$refs.tree.getCheckedKeys();
                  //  var b=this.$refs.tree.getHalfCheckedKeys();
                  //  var c=a.concat(b);
                  // console.log(c.join());
//修改角色权限提交   
      RigthsPUT(){
       this.rigthsShow=false;
       var rids= this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()).join();
        // console.log(this.Ri)
       this.$myHttp({
         url:`roles/${this.Ri}/rights`,
         method:'post',
         data:{rids}
       }).then(data_back=>{
          // console.log(data_back)
         let{data,meta}=data_back.data;
            if(meta.status==200){
                this.$message({
                    message: '修改权限成功',
                    type: 'success'
                  });
                  this.getRolesLists()
            }
       })
       
    },
// 修改角色名称描述
      changerBox(scope){
        this.changerShow=true;
        this.changrData.roleName=scope.row.roleName;
        this.changrData.roleDesc=scope.row.roleDesc;
        this.roID=scope.row.id
        // console.log(this.roID)
        
      },
//修改角色提交
changerPUT(){
  this.$myHttp({
          url:`roles/${this.roID}`,
          method:'put',
          data:this.changrData
        }).then(data_back=>{
          // console.log(data_back)
          this.changerShow=false;
          let{data,meta}=data_back.data;
          if(meta.status==200){
             this.$message({
              message: '修改角色信息成功',
              type: 'success'
            });
             this.getRolesLists()
          }
        })
},
// 删除角色
Role_delet(scope){
   this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        this.$myHttp({
          url:`roles/${scope.row.id}}`,
          method:'delete'
        }).then(data_back=>{
          // console.log(data_back)
          this.getRolesLists()
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
},
// 增加角色
addRolesBox(){
    this.addRolesShow=true;
   
},
addrolesPUT(){
  this.addRolesShow=false;
   this.$myHttp({
      url:'roles',
      method:'post',
      data:this.addRolesData
    }).then(data_back=>{
      // console.log(data_back)
      this.$message({
              message: '创建角色成功',
              type: 'success'
            });
         this.getRolesLists()
    })
}
    

  },
};
</script>

<style >
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #8a96a7;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-main {
  line-height: 20px;
  padding: 0;
}
.b0 {
  background: #9faec0;
  height: 40px;
  line-height: 40px;
}
.b1 {
  float: left;
  /* margin-top: 10px; */
}
/* 表格 */
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-tag {
  margin: 5px;
}
/* 修改角色面板 */
.changeB .el-input{
   width: 55%;
   text-align: inherit;
   float: left;
}
/* 增加角色 */
.addBox .el-input{
   width: 55%;
   text-align: inherit;
   float: left;
}

</style>