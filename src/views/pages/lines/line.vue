<template>
  <div class="app-container">
    <div v-if="showFlag === pageType.list">
      <div class="filter-container">
         <el-input v-model="queryForm.keyword" clearable placeholder="线路ID/线路名称" style="width: 300px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" /> 
        <el-button class="filter-item" style="margin-left: 10px;float:right;margin-right: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('table.add') }}
        </el-button>
         <el-button class="filter-item" style="float: right;" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button> 
        <!-- <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleShowImport">
          数据导入
        </el-button> -->
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
        <el-table-column label="线路ID" min-width="180px" align="center" prop="zone">
        </el-table-column>
        <el-table-column label="线路名称" min-width="180px" align="center" prop="name">
        </el-table-column>
        <el-table-column label="设备编号" min-width="180px" align="center" prop="device_code">
        </el-table-column>
        <el-table-column label="设备通道编号" min-width="80px" align="center" prop="channel_code">
        </el-table-column>
        <el-table-column label="责任人一" min-width="180px" align="center" prop="head1">
        </el-table-column>
        <el-table-column label="联系电话一" min-width="180px" align="center" prop="phone1">
        </el-table-column>
        <el-table-column label="责任人二" min-width="180px" align="center" prop="head2">
        </el-table-column>
        <el-table-column label="联系电话二" min-width="180px" align="center" prop="phone2">
        </el-table-column>
        <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="220" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              {{ $t('table.edit') }}
            </el-button>
            <!-- <el-button type="primary" size="mini" @click="handleDetail(row)">
              详情
            </el-button> -->
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
        <el-button v-if="showFlag !== pageType.detail" class="filter-item" style="float: right;" type="primary" icon="el-icon-document-checked" @click="handleSubmit">
          提交
        </el-button>
      </div>
      <el-form ref="postForm" :model="postForm" :rules="postRules" class="form-container">
        <div class="createPost-main-container">
          <el-row>
            <el-col :span="24" class="form-wrapper">
              <el-row class="fit-padding" >
                <el-col :span="18">
                  <el-form-item class="md-input" prop="zone">
                    <MDinput v-model="postForm.zone" :maxlength="4" name="name" required :disabled="showFlag !== pageType.add">
                      {{mdcontent}}
                    </MDinput>
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-row>
              <div class="postInfo-container fit-padding" >
                <el-row>
                  <el-col :span="18">
                    <el-form-item label-width="120px" label="线路名称:" class="postInfo-container-item" prop="name">
                      <el-input placeholder="请输入线路名称" v-model="postForm.name" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="min-height: 1px;">
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label-width="120px" label="设备编号:" class="postInfo-container-item" prop="device_code">
                      <el-input placeholder="请输入设备编号" v-model="postForm.device_code" :disabled="showFlag === pageType.detail" clearable></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="10">
                    <el-form-item label-width="120px" label="设备通道编号:" class="postInfo-container-item" prop="channel_code">
                      <el-input placeholder="请输入设备通道编号" v-model="postForm.channel_code" :disabled="showFlag === pageType.detail" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="min-height: 1px;">
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label-width="120px" label="责任人一:" class="postInfo-container-item" prop="head1">
                      <el-input placeholder="请输入责任人一" v-model="postForm.head1" :disabled="showFlag === pageType.detail" clearable></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="10">
                    <el-form-item label-width="120px" label="联系电话一:" class="postInfo-container-item" prop="phone1">
                      <el-input maxlength="11" placeholder="请输入联系电话一" v-model="postForm.phone1" :disabled="showFlag === pageType.detail" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" style="min-height: 1px;">
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label-width="120px" label="责任人二:" class="postInfo-container-item" prop="head2">
                      <el-input placeholder="请输入责任人二" v-model="postForm.head2" :disabled="showFlag === pageType.detail" clearable></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="10">
                    <el-form-item label-width="120px" label="联系电话二:" class="postInfo-container-item" prop="phone2">
                      <el-input maxlength="11" placeholder="请输入联系电话二" v-model="postForm.phone2" :disabled="showFlag === pageType.detail" clearable></el-input>
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
import { createLine, queryLine, updateLine, delLine, insertZones } from '@/api/line/line.js'
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      postRules: {

        channel_code:[{ required: true, message: '请输入设备通道编号', trigger: 'blur' }],
        device_code:[{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        
        zone: [{ required: true, message: '请输入线路ID', trigger: 'blur' }],
        name: [{ required: true, message: '请输入线路名称', trigger: 'blur' }],
        head1: [{ required: true, message: '请输入责任人一', trigger: 'blur' }],
        phone1: [{ required: true, message: '请输入联系电话一', trigger: 'blur' }],
        head2: [{ required: true, message: '请输入责任人二', trigger: 'blur' }],
        phone2: [{ required: true, message: '请输入联系电话二', trigger: 'blur' }],
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
        keyword: ''
      },
      postForm: {
        channel_code:'',
        device_code:'',
        zone: '',
        name: '',
        head1: '',
        phone1: '',
        head2: '',
        phone2: ''
      },
      areaList: [],
      currentRow: {},
      dialogVisible: false,
      fileparam: {}
    }
  },
  created() {
    this.getList()
  },

  computed: {
    mdcontent() {
      let str = this.postForm.area_id == '' ? '请输入线路ID(至多4位):' : '线路ID:'
      return str
    },
    headName() {
      let str = this.showFlag === this.pageType.add ? '新增线路':
        this.showFlag === this.pageType.edit ? '编辑线路' : '线路详情'

      return str
    }
  },
  methods: {
    // 获取设备列表数据
    getList() {
      this.listLoading = true
      queryLine(this.queryForm).then(res => {
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
      // 若验证通过则继续请求
      if (validTemp) {
        if (this.showFlag === this.pageType.add) {
          createLine(this.postForm).then(res => {
            if (res.retcode === 200 || res.status === 'success') {
              this.$message({ type: 'success', message: '提交成功！'})
              setTimeout(() => {
                this.showFlag = this.pageType.list
                this.getList()
              }, 500)
            }
          })
        } else if (this.showFlag === this.pageType.edit) {
          updateLine(this.postForm).then(res => {
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
      params.zone = row.zone
      this.$confirm('线路删除后将不可恢复，确认删除该线路？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delLine(params).then(res => {
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
