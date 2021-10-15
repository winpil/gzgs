<template>
  <div class="app-container">
    <div v-if="showFlag === pageType.list">
      <div class="filter-container">
        <el-input v-model="queryForm.device_code" clearable placeholder="设备编号" style="width: 300px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" /> 
        <el-input v-model="queryForm.channel_name" clearable placeholder="线路名称" style="width: 300px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" /> 
        
        <el-select clearable style="position: absolute;" v-model="queryForm.is_valid" placeholder="请选择是否有效">
          <!-- <el-option label="请选择" value=''></el-option> -->
          <el-option label="无效" :value=0></el-option>
          <el-option label="有效" :value=1></el-option>
        </el-select> 
        <el-select clearable style="position: absolute;margin-left: 215px;" v-model="queryForm.defense_status" placeholder="请选择状态">
          <!-- <el-option label="请选择" value=''></el-option> -->
          <el-option label="撤防" :value=0></el-option>
          <el-option label="布防" :value=1></el-option>
        </el-select>

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
        <el-table-column label="序号" min-width="80px" align="center" prop="id">
        </el-table-column>
        
        <el-table-column label="设备编号" min-width="180px" align="center" prop="device_code">
        </el-table-column>
        <el-table-column label="线路编号" min-width="120px" align="center" prop="channel_code">
        </el-table-column>
        <el-table-column label="线路名称" min-width="180px" align="center" prop="channel_name">
        </el-table-column>

        <el-table-column label="节点" min-width="120px" align="center" prop="node_id">
        </el-table-column>
        <el-table-column label="经度" min-width="120px" align="center" prop="longitude">
        </el-table-column>
        <el-table-column label="纬度" min-width="120px" align="center" prop="latitude">
        </el-table-column>
        <el-table-column label="地址" min-width="120px" align="center" prop="address">
        </el-table-column>
        <el-table-column label="区间前(米)" min-width="120px" align="center" prop="before_pos">
        </el-table-column>
        <el-table-column label="区间后(米)" min-width="120px" align="center" prop="after_pos">
        </el-table-column>
        <el-table-column label="开始时间" min-width="100px" align="center" prop="start_time">
        </el-table-column>
        <el-table-column label="结束时间" min-width="100px" align="center" prop="end_time">
        </el-table-column>

        <el-table-column label="备注" min-width="180px" align="center" prop="remarks">
        </el-table-column>

        <el-table-column label="是否有效" align="center" width="80px">
          <template slot-scope="{row,$index}">
            <span v-if="row.is_valid">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="是否有效" min-width="80px" align="center" prop="is_valid">
        </el-table-column> -->
        <el-table-column label="状态" min-width="80px" align="center" prop="defense_status">
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
              <div class="postInfo-container fit-padding" >
                <el-row>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="设备编号:" class="postInfo-container-item" prop="device_code">
                      <el-input @change="changeQueryNode" placeholder="请输入设备编号" v-model="postForm.device_code" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail || showFlag === this.pageType.edit"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="线路编号:" class="postInfo-container-item" prop="channel_code">
                      <el-input @change="changeQueryNode" placeholder="请输入线路编号" v-model="postForm.channel_code" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail || showFlag === this.pageType.edit"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="线路名称:" class="postInfo-container-item" prop="channel_name">
                      <el-input placeholder="请输入线路名称" v-model="postForm.channel_name" style="min-width: 120px;" clearable :disabled=true></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="9">
                    <el-form-item label-width="120px" label="节点:" class="postInfo-container-item" prop="node_id">
                      <el-select @change="changeNodeChuFa" v-model="postForm.node_id" placeholder="请选择节点" :disabled="showFlag === pageType.detail || showFlag === this.pageType.edit">
                          <el-option
                            v-for="item in jiedianList"
                            :key="item.node_id"
                            :label="item.node_id"
                            :value="item.node_id"
                            >
                          </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="9">
                    <el-form-item label-width="120px" label="经度:" class="postInfo-container-item" prop="longitude">
                      <el-input placeholder="请输入经度" v-model="postForm.longitude" style="min-width: 120px;" :disabled=true></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="纬度:" class="postInfo-container-item" prop="latitude">
                      <el-input placeholder="请输入纬度" v-model="postForm.latitude" style="min-width: 120px;" :disabled=true></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="地址:" class="postInfo-container-item" prop="address">
                      <el-input placeholder="请输入地址" v-model="postForm.address" style="min-width: 120px;" :disabled=true></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    &nbsp;
                  </el-col>

                  <el-col :span="9">
                    <el-form-item label-width="120px" label="区间前(米):" class="postInfo-container-item" prop="before_pos">
                      <el-input placeholder="请输入区间前(米)" v-model="postForm.before_pos" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="区间后(米):" class="postInfo-container-item" prop="after_pos">
                      <el-input placeholder="请输入区间后(米)" v-model="postForm.after_pos" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="9">
                    <el-form-item label-width="120px" label="开始结束时间:" class="postInfo-container-item" prop="value1" >
                      <el-date-picker
                          v-model="postForm.value1"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          align="right"
                          :disabled="showFlag === pageType.detail">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :span="9">
                    <el-form-item label-width="120px" label="备注:" class="postInfo-container-item" prop="remarks">
                      <el-input placeholder="请输入备注" v-model="postForm.remarks" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="9">
                    <el-form-item label-width="120px" label="是否有效:" class="postInfo-container-item" prop="is_valid">
                      <el-select v-model="postForm.is_valid" placeholder="请选择是否有效" :disabled="showFlag === pageType.detail">
                        <el-option label="无效" value="0"></el-option>
                        <el-option label="有效" value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label-width="120px" label="状态:" class="postInfo-container-item" prop="defense_status">
                      <el-select  v-model="postForm.defense_status" placeholder="请选择状态" :disabled="showFlag === pageType.detail">
                        <el-option label="撤防" value="0"></el-option>
                        <el-option label="布防" value="1"></el-option>
                      </el-select>
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
import { getNodeInfo,cancelDefenseInfo,cancelDefenseCRUD,lineInfo,lineCRUD,createLine, queryLine, updateLine, delLine, insertZones } from '@/api/line/line.js'
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
      pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
                }
            }]
        },
      value1:'',
      jiedianList:[],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      postRules: {
        device_code:[{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        channel_code:[{ required: true, message: '请输入线路编号', trigger: 'blur' }],
        channel_name: [{ required: true, message: '请输入线路名称', trigger: 'blur' }],
        before_pos: [{ required: true, message: '请输入区间前(米)', trigger: 'blur' }],
        after_pos: [{ required: true, message: '请输入区间后(米)', trigger: 'blur' }],
        value1: [{ required: true, message: '请选择开始结束时间', trigger: 'blur' }],
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
        device_code:'',
        is_valid:'',
        defense_status:''
      },
      postForm: {
        device_code:'',
        channel_code:'',
        channel_name:'',
        length:'',
        check_name:'',
        check_phone:'',
        before_pos:'',
        after_pos:'',
        remarks:'',
        is_show:true,
        node_id:'',
        value1:'',
        longitude:'',
        latitude:'',
        address:'',
        defense_status:'1',
        is_valid:'1',
        start_time:'',
        end_time:'',
        id:'',
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
      let str = this.showFlag === this.pageType.add ? '新增布防撤防':
        this.showFlag === this.pageType.edit ? '编辑布防撤防' : '布防撤防详情'

      return str
    }
  },
  methods: {
    changeNodeChuFa(val){
      for(var i=0;i<this.jiedianList.length;i++){
        if(this.jiedianList[i].node_id==val){
          this.postForm.longitude=this.jiedianList[i].longitude
          this.postForm.latitude=this.jiedianList[i].latitude
          this.postForm.address=this.jiedianList[i].address
          break;
        }
      }
      // debugger
    },
    changeQueryNode(){
      this.jiedianList=[]
      if(this.postForm.device_code && this.postForm.channel_code){
        getNodeInfo(this.postForm).then(res => {
          if (res.retcode == 200) {
            // debugger
            this.jiedianList = res.result
            this.postForm.channel_name=res.channel_name
          }
        })
      }
    },
    // 获取设备列表数据
    getList() {
      this.listLoading = true
      // debugger
      cancelDefenseInfo(this.queryForm).then(res => {
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
      this.postForm.is_valid="1"
      this.postForm.defense_status="1"
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

      if(this.postForm.value1!=null && this.postForm.value1.length==2){
        this.postForm.start_time=this.postForm.value1[0]
        this.postForm.end_time=this.postForm.value1[1]
      }else{
        this.$message({ type: 'warning', message: '请选择开始结束时间' })
        return 
      }

      // if(this.postForm.is_show=='true'){
      //   this.postForm.is_show=true
      // }else{
      //   this.postForm.is_show=false
      // }
      // 若验证通过则继续请求
      if (validTemp) {
        if (this.showFlag === this.pageType.add) {
          this.postForm.ope='add'
          cancelDefenseCRUD(this.postForm).then(res => {
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
          cancelDefenseCRUD(this.postForm).then(res => {
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
      // debugger
      this.showFlag = this.pageType.edit
      this.currentRow = row
      Object.keys(this.postForm).forEach(item => {
        this.postForm[item] = row[item]
      })
      this.postForm.value1=[row.start_time,row.end_time]
      this.postForm.is_valid=row.is_valid?"1":"0"
    },

    // 跳转至详情页面
    handleDetail(row) {
      this.showFlag = this.pageType.detail
      Object.keys(this.postForm).forEach(item => {
        this.postForm[item] = row[item]
      })
      this.postForm.value1=[row.start_time,row.end_time]
      this.postForm.is_valid=row.is_valid?"1":"0"
    },

    handleDelete(row) {
      let params = {}
      params.id = row.id
      this.$confirm('删除后将不可恢复，确认删除？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        params.ope='delete'
        cancelDefenseCRUD(params).then(res => {
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
