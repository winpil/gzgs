<template>
  <div class="app-container">
    <div v-if="showFlag === pageType.list">
      <div class="filter-container">
        <!-- <el-input v-model="queryForm.keyword" clearable placeholder="设备编号/区域/设备代号" style="width: 300px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />  -->
        <el-button class="filter-item" style="margin-left: 10px;float:right;margin-right: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('table.add') }}
        </el-button>
        <!-- <el-button v-waves class="filter-item" style="float: right;" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button> -->
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
        <!-- <el-table-column label="ID" type="index" align="center" width="80">
        </el-table-column> -->
        <el-table-column label="设备编号" min-width="150px" align="center" prop="device_code">
        </el-table-column>
        <el-table-column label="设备名称" min-width="200px" align="center" prop="device_name">
        </el-table-column>
        <el-table-column label="省" min-width="120px" align="center" prop="province">
        </el-table-column>
        <el-table-column label="市" min-width="120px" align="center" prop="city">
        </el-table-column>
        <el-table-column label="区" min-width="120px" align="center" prop="country">
        </el-table-column>
        <el-table-column label="详细地址" min-width="80px" align="center" prop="address">
        </el-table-column>
        <el-table-column label="经度" min-width="180px" align="center" prop="longitude">
        </el-table-column>
        <el-table-column label="纬度" min-width="180px" align="center" prop="latitude">
        </el-table-column>
        <el-table-column label="CPU使用率" min-width="100px" align="center" prop="host_cpu">
        </el-table-column>
        <el-table-column label="内存使用率" min-width="100px" align="center" prop="host_mem">
        </el-table-column>
        
        <el-table-column label="时钟状态" min-width="80px" align="center" prop="host_clock">
        </el-table-column>
        <el-table-column label="风扇状态" min-width="80px" align="center" prop="host_fan">
        </el-table-column>
        <el-table-column label="电源状态" min-width="80px" align="center" prop="host_power">
        </el-table-column>
        
        <!-- <el-table-column label="设备ip地址" min-width="120px" align="center" prop="ip">
        </el-table-column>
        <el-table-column label="设备端口" min-width="80px" align="center" prop="port">
        </el-table-column> -->
        
        <el-table-column label="设备温度" min-width="80px" align="center" prop="host_temp">
        </el-table-column>
        <el-table-column label="添加时间" min-width="180px" align="center" prop="addtime">
        </el-table-column>
        <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="220" class-name="small-padding fixed-width">
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

      <!-- <pagination v-show="total>0" :total="total" :page.sync="queryForm.page" :limit.sync="queryForm.limit" @pagination="getList" /> -->
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
              <div class="postInfo-container fit-padding" >
                <el-row>
                  <el-col :span="9">
                    <el-form-item label-width="90px" label="设备编号:" class="postInfo-container-item" prop="device_code">
                      <el-input placeholder="请输入设备编号" v-model="postForm.device_code" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail || showFlag === this.pageType.edit"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="90px" label="设备名称:" class="postInfo-container-item" prop="device_name">
                      <el-input placeholder="请输入设备名称" v-model="postForm.device_name" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  
                  <el-col :span="9">
                    <el-form-item label-width="90px" label="省:" class="postInfo-container-item" prop="province">
                      <el-input placeholder="请输入省" v-model="postForm.province" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="90px" label="市:" class="postInfo-container-item" prop="city">
                      <el-input placeholder="请输入市" v-model="postForm.city" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="90px" label="区:" class="postInfo-container-item" prop="country">
                      <el-input placeholder="请输入区" v-model="postForm.country" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="90px" label="地址:" class="postInfo-container-item" prop="address">
                      <el-input placeholder="请输入地址" v-model="postForm.address" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="90px" label="经度:" class="postInfo-container-item" prop="longitude">
                      <el-input placeholder="请输入经度" v-model="postForm.longitude" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="90px" label="纬度:" class="postInfo-container-item" prop="latitude">
                      <el-input placeholder="请输入纬度" v-model="postForm.latitude" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="90px" label="设备ip地址:" class="postInfo-container-item" prop="ip">
                      <el-input placeholder="请输入设备ip地址" v-model="postForm.ip" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="90px" label="设备端口:" class="postInfo-container-item" prop="port">
                      <el-input placeholder="请输入设备端口" v-model="postForm.port" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="showFlag === pageType.detail" :span="9">
                    <el-form-item label-width="90px" label="CPU使用率:" class="postInfo-container-item" prop="host_cpu">
                      <el-input placeholder="请输入CPU使用率" v-model="postForm.host_cpu" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="showFlag === pageType.detail" :span="9">
                    <el-form-item label-width="90px" label="内存使用率:" class="postInfo-container-item" prop="host_mem">
                      <el-input placeholder="请输入内存使用率" v-model="postForm.host_mem" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="showFlag === pageType.detail" :span="9">
                    <el-form-item label-width="90px" label="时钟状态:" class="postInfo-container-item" prop="host_clock">
                      <el-input placeholder="请输入时钟状态" v-model="postForm.host_clock" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="showFlag === pageType.detail" :span="9">
                    <el-form-item label-width="90px" label="风扇状态:" class="postInfo-container-item" prop="host_fan">
                      <el-input placeholder="请输入风扇状态" v-model="postForm.host_fan" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="showFlag === pageType.detail" :span="9">
                    <el-form-item label-width="90px" label="电源状态:" class="postInfo-container-item" prop="host_power">
                      <el-input placeholder="请输入电源状态" v-model="postForm.host_power" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="showFlag === pageType.detail" :span="9">
                    <el-form-item label-width="90px" label="设备温度:" class="postInfo-container-item" prop="host_temp">
                      <el-input placeholder="请输入设备温度" v-model="postForm.host_temp" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
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
        <el-button type="primary" @click="insertGt">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createDeviceGt, queryDeviceGt, updateDeviceGt, delDeviceGt, insertGt,deviceInfo,deviceCRUD } from '@/api/device/device.js'
