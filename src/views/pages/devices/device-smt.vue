<template>
  <div class="app-container">
    <div v-if="showFlag === pageType.list">
      <div class="filter-container">
        <el-input clearable placeholder="设备号/区域/设备代号" style="width: 300px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button class="filter-item" style="margin-left: 10px;float:right;margin-right: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('table.add') }}
        </el-button>
        <el-button v-waves class="filter-item" style="float: right;" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
        <!-- <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleShowImport1">
          设备导入
        </el-button> -->
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        :highlight-current-row="false"
        style="width: 100%;"
      >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.fields" style="width: calc(100% - 47px)" border>
            <el-table-column type="index" min-width="180" align="center" label="序号"></el-table-column>
            <el-table-column prop="field_id" min-width="180" align="center" label="防区代码"></el-table-column>
            <el-table-column prop="smt_field" min-width="180" align="center" label="防区号"></el-table-column>
            <el-table-column prop="interval_start" min-width="180" align="center" label="区间开始值"></el-table-column>
            <el-table-column prop="interval_end" min-width="180" align="center" label="区间结束值"></el-table-column>
            <el-table-column prop="zone" min-width="180" align="center" label="所属责任区"></el-table-column>
            <el-table-column :label="$t('table.actions')" align="center" width="200" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleNode(row)">
                  节点信息
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
        <el-table-column label="ID" type="index" align="center" width="80">
        </el-table-column>
        <el-table-column label="SMT设备号" min-width="150px" align="center" prop="smt_id">
        </el-table-column>
        <el-table-column label="关联GT设备号" min-width="150px" align="center" prop="gt_id">
        </el-table-column>
        <el-table-column label="名称代号" min-width="150px" align="center" prop="name">
        </el-table-column>
        <el-table-column label="设备GPS经度" min-width="120px" align="center" prop="longitude">
        </el-table-column>
        <el-table-column label="设备GPS纬度" min-width="120px" align="center" prop="latitude">
        </el-table-column>
        <el-table-column label="设备所属区域" min-width="200px" align="center" prop="area_name">
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" width="220" class-name="small-padding fixed-width">
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
              <el-row class="fit-padding">
                <el-col :span="18">
                  <el-form-item class="md-input" prop="smt_id">
                    <MDinput v-model="postForm.smt_id" :maxlength="100" name="name" required :disabled="showFlag !== pageType.add">
                      {{mdcontent}}
                    </MDinput>
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-row>
              <div class="postInfo-container fit-padding">
                <el-row>
                  <el-col :span="8">
                    <el-form-item label-width="90px" label="名称代号:" class="postInfo-container-item" prop="name">
                      <el-input v-model="postForm.name" placeholder="请输入名称代号" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="10">
                    <el-form-item label-width="120px" label="选择区域:" class="postInfo-container-item" prop="area_id">
                      <el-select v-model="postForm.area_id" style="width: 100%;" filterable default-first-option placeholder="请选择区域" :disabled="showFlag === pageType.detail">
                        <el-option v-for="item in areaList" :key="item.area_id" :label="item.area_name" :value="item.area_id" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6" style="min-height: 1px;">
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label-width="90px" label="GT设备:" class="postInfo-container-item" prop="gt_id">
                      <el-select v-model="postForm.gt_id" style="width: 100%" filterable default-first-option placeholder="请选择GT设备" :disabled="showFlag === pageType.detail">
                        <el-option v-for="item in gtList" :key="item.gt_id" :label="item.name" :value="item.gt_id" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="10">
                    <el-form-item label-width="120px" label="GPS信息:" class="postInfo-container-item" style="white-space: nowrap;">
                      <el-form-item label-width="0px" style="display: inline-block;min-width:125px;width: 49%;margin-right: 2%;" prop="longitude">
                        <el-input v-model="postForm.longitude" clearable :disabled="showFlag === pageType.detail" placeholder="请输入经度" style="display: inline-block;width: 100%;margin-right: 10px;"></el-input>
                      </el-form-item>
                      <el-form-item label-width="0px" style="display: inline-block;min-width:125px;width: 49%;" prop="latitude">   
                        <el-input v-model="postForm.latitude" clearable  :disabled="showFlag === pageType.detail" placeholder="请输入纬度" style="display: inline-block;width: 100%;"></el-input>
                      </el-form-item>
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
      <div class="filter-container formBar">
        <div class="form-head">
          防区信息
        </div>
        <!-- <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleShowImport2">
          防区导入
        </el-button> -->
        <el-button v-if="showFlag !== pageType.detail" v-waves class="filter-item" style="float: right;margin-right: 10px;" type="primary" icon="el-icon-document-checked" @click="handleAddBlock">
          添加防区
        </el-button>
      </div>
      <div class="block-wrapper" v-if="this.blockList.length !== 0">
        <div v-for="item in blockList" :key="item.field_id + '-' + item.timeStamp" style="margin-bottom: 10px;">
          <Block :block="item" :lineList="lineList" :showFlag="showFlag" :smtid="postForm.smt_id" @del="handleDelBlock" @getBlock="handleGetBlock"></Block>
        </div>
      </div>
      <div v-else class="block-info">
        暂无防区信息
      </div>
    </div>
    <div v-else-if="showFlag === pageType.node">
      <div class="filter-container formBar">
        <div class="form-head">
          节点信息
        </div>
        <el-button class="filter-item" style="margin-left: 10px;float:right;margin-right: 10px;" type="primary" icon="el-icon-back" @click="handleReturn">
          返回
        </el-button>
        <el-button v-if="showFlag !== pageType.detail" v-waves class="filter-item" style="float: right;" type="primary" icon="el-icon-document-checked" @click="handleAddNode">
          添加节点
        </el-button>
        <!-- <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleShowImport3">
          节点导入
        </el-button> -->
      </div>
      <div class="block-wrapper" v-if="this.nodeList.length !== 0">
        <div v-for="item in nodeList" :key="item.id">
          <NodeComp :block="item" :lineList="lineList" :showFlag="showFlag" :smtid="postForm.smt_id" @del="handleDelNode" @getNode="handleGetNode"></NodeComp>
        </div>
      </div>
      <div v-else class="block-info">
        暂无防区信息
      </div>
    </div>
    <el-dialog
      title="设备导入"
      :visible.sync="dialogVisible1"
      width="30%">
      <input type="file" @change="updateFile1" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="insertSmt">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="防区导入"
      :visible.sync="dialogVisible2"
      width="30%">
      <input type="file" @change="updateFile2" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="insertFields">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="节点导入"
      :visible.sync="dialogVisible3"
      width="30%">
      <input type="file" @change="updateFile3" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="insertNodes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createDeviceSmt, queryDeviceSmt, updateDeviceSmt, delDeviceSmt, queryDeviceGt, createNode, updateNode, queryNode, delNode, insertSmt, insertFields, insertNodes } from '@/api/device/device.js'
