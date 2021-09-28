<template>
  <div class="app-container">
    <div>
      <div class="filter-container" style="margin-bottom: 10px;">
        <el-input v-model="queryForm.keyword" clearable placeholder="设备编号/区域/设备代号" style="width: 200px;margin-right: 10px;margin-bottom: 1px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        <el-button :loading="downloadLoading" class="filter-item" style="float: right;margin-right: 10px;" type="primary" icon="el-icon-download" @click="handleExport">
          导出
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
        <el-table-column label="ID" prop="id" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备编号" width="200px" align="center" prop="device_id">
        </el-table-column>
        <el-table-column label="设备类型" width="100px" align="center" prop="device_type">
        </el-table-column>
        <el-table-column label="发生时间" width="200px" align="center" prop="begin_time">
          <template slot-scope="{row}">
            <span>{{ row.begin_time.split('T')[0] + '  ' + row.begin_time.split('T')[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发生位置" width="300px" align="center" prop="position">
        </el-table-column>
        <el-table-column label="处理结果" width="200px" align="center" prop="result">
        </el-table-column>
        <el-table-column label="是否受控" width="200px" align="center" prop="control">
        </el-table-column>
        <el-table-column label="非受控描述" width="200px" align="center" prop="text">
          <template slot-scope="{row}">
            {{ row.text == 0 ? '无' : row.text }}
          </template>
        </el-table-column>
        <el-table-column label="是否确认" width="200px" align="center" prop="confirm">
        </el-table-column>
        <el-table-column label="确认人姓名" width="200px" align="center" prop="name">
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
        </el-table-column>
        <!-- <el-table-column fixed="right" :label="$t('table.actions')" align="center" width="120" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
              {{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="queryForm.page" :limit.sync="queryForm.limit" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { queryData } from '@/api/data/data.js'
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      queryForm: {
        page: 1,
        limit: 10,
        keyword: '',
        dateTime: ''
      },
      downloadLoading: false,
      currentRow: {},
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
    }
  },
  created() {
    this.getList()
  },

  methods: {
    // 获取设备列表数据
    getList() {
      this.listLoading = true
      let params = {}
      params.page = this.queryForm.page
      params.limit = this.queryForm.limit
      queryData(params).then(res => {
        if (res.retcode === 200) {
          this.list = res.result
          if (this.list && this.list.length > 0) {
            this.total = this.list.length
          }
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1 * 1000)
        }
      })
    },

    handleFilter() {
      this.getList()
    },

    handleExport() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', '设备编号', '设备类型', '发生时间', '发生位置', '处理结果', '是否受控', '非受控描述', '是否确认', '确认人姓名', '联系方式', '经度', '纬度']
        const filterVal = ['id', 'device_id', 'device_type', 'begin_time', 'position', 'result', 'control', 'text', 'confirm', 'name', 'phone', 'longitude', 'latitude']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '振动数据-' + (new Date()).getFullYear() + '-' + (Number((new Date()).getMonth()) + 1) + '-' + (new Date()).getDate(),
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
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

    handleDelete() {
      this.$confirm('数据删除后将不可恢复，确认删除该事件？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({ type: 'success', message: '删除成功！' })
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

  .event-wrapper {
    display: flex;
    padding: 0 30px;
    flex-wrap: wrap;

    .flex-item {
      flex: 0 0 300px;
    }
  }
</style>
