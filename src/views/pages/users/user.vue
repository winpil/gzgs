<template>
  <div class="app-container">
    <div v-if="showFlag === pageType.list">
      <div class="filter-container">
        <el-input v-model="queryForm.name" clearable placeholder="姓名" style="width: 300px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" /> 
        
        <el-button class="filter-item" style="margin-left: 10px;float:right;margin-right: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('table.add') }}
        </el-button>
         <el-button class="filter-item" style="float: right;" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button> 
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        
        <el-table-column label="账号" min-width="120px" align="center" prop="account">
        </el-table-column>        
        <el-table-column label="名称" min-width="120px" align="center" prop="name">
        </el-table-column>        
        <el-table-column label="角色" min-width="120px" align="center" prop="role">
        </el-table-column>
        <el-table-column label="手机号" min-width="180px" align="center" prop="phone">
        </el-table-column>
        <el-table-column label="添加时间" min-width="180px" align="center" prop="addtime">
        </el-table-column>
        <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="220" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              {{ $t('table.edit') }}
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              {{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination :page-sizes="pageSizes" v-show="total>0" :total="total" :page.sync="queryForm.page" :limit.sync="queryForm.limit" @pagination="getList" />
    </div>

    <div v-else-if="showFlag === pageType.add || showFlag === pageType.edit || showFlag === pageType.detail">
      <div class="filter-container formBar">
        <div class="form-head">
          {{headName}}
        </div>
        <el-button class="filter-item" style="margin-left: 10px;float:right;margin-right: 10px;" type="primary" icon="el-icon-back" @click="handleReturn">
          返回
        </el-button>
        <el-button v-if="showFlag !== pageType.detail" class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-refresh-right" @click="handleReset">
          重置
        </el-button>
        <el-button v-if="showFlag !== pageType.detail" class="filter-item" style="float: right;" type="primary" icon="el-icon-document-checked" @click="handleSubmit">
          提交
        </el-button>
      </div>
      <el-form ref="postForm" :model="postForm" :rules="postRules" class="form-container">
        <div class="createPost-main-container">
          <el-row>
            <el-col :span="24" class="form-wrapper">
              <div class="postInfo-container fit-padding" >
                <el-row>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="账号:" class="postInfo-container-item" prop="account">
                      <el-input placeholder="请输入账号" v-model="postForm.account" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="角色:" class="postInfo-container-item" prop="role">
                      <!-- <el-input placeholder="请输入角色" v-model="postForm.role" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input> -->
                      <el-select v-model="postForm.role" placeholder="请选择角色" @change="handleFilter">
                        <el-option
                        v-for="item in roles"
                        :key="item.name"
                        :label="item.name"
                        :value="item.name">
                        </el-option>
                    </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="姓名:" class="postInfo-container-item" prop="name">
                      <el-input placeholder="请输入姓名" v-model="postForm.name" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="手机号:" class="postInfo-container-item" prop="phone">
                      <el-input placeholder="请输入手机号" v-model="postForm.phone" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col  :span="9">
                    <el-form-item label-width="120px" label="验证码:" class="postInfo-container-item" prop="phone_auth_code">
                      <el-input
                        ref="phone_auth_code"
                        v-model="postForm.phone_auth_code"
                        placeholder="验证码"
                        name="phone_auth_code"
                        type="text"
                        tabindex="4"
                        width="width: calc(85% - 210px)"
                        autocomplete="on"
                      />
                      <span class="yzmDjsMsg_class" @click="getCode('loginForm')">
                        {{ yzmDjsMsg }}
                      </span>
                    </el-form-item>
                  </el-col>
                   <el-col :span="9">
                     <el-form-item label-width="120px" label="密码:" class="postInfo-container-item" prop="password">
                      <el-input :type="passwordType" placeholder="请输入密码" v-model="postForm.password" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                      <span class="show-pwd" @click="showPwd">
                        <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                      </span>
                    </el-form-item>
                   </el-col>
                    <el-col :span="9">
                      <el-form-item label-width="120px" label="确认密码:" class="postInfo-container-item" prop="surePassword">
                        <el-input :type="passwordType" placeholder="请再次输入密码" v-model="postForm.surePassword" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                        <span class="show-pwd" @click="showPwd">
                          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                        </span>
                      </el-form-item>
                   </el-col>
                </el-row> 
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <el-dialog
      title="数据导入"
      :visible.sync="dialogVisible"
      width="30%">
      <input type="file" @change="updateFile" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertZones">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { accountOpeInfo,accountOpeCRUD,roleDataInfo } from '@/api/user/user.js'
import { authCode } from '@/api/login/user.js'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import axios from 'axios'

export default {
  name: 'ComplexTable',
  components: { Tinymce, MDinput, Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      roles:[],
      passwordType:'password',
      yzmDjsMsg:'',
      pageSizes: [10, 20, 30, 50],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      postRules: {
        account:[{ required: true, message: '请输入账号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        phone_auth_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      },
      showFlag: 0,
      pageType: {
        list: 0,
        add: 1,
        edit: 2,
        detail: 3
      },
      queryForm: {
        page: 1,
        limit: 10,
        keyword: '',
        channel_name:'',
        name:'',
      },
      postForm: {
        account:'',
        password:'',
        surePassword:'',
        name:'',
        phone:'',
        role:'',
        id:'',
        phone_auth_code:'',
      },
      identifyCode:'',
      identifyCodes: "1234567890",
      yzmDjsMsg:'获取验证码',
      timer:{},
      disabled:false,
      areaList: [],
      currentRow: {},
      dialogVisible: false,
      fileparam: {}
    }
  },
  created() {
    roleDataInfo({'page':1,'limit':100}).then(res => {
        if (res.retcode == 200) {
          this.roles = res.result
        }
      })
    this.getList()
  },

  computed: {
    mdcontent() {
      let str = this.postForm.area_id == '' ? '请输入线路ID(至多4位):' : '线路ID:'
      return str
    },
    headName() {
      let str = this.showFlag === this.pageType.add ? '新增账号':
        this.showFlag === this.pageType.edit ? '编辑账号' : '账号详情'

      return str
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 获取设备列表数据
    getList() {
      this.listLoading = true
      // debugger
      accountOpeInfo(this.queryForm).then(res => {
        if (res.retcode == 200) {
          this.list = res.result
          if (this.list && this.list.length > 0) {
            this.total = res.total
          }
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },

    handleFilter() {
	this.queryForm.page=1
      this.getList()
    },

    handleShowImport() {
      this.dialogVisible = true
    },

    updateFile(e) {
        let file = e.target.files[0];
        this.fileparam = new FormData(); //创建form对象
        this.fileparam.append('excel_file',file);//通过append向form对象添加数据
        console.log(this.fileparam.get('excel_file'));

    },

    insertZones() {
      insertZones(this.fileparam).then(res => {
        if (res.retcode == 200) {
          this.$message({ type: 'success', message: '数据导入成功！' })
          setTimeout(() => {
            this.dialogVisible = false
          }, 500);
        } else {
          this.$message({ type: 'warning', message: `数据导入失败！${res.status}` })
        }
      })
    },

    // 跳转至新增设备页面
    handleCreate() {
      this.showFlag = this.pageType.add
      this.currentRow = {}
      this.handleReset()
    },

    // 返回列表页面
    handleReturn() {
      this.showFlag = this.pageType.list
    },

    // 重置表单
    handleReset() {
      Object.keys(this.postForm).forEach((item) => {
        this.postForm[item] = this.currentRow[item]
      })
      this.$nextTick(() => {
        this.$refs.postForm.resetFields()
      })
    },

    // 创建/修改设备表单提交
    handleSubmit() {
      let validTemp
      this.$refs['postForm'].validate((valid) => {
        if (valid) {
          validTemp = true
        } else {
          console.log('error submit!!');
          validTemp = false
          return false;
        }
      });
      if(this.postForm.surePassword!=this.postForm.password){
         this.$message({
            message: '两次密码不一样',
            type: 'warning'
          });
        this.$refs.surePassword.focus();            
        return 
      }
      // 若验证通过则继续请求
      if (validTemp) {
        if (this.showFlag === this.pageType.add) {
          this.postForm.ope='add'
          accountOpeCRUD(this.postForm).then(res => {
            if (res.retcode === 200 || res.status === 'success') {
              this.$message({ type: 'success', message: '提交成功！'})
              setTimeout(() => {
                this.showFlag = this.pageType.list
                this.getList()
              }, 500)
            }
          })
        } else if (this.showFlag === this.pageType.edit) {
          this.postForm.ope='update'
          accountOpeCRUD(this.postForm).then(res => {
            if (res.retcode === 200 || res.status === 'success') {
              this.$message({ type: 'success', message: '提交成功！'})
              setTimeout(() => {
                this.showFlag = this.pageType.list
                this.getList()
              }, 500)
            }
          })
        }
      }
    },

    // 跳转至编辑页面
    handleUpdate(row) {
      this.showFlag = this.pageType.edit
      this.currentRow = row
      Object.keys(this.postForm).forEach(item => {
        this.postForm[item] = row[item]
      })
      // debugger
      this.postForm.password=''
    //   debugger
    //   this.postForm.id=row.id
    //   debugger
    },

    // 跳转至详情页面
    handleDetail(row) {
      this.showFlag = this.pageType.detail
      Object.keys(this.postForm).forEach(item => {
        this.postForm[item] = row[item]
      })
    },
    tackBtn(phone){       //验证码倒数60秒
		let that=this;
		authCode(phone).then(res => {
			debugger
			if(res.data.retcode!=200){
			  that.disabled = false;
			  that.$message.error(res.data.error);
			  return 
			}else{
			  let time = 60;
			  that.timer = setInterval(() => {
			  if(time == 0){
				  clearInterval(that.timer);
				  that.yzmDjsMsg = '获取验证码';
				  that.disabled = false;
			  }else{
				  that.disabled = true;
				  that.yzmDjsMsg = time + '秒后重试';
				  time--;
			  }
		  }, 1000);
			}
			console.log(res);
		});   
    },
    getCode(checkForm){
        if(this.disabled){
          return ;
        }
        let that=this;
        if(!this.postForm.phone){
            this.$message({
              message: '请输入正确的账号/手机号',
              type: 'warning'
            });
            this.$refs.phone.focus();
            return;
          }else{
            let purposeVal=this.showFlag==this.pageType.add?0:3
            let data={purpose:purposeVal,phone:this.postForm.phone};
            this.tackBtn(data);   //验证码倒数60秒
          }    
    },
    handleDelete(row) {
      let params = {}
      params.id = row.id
      this.$confirm('账号删除后将不可恢复，确认删除该？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        params.ope='delete'
        accountOpeCRUD(params).then(res => {
          if (res.retcode === 200) {
            this.$message({ type: 'success', message: '删除成功！' })
            setTimeout(() => {
              this.getList()
            }, 200);
          } else {
            this.$message({ type: 'warning', message: `删除失败！${res.status}` })
          }
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
  .app-container {
    min-width: 800px;
    overflow: auto;
  }

  .form-container {
    margin-left: 40px;
    margin-right: 10px;
    margin-top: 30px;
  }
.yzmDjsMsg_class{
  position: absolute;
  right: 0;
  bottom: 0;
  width: 110px;
  height: 50px;
  cursor: pointer;
  color: #000;
  line-height: 65px;
  text-align: right;
  padding-right: 15px;
  font-size: inherit;
}
  .formBar {
    border-bottom: 1px solid #dfe6ec;
    overflow: hidden;

    .filter-item {
      margin-bottom: 0;
    }

    .form-head {
      font-size: 20px;
      margin-top: 10px;
      margin-left: 6px;
      color: #666;
      display: inline-block;
    }
  }

  .postInfo-container-item {
    min-width: 250px;
  }

  .form-wrapper {
    border: 1px solid #dfe6ec;
    padding-top: 30px;
    border-radius: 5px;
  }

  .md-input {
    margin-bottom: 20px;
    margin-top: -40px;
    margin-left: 15px;
  }

  .fit-padding {
    padding-left: 10px;
  }
</style>