import { queryArea } from '@/api/area/area.js'
import { queryLine } from '@/api/line/line.js'
import { delField } from '@/api/device/device.js'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Block from './block.vue'
import NodeComp from './node.vue'

export default {
  name: 'ComplexTable',
  components: { Tinymce, MDinput, Pagination, Block, NodeComp },
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
        name: [{ required: true, message: '请输入名称代号', trigger: 'blur' }],
        area_id: [{ required: true, message: '请选择区域', trigger: 'change' }],
        gt_id: [{ required: true, message: '请选择GT设备', trigger: 'change' }],
        smt_id: [{ required: true, message: '请输入设备号', trigger: 'blur' }],
        longitude: [{ required: true, message: '请输入设备经度', trigger: 'blur' }],
        latitude: [{ required: true, message: '请输入设备纬度', trigger: 'blur' }],
      },
      showFlag: 0,
      nodeList: [],
      pageType: {
        list: 0,
        add: 1,
        edit: 2,
        detail: 3,
        node: 4
      },
      queryForm: {
        page: 1,
        limit: 15
      },
      postForm: {
        smt_id: '',
        gt_id: '',
        area_id: '',
        name: '',
        longitude: '',
        latitude: '',
        fields: []
      },
      areaList: [],
      gtList: [],
      currentRow: {},
      blockList: [],
      lineList: [],
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      fileparam1: {},
      fileparam2: {},
      fileparam3: {},
    }
  },
  created() {
    this.getList()
    this.getAreaList()
    this.getGtList()
    this.getLineList()
  },

  computed: {
    mdcontent() {
      let str = this.postForm.smt_id == '' ? '请输入设备号:' : '设备号:'
      return str
    },
    headName() {
      let str = this.showFlag === this.pageType.add ? '新增SMT设备':
        this.showFlag === this.pageType.edit ? '编辑SMT设备' : 'SMT设备详情'

      return str
    }
  },
  methods: {
    // 获取设备列表数据
    getList() {
      this.listLoading = true
      queryDeviceSmt(this.queryForm).then(res => {
        if (res.retcode === 200) {
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

    // 获取区域列表数据
    getAreaList() {
      queryArea({ page: 1, limit: 1000 }).then(res => {
        if (res.retcode == 200) {
          this.areaList = res.result
          if (this.list && this.list.length > 0) {
            this.total = this.list.length
          }
        }
      })
    },

    // 获取区域列表数据
    getLineList() {
      queryLine({ page: 1, limit: 1000 }).then(res => {
        if (res.retcode == 200) {
          this.lineList = res.result
          if (this.list && this.list.length > 0) {
            this.total = this.list.length
          }
        }
      })
    },

    // 获取gt列表数据
    getGtList() {
      queryDeviceGt({ page: 1, limit: 1000 }).then(res => {
        if (res.retcode == 200) {
          this.gtList = res.result
          if (this.list && this.list.length > 0) {
            this.total = this.list.length
          }
        }
      })
    },

    handleFilter() {
	this.queryForm.page=1
      this.getList()
    },

    handleShowImport1() {
      this.dialogVisible1 = true
    },

    updateFile1(e) {
        let file = e.target.files[0];
        this.fileparam1 = new FormData(); //创建form对象
        this.fileparam1.append('excel_file',file);//通过append向form对象添加数据
        console.log(this.fileparam1.get('excel_file'));

    },
    
    handleShowImport2() {
      let temp = true
      Object.keys(this.postForm).forEach(k => {
        console.log(k, this.postForm[k], this.postForm)
        if ((this.postForm[k] == '' || this.postForm[k] == undefined) 
          && k!== 'fields'
          && k!== 'area_name'
          && k!== 'time'
          && k!== 'smt_id'
        ) {
          temp = false
          return
        }
      })
      if (!temp) {
        this.$message({ type: 'warning', message: '请先输入SMT设备信息！' })
        return
      }
      this.dialogVisible2 = true
    },

    updateFile2(e) {
        let file = e.target.files[0];
        this.fileparam2 = new FormData(); //创建form对象
        this.fileparam2.append('excel_file',file);//通过append向form对象添加数据
        console.log(this.fileparam2.get('excel_file'));

    },

    handleShowImport3() {
      this.dialogVisible3 = true
    },

    updateFile3(e) {
        let file = e.target.files[0];
        this.fileparam3 = new FormData(); //创建form对象
        this.fileparam3.append('excel_file',file);//通过append向form对象添加数据
        console.log(this.fileparam3.get('excel_file'));

    },

    insertSmt() {
      insertSmt(this.fileparam1).then(res => {
        if (res.retcode == 200) {
          this.$message({ type: 'success', message: '设备导入成功！' })
          setTimeout(() => {
            this.dialogVisible = false
          }, 500);
        } else {
          this.$message({ type: 'warning', message: `设备导入失败！${res.status}` })
        }
      })
    },

    insertFields() {
      insertFields(this.fileparam2).then(res => {
        if (res.retcode == 200) {
          this.$message({ type: 'success', message: '防区导入成功！' })
          setTimeout(() => {
            this.dialogVisible = false
          }, 500);
        } else {
          this.$message({ type: 'warning', message: `防区导入失败！${res.status}` })
        }
      })
    },

    insertNodes() {
      insertNodes(this.fileparam3).then(res => {
        if (res.retcode == 200) {
          this.$message({ type: 'success', message: '节点导入成功！' })
          setTimeout(() => {
            this.dialogVisible = false
          }, 500);
        } else {
          this.$message({ type: 'warning', message: `节点导入失败！${res.status}` })
        }
      })
    },

    //方法：判断数组中是否含有空字段
    judgeObjHasNull (obj) {
      let temp = false
      Object.keys(obj).forEach((item, index) => {
        if (obj[item] === '') {
          temp = true
        }
      })
      return temp
    },

    // 跳转至新增设备页面
    handleCreate() {
      this.showFlag = this.pageType.add
      this.currentRow = {}
      this.blockList = []
      this.handleReset()
    },

    // 返回列表页面
    handleReturn() {
      this.showFlag = this.pageType.list
      this.currentRow = {}
      this.blockList = []
      this.$nextTick(() => {
        this.getList()
      })
    },

    // 重置表单
    handleReset() {
      Object.keys(this.postForm).forEach((item) => {
        this.postForm[item] = this.currentRow[item]
      })
      if (this.showFlag === this.pageType.add) {
        this.blockList = []
      } else {
        this.blockList = this.currentRow.fields
      }
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
      if (!validTemp) return
      let blockTempArr = []
      this.blockList.forEach((item, index) => {
        if (this.judgeObjHasNull(item)) {
          blockTempArr.push(index)
        }
      })
      if (blockTempArr.length !== 0) {
        this.$confirm('该设备存在未确认的防区，是否继续提交？', '提示', {
          confirmButtonText: '提交',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          blockTempArr.forEach(item => {
            this.blockList.splice(item, 1)
          })
        }).catch((err) => {
          console.log(err)
        })
      }
      this.postForm.fields = this.blockList || []
      if (this.showFlag === this.pageType.add) {
        createDeviceSmt(this.postForm).then(res => {
          if (res.retcode === 200) {
            this.$message({ type: 'success', message: '提交成功！' })
            this.handleReturn()
          } else {
            this.$message({ type: 'warning', message: `提交失败！${res.status}` })
          }
        })
      } else {
        let params = {}
        params.smt_id = this.postForm.smt_id
        params.area_id = this.postForm.area_id
        params.name = this.postForm.name
        params.gt_id = this.postForm.gt_id
        params.name = this.postForm.name
        params.longitude = this.postForm.longitude
        params.latitude = this.postForm.latitude
        params.fields = this.postForm.fields
        updateDeviceSmt(params).then(res => {
          if (res.retcode === 200) {
            this.$message({ type: 'success', message: '提交成功！' })
            this.handleReturn()
          } else {
            this.$message({ type: 'warning', message: `提交失败！${res.status}` })
          }
        })
      }
      
      this.postForm.fields = this.blockList
      console.log(this.postForm)
      // let validTemp
      // this.$refs['postForm'].validate((valid) => {
      //   if (valid) {
      //     validTemp = true
      //   } else {
      //     console.log('error submit!!');
      //     validTemp = false
      //     return false;
      //   }
      // });
      // // 若验证通过则继续请求
      // if (validTemp) {
      //   this.$message({ type: 'success', message: '提交成功！'})
      //   setTimeout(() => {
      //     this.showFlag = this.pageType.list
      //   }, 500)
      // }
    },

    // 跳转至编辑页面
    handleUpdate(row) {
      this.showFlag = this.pageType.edit
      row.fields.forEach(item => {
        item.status = 1
      })
      this.currentRow = JSON.parse(JSON.stringify(row))
      console.log('this.currentRow', this.currentRow)
      Object.keys(row).forEach(item => {
        this.postForm[item] = row[item]
      })
      
      this.blockList = this.postForm.fields
    },

    // 跳转至详情页面
    handleDetail(row) {
      this.showFlag = this.pageType.detail
      Object.keys(this.postForm).forEach(item => {
        this.postForm[item] = row[item]
      })
    },

    // 设备删除
    handleDelete(row) {
      this.$confirm('设备删除后将不可恢复，确认删除该设备？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDeviceSmt({ smt_id: row.smt_id }).then(res => {
          if (res.retcode === 200) {
            this.$message({ type: 'success', message: '删除成功！' })
            setTimeout(() => {
              this.getList()
            }, 200)
          } else {
            this.$message({ type: 'warning', message: `删除失败,${res.status}` })
          }
        })
      }).catch(err => {
        console.log(err)
      })
    },

    getNodeList() {
      queryNode({ field_id: this.currentField.field_id }).then(res => {
        if (res.retcode == 200) {
          this.nodeList = res.result || []
          if (this.nodeList.length > 0) {
            this.nodeList.forEach(item => {
              item.status = 1
            })
          }
        }
      })
    },

    // 新增节点表单
    handleAddNode() {
      let canjoin = true
      if (this.nodeList.length > 0) {
        this.nodeList.forEach(item => {
          if (item.status == 0) {
            canjoin = false
          }
        })
      }
      if (!canjoin) {
        this.$message({ type: 'warning', message: '请先确认保存上一节点！' })
        return
      }
      let obj = {
        order: '',
        lng: '',
        lat: '',
        status: 0
      }
      this.nodeList.push(obj)
      console.log("nodeList", this.nodeList)
    },

    handleGetNode(node) {
      console.log("node", node)
      let params = {}
      params.field_id = this.currentField.field_id
      params.order = node.order
      params.longitude = node.longitude
      params.latitude = node.latitude
      if (node.id) {
        params.id = node.id
        updateNode(params).then(res => {
          if (res.retcode == 200) {
            this.$message({ type: 'success', message: '修改节点成功！' })
            this.getNodeList()
          }
        })
      } else {
        createNode(params).then(res => {
          if (res.retcode === 200) {
            this.$message({ type: 'success', message: '新增节点成功！' })
            this.getNodeList()
          }
        })
      }
    },

    handleDelNode(val) {
      if (val == '') {
        this.nodeList.splice(this.nodeList.length - 1, 1)
      } else {
        this.nodeList.forEach((item, index) => {
          if (item.id == val) {
            delNode({ id: item.id }).then(res => {
              if (res.retcode == 200) {
                this.$message({ type: 'success', message: '节点已删除！' })
                this.getNodeList()
              }
            })
          }
        })
      }
    },

    // 新增防区表单
    handleAddBlock() {
      let temp = true
      Object.keys(this.postForm).forEach(k => {
        console.log(k, this.postForm[k], this.postForm)
        if ((this.postForm[k] == '' || this.postForm[k] == undefined) 
          && k!== 'fields'
          && k!== 'area_name'
          && k!== 'time'
          && k!== 'smt_id'
        ) {
          temp = false
          return
        }
      })
      if (!temp) {
        this.$message({ type: 'warning', message: '请先输入SMT设备信息！' })
        return
      }
      let obj = {
        timeStamp: (new Date()).valueOf(),
        zone: '',
        smt_field: '',
        interval_start: '',
        interval_end: ''
      }
      this.blockList.push(obj)
    },

    // 确认接受子组件Block传值
    handleGetBlock(block) {
      this.blockList.forEach(item => {
        if (item.timeStamp === block.timeStamp) {
          Object.keys(block).forEach(k => {
            item[k] = block[k]
          })
        }
      })
      console.log(this.blockList)
    },

    // 删除接受子组件Block传值
    handleDelBlock(val) {
      this.blockList.forEach((item, index) => {
        // 新建防区时用事件戳判断
        if (item.timeStamp) {
          if (item.timeStamp === val) {
            this.blockList.splice(index, 1)
          }
        } else {
        // 防区修改时用id判断
          if (item.smt_field === val) {
            this.blockList.splice(index, 1)
            delField({ field_id: item.field_id }).then(res => {
              if (res.retcode === 200) {
                this.$message({ type: 'success', message: '删除成功！' })
              } else {
                this.$message({ type: 'warning', message: `删除失败，${res.status}` })
              }
            })
          }
        }

      })
      this.$forceUpdate()
    },

    handleNode(row) {
      this.currentField = row
      console.log("field", row)
      this.showFlag = this.pageType.node
      this.getNodeList()
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
    margin-bottom: 20px;
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
    overflow: auto;
  }

  .block-wrapper {
    // border: 1px solid #dfe6ec;
    margin: 20px 10px;
    margin-left: 40px;
  }

  .block-info {
    font-size: 16px;
    margin-top: 50px;
    color: #999;
    text-align: center;
    width: 100%;
  }

  .md-input {
    margin-bottom: 20px;
    margin-top: -40px;
    margin-left: 15px;
  }

  .fit-padding {
    padding-left: 10px;
  }

  /deep/ .el-table__expand-icon>.el-icon {
    font-weight: bolder;
    color: #2f4255;
  }
</style>
