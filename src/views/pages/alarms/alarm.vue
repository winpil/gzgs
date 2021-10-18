<template>
  <div class="app-container">
    <div v-if="showFlag === pageType.list">
      <div class="filter-container">
        <el-input v-model="queryForm.device_code" clearable placeholder="设备编号" style="width: 300px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" /> 
        <el-input v-model="queryForm.channel_name" clearable placeholder="线路名称" style="width: 300px;margin-right: 10px;" class="filter-item" @keyup.enter.native="handleFilter" /> 
        <el-select style="position: absolute;" v-model="queryForm.deal_result" placeholder="请选择" @change="handleFilter">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <!-- <el-button class="filter-item" style="margin-left: 10px;float:right;margin-right: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          {{ $t('table.add') }}
        </el-button> -->
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
        <el-table-column label="告警id" align="center"  min-width="120" prop="alert_id">
        </el-table-column>
        <el-table-column label="设备编号" min-width="180px" align="center" prop="device_code">
        </el-table-column>
        <el-table-column label="线路编号" min-width="180px" align="center" prop="channel_code">
        </el-table-column>
        <el-table-column label="线路名称" min-width="180px" align="center" prop="channel_name">
        </el-table-column>
        <el-table-column label="开始时间" min-width="120px" align="center" prop="start_time">
        </el-table-column>
        <el-table-column label="结束时间" min-width="120px" align="center" prop="end_time">
        </el-table-column>
        <el-table-column label="告警位置" min-width="120px" align="center" prop="position">
        </el-table-column>
        <el-table-column label="告警类型" min-width="100px" align="center" prop="alarm_type">
        </el-table-column>
        <el-table-column label="告警等级" min-width="100px" align="center" prop="alarm_level">
        </el-table-column>
        <el-table-column label="防御状态" align="center" width="80" >
          <template slot-scope="{row,$index}">
            <span v-if="row.defense_status=='0'">撤防</span>
             <span v-if="row.defense_status=='1'">布防</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="处理结果" align="center" width="120" >
          <template slot-scope="{row,$index}">
            <el-button v-if="row.deal_result=='未处理'" type="primary" size="mini" @click="handleChuLi(row)">
              点我处理
            </el-button>
            <span v-else>{{row.deal_result}}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="处理人" min-width="100px" align="center" prop="deal_name">
        </el-table-column>
        <el-table-column label="处理人手机号" min-width="120px" align="center" prop="deal_phone">
        </el-table-column>
        <el-table-column label="处理备注" min-width="190px" align="center" prop="deal_remarks">
        </el-table-column>
        <el-table-column label="处理时间" min-width="100px" align="center" prop="deal_time">
        </el-table-column>
        
      </el-table>

      <pagination v-show="total>0" :total="total" :page-sizes="pageSizes" :page.sync="queryForm.page" :limit.sync="queryForm.limit" @pagination="getList" />
    </div>

    <el-dialog  width="600px" title="告警处理" :close-on-click-modal="false" :visible.sync="chuliVisible">
      <el-form label-width="120px" ref="alarmForm" :model="alarmForm"  >
        <el-form-item label="处理结果">
            <el-select v-model="alarmForm.deal_result" placeholder="请选择处理结果">
                <el-option label="误报" value="1"></el-option>
                <el-option label="正常处理" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="处理人">
            <el-input v-model="alarmForm.deal_name"></el-input>
        </el-form-item>
        <el-form-item label="处理人手机">
            <el-input v-model="alarmForm.deal_phone"></el-input>
        </el-form-item>
        <el-form-item label="备注">
            <el-input v-model="alarmForm.deal_remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native.prevent="chuliVisible=false" >取 消</el-button>
        <el-button type="primary" @click.native.prevent="chuliLogin" >提 交</el-button>
      </div>
    </el-dialog>

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
import { alarmInfo,alarmChuli } from '@/api/alarm/alarm.js'
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
        chuliVisible:false,
        pageSizes: [10, 20, 30, 50],
        options: [{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '未处理'
        },{
          value: '1',
          label: '误报'
        }, {
          value: '2',
          label: '已处理'
        }],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      postRules: {
        device_code:[{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        channel_code:[{ required: true, message: '请输入线路编号', trigger: 'blur' }],
        channel_name: [{ required: true, message: '请输入线路名称', trigger: 'blur' }],
        length: [{ required: true, message: '请输入线路长度', trigger: 'blur' }],
        check_name: [{ required: true, message: '请输入巡检员', trigger: 'blur' }],
        check_phone: [{ required: true, message: '请输入巡检员手机号', trigger: 'blur' }],
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
        deal_result:'',
      },
      currentAlarm:{},
      alarmForm:{
        alert_id:'',
        deal_result:'',
        deal_name:'',
        deal_phone:'',
        deal_remarks:'',
      },
      postForm: {
        device_code:'',
        channel_code:'',
        channel_name:'',
        length:'',
        check_name:'',
        check_phone:'',
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
      chuliLogin(){
          alarmChuli(this.alarmForm).then(res => {
            //   debugger
            if (res.retcode == 200) {
                this.$message({ type: 'success', message: '提交成功！'})
                this.chuliVisible=false
                this.getList()
            }
        })
      },
      handleChuLi(row){
          this.alarmForm.alert_id=row.alert_id
          this.currentAlarm=row
          this.chuliVisible=true
      },
    // 获取设备列表数据
    getList() {
      this.listLoading = true
      // debugger
      alarmInfo(this.queryForm).then(res => {
        //   debugger
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
      // 若验证通过则继续请求
      if (validTemp) {
        if (this.showFlag === this.pageType.add) {
          this.postForm.ope='add'
          lineCRUD(this.postForm).then(res => {
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
          lineCRUD(this.postForm).then(res => {
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
      params.device_code = row.device_code
      params.channel_code = row.channel_code
      this.$confirm('线路删除后将不可恢复，确认删除该线路？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        params.ope='delete'
        lineCRUD(params).then(res => {
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