import { queryArea } from '@/api/area/area.js'
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
        // device_name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        device_code: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        // gt_id: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        // length: [{ required: true, message: '请输入设备长度', trigger: 'blur' }],
        // longitude: [{ required: true, message: '请输入设备经度', trigger: 'blur' }],
        // latitude: [{ required: true, message: '请输入设备纬度', trigger: 'blur' }],
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
        keyword:''
      },
      postForm: {
          ope:'',
          device_code:'',
          addtime:'',
          host_clock:'',
          host_fan:'',
          host_power:'',
          device_name:'',
          province:'',
          city:'',
          longitude:'',
          latitude:'',
          ip:'',
          port:'',
          host_cpu:'',
          host_mem:'',
          host_temp:'',
          country:'',
          address:'',
      },
      areaList: [],
      currentRow: {},
      fileparam: {},
      dialogVisible: false
    }
  },
  created() {
    this.getList()
    //this.getAreaList()
  },

  computed: {
    mdcontent() {
      let str = this.postForm.gt_id == '' ? '请输入设备编号:' : '设备编号:'
      return str
    },
    headName() {
      let str = this.showFlag === this.pageType.add ? '新增设备':
        this.showFlag === this.pageType.edit ? '编辑设备' : '设备详情'

      return str
    }
  },
  methods: {
    // 获取设备列表数据
    getList() {
      this.listLoading = true
      deviceInfo(this.queryForm).then(res => {
        console.log(res)
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
      }).catch(err => {})
    },

    // 获取区域列表数据
    getAreaList() {
      queryArea({ page: 1, limit: 1000 }).then(res => {
        if (res.retcode == 200) {
          this.areaList = res.result
          if (this.list && this.list.length > 0) {
            this.total = res.total
          }
        }
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

    insertGt() {
      insertGt(this.fileparam).then(res => {
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
          this.postForm.ope='add'
          deviceCRUD(this.postForm).then(res => {
            if (res.retcode === 200) {
              this.$message({ type: 'success', message: '提交成功！'})
            } else {
              this.$message({ type: 'warning', message: res.status })
            }
            setTimeout(() => {
              this.showFlag = this.pageType.list
              this.getList()
            }, 500)
          })
        } else if (this.showFlag === this.pageType.edit) {
          this.postForm.ope='update'
          deviceCRUD(this.postForm).then(res => {
            if (res.retcode === 200) {
              this.$message({ type: 'success', message: '提交成功！'})
            } else {
              this.$message({ type: 'warning', message: res.status })
            }
            setTimeout(() => {
              this.showFlag = this.pageType.list
              this.getList()
            }, 500)
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
      params.device_code = row.device_code
      this.$confirm('设备删除后将不可恢复，确认删除该设备？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        params.ope='delete'
        deviceCRUD(params).then(res => {
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
