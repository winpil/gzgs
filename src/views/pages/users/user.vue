<template>
  <div class="app-container">
    <div v-if="showFlag === pageType.list">
      <div class="filter-container">
        <!-- <el-input v-model="queryForm.keyword" clearable placeholder="" style="width: 300px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
        <el-button class="filter-item" style="margin-left: 10px;float:right;margin-right: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('table.add') }}
        </el-button>
        <el-button v-waves class="filter-item" style="float: right;" type="primary" icon="el-icon-search" @click="handleFilter">
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
        <el-table-column label="序号" type="index" align="center" width="80">
        </el-table-column>
        <el-table-column label="用户姓名" width="200px" align="center" prop="name">
        </el-table-column>
        <el-table-column label="用户账号" min-width="200px" align="center" prop="user">
        </el-table-column>
        <el-table-column label="用户密码" min-width="200px" align="center" prop="password">
        </el-table-column>
        <el-table-column label="权限等级" width="200px" align="center" prop="level">
          <template slot-scope="{row}">
            <span>{{ row.level === 3 ? '系统管理员' : (row.level === 2 ? '高级管理员' : '初级管理员')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" min-width="200px" align="center" prop="phone">
        </el-table-column>
        <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="250" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              {{ $t('table.edit') }}
            </el-button>
            <el-button type="primary" size="mini" @click="handleDetail(row)">
              详情
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              {{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="queryForm.page" :limit.sync="queryForm.limit" @pagination="getList" />
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
        <el-button v-if="showFlag !== pageType.detail" v-waves class="filter-item" style="float: right;" type="primary" icon="el-icon-document-checked" @click="handleSubmit">
          提交
        </el-button>
      </div>
      <el-form ref="postForm" :model="postForm" :rules="postRules" class="form-container">
        <div class="createPost-main-container">
          <el-row>
            <el-col :span="24" class="form-wrapper">
              <el-row class="fit-padding" >
                <el-col :span="18">
                  <el-form-item class="md-input" prop="user">
                    <MDinput v-model="postForm.user" :maxlength="100" name="user" required :disabled="showFlag !== pageType.add">
                      {{mdcontent}}
                    </MDinput>
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-row>
              <div class="postInfo-container fit-padding" >
                <el-row>
                  <el-col :span="8">
                    <el-form-item label-width="90px" label="用户名称:" class="postInfo-container-item" prop="name">
                      <el-input placeholder="请输入用户名称" v-model="postForm.name" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="10">
                    <el-form-item label-width="120px" label="用户密码:" class="postInfo-container-item" prop="password">
                      <el-input placeholder="请输入用户密码" v-model="postForm.password" :disabled="showFlag === pageType.detail" clearable></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6" style="min-height: 1px;">
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label-width="90px" label="联系方式:" class="postInfo-container-item" prop="phone">
                      <el-input placeholder="请输入联系方式" v-model="postForm.phone" :disabled="showFlag === pageType.detail" clearable></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="10">
                    <el-form-item label-width="120px" label="权限等级:" class="postInfo-container-item" prop="level">
                      <el-select v-model="postForm.level" style="width: 100%;" filterable default-first-option placeholder="请选择权限等级" :disabled="showFlag === pageType.detail">
                        <el-option v-for="(item,index) in levelList" :key="item.id+index" :label="item.name" :value="item.id" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6" style="min-height: 1px;">
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { createUser, queryUser, updateUser, delUser } from '@/api/user/user.js'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import axios from 'axios'

export default {
  name: 'ComplexTable',
  components: { Tinymce, MDinput, Pagination },
  directives: { waves },
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      postRules: {
        user: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        level: [{ required: true, message: '请选择权限等级', trigger: 'change' }],
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
        limit: 15,
      },
      postForm: {
        name: '',
        level: '',
        user: '',
        password: '',
        phone: ''
      },
      levelList: [{
        id: 1, name: '初级管理员'
      }, {
        id: 2, name: '高级管理员'
      }, {
        id: 3, name: '系统管理员'
      }],
      currentRow: {}
    }
  },
  created() {
    this.getList()
  },

  computed: {
    mdcontent() {
      let str = this.postForm.area_id == '' ? '请输入用户账号:' : '用户账号:'
      return str
    },
    headName() {
      let str = this.showFlag === this.pageType.add ? '新增管理员':
        this.showFlag === this.pageType.edit ? '编辑管理员' : '管理员详情'

      return str
    }
  },
  methods: {
    // 获取设备列表数据
    getList() {
      this.listLoading = true
      queryUser(this.queryForm).then(res => {
        if (res.retcode == 200) {
          this.list = res.result
          if (this.list && this.list.length > 0) {
            this.total = this.list.length
          }
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },

    handleFilter() {
      this.getList()
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
      // 若验证通过则继续请求
      if (validTemp) {
        if (this.showFlag === this.pageType.add) {
          createUser(this.postForm).then(res => {
            if (res.retcode === 200 || res.status === 'success') {
              this.$message({ type: 'success', message: '提交成功！'})
              setTimeout(() => {
                this.showFlag = this.pageType.list
                this.getList()
              }, 500)
            }
          })
        } else if (this.showFlag === this.pageType.edit) {
          updateUser(this.postForm).then(res => {
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
    },

    // 跳转至详情页面
    handleDetail(row) {
      this.showFlag = this.pageType.detail
      Object.keys(this.postForm).forEach(item => {
        this.postForm[item] = row[item]
      })
    },

    handleDelete(row) {
      let params = {}
      params.user = row.user
      this.$confirm('用户删除后将不可恢复，确认删除该用户？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser(params).then(res => {
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
  .app-container {
    min-width: 800px;
    overflow: auto;
  }

  .form-container {
    margin-left: 40px;
    margin-right: 10px;
    margin-top: 30px;
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
