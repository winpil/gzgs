<template>
  <div class="app-container">
    <div v-if="pageFlag === pageType.list">
      <div class="filter-container" style="margin-bottom: 10px;">
        <el-input v-model="queryForm.keyword" clearable placeholder="线路ID" style="width: 200px;margin-right: 10px;margin-bottom: 1px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-date-picker
            v-model="queryForm.dateTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            style="margin-top: -10px;">
        </el-date-picker>
        <el-button v-waves class="filter-item" style="float: right;" type="primary" icon="el-icon-search" @click="handleFilter">
          {{ $t('table.search') }}
        </el-button>
        <el-button class="filter-item" style="float: right;margin-right: 10px;" type="primary" icon="el-icon-download" @click="handleExport">
          导出
        </el-button>
        <!-- <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleShowImport">
          数据导入
        </el-button> -->
        <!-- <el-button v-waves class="filter-item" style="float: right;" type="primary" icon="el-icon-setting" @click="handleSet">
          事件条件设置
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
        <el-table-column label="序号" type="index" align="center" width="50">
        </el-table-column>
        <el-table-column label="线路ID" width="70px" prop="channel" align="center">
          <template slot-scope="{row}">
            <span>{{ row.channel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="线路名" width="200px" align="center" prop="line_name">
        </el-table-column>
       <!-- <el-table-column label="设备编号" width="200px" align="center" prop="device_id">
        </el-table-column> -->
        <!-- <el-table-column label="设备类型" width="100px" align="center" prop="device_type">
          <template slot-scope="{row}">
            <span>{{ row.device_type === 0 ? '防区型' : '定位型' }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="开始时间" width="160px" align="center" prop="begin_time">
          <template slot-scope="{row}">
            <span>{{ row.begin_time.split('T')[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="160px" align="center" prop="end_time">
          <template slot-scope="{row}">
            <span>{{ row.end_time.split('T')[0] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="位置" width="180px" align="center" prop="address">
        </el-table-column>
        <el-table-column label="距离" width="80px" align="center" prop="position">
        </el-table-column>
        <el-table-column label="次数" width="50px" align="center" prop="frequency">
        </el-table-column>
        <el-table-column label="告警级别" width="80px" align="center" prop="alarm_level">
        </el-table-column>
        <el-table-column label="告警分类" width="80px" align="center" prop="alarm_type">
        </el-table-column>
        <el-table-column label="事件状态" width="150px" align="center" prop="status">
          <template slot-scope="{row}">
            <div style="display: flex;padding-left: 30px;justify-content: space-between;">
              <span v-if="row.status == 0" class="el-icon-warning" style="font-size: 16px;flex: 0 0 20px;padding-top: 3px;color: orange;"></span>
              <span v-if="row.status == 1" class="el-icon-more" style="font-size: 16px;flex: 0 0 20px;padding-top: 3px;color: orange;"></span>
              <span v-if="row.status == 2" class="el-icon-success" style="font-size: 16px;flex: 0 0 20px;padding-top: 3px;color: orange;"></span>
              <span v-if="row.status == 3" class="el-icon-success" style="font-size: 16px;flex: 0 0 20px;padding-top: 3px;color: #73da73;"></span>
              <span v-if="row.status == 4" class="el-icon-success" style="font-size: 16px;flex: 0 0 20px;padding-top: 3px;color: orange;"></span>
              <span v-if="row.status == 9" class="el-icon-more" style="font-size: 16px;flex: 0 0 20px;padding-top: 3px;color: orange;"></span>
              <span style="flex: 1;text-align: left;padding-left: 20px;">{{row.dealName}}</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="非受控描述" width="200px" align="center" prop="text">
          <template slot-scope="{row}">
            {{ row.text == 0 ? '无' : row.text }}
          </template>
        </el-table-column>
        <el-table-column label="确认人姓名" width="200px" align="center" prop="name">
          <template slot-scope="{row}">
            <span>{{ row.confirm === 0 ? '未确认' : row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" width="200px" align="center" prop="phone">
        </el-table-column>
        <el-table-column label="经度" width="200px" align="center" prop="longitude">
          <template slot-scope="{row}">
            <span>{{Number(row.longitude).toFixed(4)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="纬度" width="200px" align="center" prop="latitude">
          <template slot-scope="{row}">
            <span>{{Number(row.latitude).toFixed(4)}}</span>
          </template>
        </el-table-column> -->
        
        <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="120" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleDeal(row)" :disabled="row.status == 2 || row.status == 3 || row.status == 4">
              处理
            </el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              {{ $t('table.delete') }}
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page-sizes="pageSizes" :page.sync="queryForm.page" :limit.sync="queryForm.limit" @pagination="getList" />
    </div>
    <div v-else-if="pageFlag === pageType.set">
      <div class="filter-container formBar">
        <div class="form-head">
          事件条件设置
        </div>
        <el-button class="filter-item" style="margin-left: 10px;float:right;margin-right: 10px;" type="primary" icon="el-icon-back" @click="handleReturn">
          返回
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
                  <el-form-item class="md-input" prop="gt_id">
                    <MDinput v-model="postForm.gt_id" :maxlength="100" name="name" required disabled>
                      找重合并：
                    </MDinput>
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-row>
              <div class="postInfo-container fit-padding" >
                <el-row style="margin: 20px 0;margin-bottom: 40px;">
                  <div style="margin-left: 15px;color: #444;line-height: 40px;">
                    <span style="margin-right: 10px;">GT：满足在</span> 
                    <el-input
                      placeholder="请输入时间"
                      size="mini"
                      style="width: 110px;" v-model="judgeForm.range1">
                      <span slot="suffix" style="height: 28px;line-height: 28px;">秒</span>
                    </el-input>
                    <span style="margin-left: 10px;">时间内，</span>
                    <el-input
                      placeholder="请输入长度"
                      size="mini"
                      style="width: 110px;"
                      v-model="judgeForm.length1">
                      <span slot="suffix" style="height: 28px;line-height: 28px;">米</span>
                    </el-input>
                    <span style="margin: 0 10px;">的长度范围，发生</span>
                    <el-input
                      placeholder="请输入次数"
                      size="mini"
                      v-model="judgeForm.times1"
                      style="width: 110px;">
                      <span slot="suffix" style="height: 28px;line-height: 28px;">次</span>
                    </el-input>
                    <span style="margin-left: 10px;">次以上的振动数据为一次真实事件；</span>
                  </div>
                </el-row>
                <el-row style="margin-bottom: 40px;">
                  <div style="margin-left: 15px;color: #444;line-height: 40px;">
                    <span style="margin-right: 10px;">SMT：满足在</span> 
                    <el-input
                      placeholder="请输入时间"
                      size="mini"
                      v-model="judgeForm.range2"
                      style="width: 110px;">
                      <span slot="suffix" style="height: 28px;line-height: 28px;">秒</span>
                    </el-input>
                    <span style="margin: 0 10px;">时间内，a防区，发生</span>
                    <el-input
                      placeholder="请输入次数"
                      size="mini"
                      v-model="judgeForm.times2"
                      style="width: 110px;">
                      <span slot="suffix" style="height: 28px;line-height: 28px;">次</span>
                    </el-input>
                    <span style="margin-left: 10px;">次以上的振动数据进行合并为一次事件；</span>
                  </div>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialogTableVisible" :title="title" :before-close="handleCancel">
      <div v-if="showFlag === dialogType.confirm">
        <el-form label-position="left" label-width="80px" :model="confirmForm" style="overflow: hidden;">
          <div class="event-wrapper">
            <el-form-item label="所属线路" class="flex-item" style="margin-right: 80px;">
              <el-input disabled v-model="this.confirmForm.line"></el-input>
            </el-form-item>
            <el-form-item label="发生时间" class="flex-item">
              <el-input disabled v-model="this.confirmForm.time"></el-input>
            </el-form-item>
          </div>
          <div class="event-wrapper">
            <el-form-item label="负责人" class="flex-item" style="margin-right: 80px;">
              <el-input disabled v-model="this.confirmForm.person"></el-input>
            </el-form-item>
            <el-form-item label="位置" class="flex-item">
              <el-input disabled v-model="this.confirmForm.position"></el-input>
            </el-form-item>
          </div>
          <el-button style="float: right;margin-right: 90px;margin-left: 10px;" @click="handleCancel">取消</el-button>
          <el-button type="primary" style="float: right;" @click="handleConfirm">确认</el-button>
        </el-form>
      </div>
      <div v-else-if="showFlag === dialogType.deal">
        <el-form ref="eventForm" label-position="left" label-width="100px" :model="eventForm" style="overflow: hidden;" :rules="eventRules">
          <!-- <div class="event-wrapper">
            <el-radio-group v-model="eventDealType" size="small" style="margin-bottom: 20px;">
              <el-radio label="2" border>管控中事件</el-radio>
              <el-radio label="1" border>非管控中事件</el-radio>
              <el-radio label="3" border>未发生事件</el-radio>
            </el-radio-group>
          </div> -->
          <div class="event-wrapper">
            <el-form-item label="现场联系人:" class="flex-item" style="margin-right: 80px;flex: 1;" prop="e_name">
              <el-input placeholder="请输入现场联系人姓名" v-model="eventForm.e_name"></el-input>
            </el-form-item>
          </div>
          <div class="event-wrapper">
            <el-form-item label="联系电话:" class="flex-item" style="margin-right: 80px;flex: 1;" prop="e_phone">
              <el-input placeholder="请输入现场联系人联系电话" v-model="eventForm.e_phone"></el-input>
            </el-form-item>
          </div>
          <div class="event-wrapper">
            <el-form-item label="事件说明:" class="flex-item" style="margin-right: 80px;flex: 1;" prop="e_text">
              <el-input
                type="textarea"
                :rows="2"
                :placeholder="tips"
                :autosize="{ minRows: 2, maxRows: 6 }"
                v-model="eventForm.e_text">
              </el-input>
            </el-form-item>
          </div>
          <!-- <div class="event-wrapper">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件</div>
            </el-upload>
          </div> -->
          <el-button style="float: right;margin-right: 90px;margin-left: 10px;" @click="handleCancel">取消</el-button>
          <el-button type="primary" style="float: right;" @click="handleFinishDeal">确认</el-button>
        </el-form>
      </div>
      
    </el-dialog>
    <el-dialog
      title="数据导入"
      :visible.sync="dialogVisible"
      width="30%">
      <input type="file" @change="updateFile" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertEvent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryAlarm, dealAlarm, getAlarmJudge, updateAlarmJudge, insertEvent } from '@/api/alarm/alarm.js'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'

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
      pageFlag: 1,
      pageType: {
        list: 1,
        set: 2
      },
      tableKey: 0,
      list: [],
      total: 0,
      pageSizes : [10,20,30,50],
      listLoading: true,
      postRules: {
        name: [{ required: true, message: '请输入名称代号', trigger: 'blur' }],
        area_id: [{ required: true, message: '请选择设备', trigger: 'change' }],
        gt_id: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        length: [{ required: true, message: '请输入设备长度', trigger: 'blur' }],
        longitude: [{ required: true, message: '请输入设备经度', trigger: 'blur' }],
        latitude: [{ required: true, message: '请输入设备纬度', trigger: 'blur' }],
      },
      eventRules: {
        e_name: [{ required: true, message: '请输入现场联系人姓名', trigger: 'blur' }],
        e_phone: [{ required: true, message: '请输入现场联系人联系方式', trigger: 'blur' }],
        e_text: [{ required: true, message: '请输入事件说明', trigger: 'blur' }]
      },
      queryForm: {
        page: 1,
        limit: 10,
        keyword: '',
        dateTime: ''
      },
      judgeForm: {
        range1: '',
        range2: '',
        times1: '',
        times2: '',
        length1: ''
      },
      postForm: {
        gt_id: '',
        area_id: '',
        name: '',
        length: '',
        longitude: '',
        latitude: ''
      },
      eventForm: {
        e_name: '',
        e_phone: '',
        e_text: ''
      },
      confirmForm: {
        line: '',
        time: '',
        person: '',
        position: ''
      },
      showFlag: 0,
      dialogType: {
        confirm: 0,
        deal: 1
      },
      fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      currentRow: {},
      eventConfirm: {},
      dialogTableVisible: false,
      eventDealType: '2',
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
      dialogVisible: false,
      fileparam: {}
    }
  },
  created() {
    this.getList()
    this.getAlarmJudge()
  },

  computed: {
    title() {
      let str = this.showFlag === this.dialogType.confirm ? '事件确认' : '事件处理'
      return str
    },
    tips() {
      let str = this.eventDealType === '2' ? '请输入联系人、联系方式及事件说明' : '请输入事件说明'
      return str
    }
  },

  methods: {
    // 获取设备列表数据
    getList(noloading) {
      this.listLoading = noloading === false ? false : true
      let params = {}
      params.page = this.queryForm.page
      params.limit = this.queryForm.limit
      if(this.queryForm.keyword && this.queryForm.keyword.length > 0){
        //params.channel = this.queryForm.keyword
        params.area_id = this.queryForm.keyword
        
      }
      if(this.queryForm.dateTime){
        params.begin_time = (this.queryForm.dateTime[0].getTime()+"").substr(0,10)
        params.end_time = (this.queryForm.dateTime[1].getTime()+"").substr(0,10)
      }
      queryAlarm(params).then(res => {
        if (res.retcode === 200) {
          /* if (!res.result || res.result.length == 0) {
            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1 * 1000)
            return
          } */
          this.list = this.dataDeal(res.result) || []
          this.total = res.total
          /* if (this.list && this.list.length > 0) {
            this.total = 176
          } */ 
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 1000)
        } else {
          this.$message({ type: 'warning', message: '获取数据失败' })
        }
      }).catch(err => {
        console.log(err)
      })
    },

    dataDeal(list) {
      list.forEach(item => {
        if (item.confirm == 0) {
          item.status = 0 // 事件未确认
          item.dealName = '未确认'
        } else if (item.result == 0) {
          item.status = 1 // 事件确认未处理
          item.dealName = '未处理'
        } else if (item.confirm == 1) {
          if (item.control == 1) {
            item.status = 2 // 事件确认且处理 事件处理结果：未受控
            item.dealName = '未受控'
          } else if (item.control == 2) {
            item.status = 3 //事件确认且处理 事件处理结果：已受控
            item.dealName = '已受控'
          } else if (item.control == 3) {
            item.status = 4 //事件确认且处理 事件处理结果：未发现
            item.dealName = '未发现'
          }
        } else {
          item.status = 9 // 事件状态异常
          item.dealName = '状态异常'
        }
      })
      return list
    },

    handleFilter() {
      this.getList()
    },

    handleExport() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', '设备编号', '设备类型', '发生时间', '发生位置', '事件状态', '非受控描述', '确认人姓名', '联系方式', '经度', '纬度']
        const filterVal = ['id', 'device_id', 'device_type', 'begin_time', 'position', 'status', 'text', 'name', 'phone', 'longitude', 'latitude']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '告警事件-' + (new Date()).getFullYear() + '-' + (Number((new Date()).getMonth()) + 1) + '-' + (new Date()).getDate(),
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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

    insertEvent() {
      insertEvent(this.fileparam).then(res => {
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

    handleSubmit() {
      let params = {}
      params.gt_time = this.judgeForm.range1 || 0
      params.gt_length = this.judgeForm.length1 || 0
      params.gt_frequency = this.judgeForm.times1 || 0
      params.smt_time = this.judgeForm.range2 || 0
      params.smt_frequency = this.judgeForm.times2 || 0
      updateAlarmJudge(params).then(res => {
        if (res.retcode == 200) {
          this.$message({ type: 'success', message: '配置成功！' })
          this.getAlarmJudge()
        }
      })
    },

    handleDeal(row) {
      this.currentRow = row
      this.dialogTableVisible = true
      if (row.status === 9) {
        this.$message({ type: 'warning', message: '事件状态异常！' })
        return
      }
      if (row.status == 0) {
        this.showFlag = this.dialogType.confirm
      } else {
        this.showFlag = this.dialogType.deal
      }
      this.confirmForm.line = this.currentRow.line_name
      this.confirmForm.time = row.begin_time.split('T')[0]
      this.confirmForm.person = this.currentRow.name
      this.confirmForm.position = this.currentRow.position
      console.log('confirmForm', this.confirmForm)
    },

    handleDelete() {
      this.$confirm('事件删除后将不可恢复，确认删除该事件？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({ type: 'success', message: '删除成功！' })
      })
    },

    handleConfirm() {
      this.showFlag = this.dialogType.deal
      let params = {}
      params.id = this.currentRow.id
      params.confirm = 1
      dealAlarm(params).then(res => {
        if (res.retcode === 200) {
          this.$message({ type: 'success', message: '事件已确认！' })
        } else {
          this.$message({ type: 'warning', message: '事件确认失败！' })
        }
      })
    },

    handleFinishDeal() {
      let validTemp
      this.$refs['eventForm'].validate((valid) => {
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
        let params = {}
        params.id = this.currentRow.id
        params.result = '2'
        params.control = this.eventDealType
        params.text = this.eventForm.e_text
        params.name = this.eventForm.e_name
        params.phone = this.eventForm.e_phone
        params.level = '1'
        params.img = '0'

        dealAlarm(params).then(res => {
          if (res.retcode === 200) {
            this.$message({ type: 'success', message: '事件已处理！' })
            this.handleCancel()
          } else {
            this.$message({ type: 'warning', message: '事件处理失败！' })
          }
        })
      }
    },

    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },

    getAlarmJudge () {
      getAlarmJudge().then(res => {
        if (res.retcode == 200 && res.result) {
          res.result.forEach(item => {
            if (item.device_type == 1) {
              this.judgeForm.range1 = item.time_limit
              this.judgeForm.times1 = item.frequency_limit
              this.judgeForm.length1 = item.length_limit
            } else if (item.device_type == 0) {
              this.judgeForm.range2 = item.time_limit
              this.judgeForm.times2 = item.frequency_limit
            } else {
              this.judgeForm.range1 = 0
              this.judgeForm.times1 = 0
              this.judgeForm.length1 = 0
              this.judgeForm.range2 = 0
              this.judgeForm.times2 = 0
            }
          })
        }
      })
    },

    handleSet() {
      this.pageFlag = this.pageType.set
    },

    handleReturn() {
      this.pageFlag = this.pageType.list
    },

    handleCancel() {
      this.dialogTableVisible = false
      this.getList(false)
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

  .event-wrapper {
    display: flex;
    padding: 0 30px;
    flex-wrap: wrap;

    .flex-item {
      flex: 0 0 300px;
    }
  }
</style>
