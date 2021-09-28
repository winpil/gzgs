<template>
    <div class="app-container">
        <el-select v-model="queryForm.device_code" placeholder="请选择设备编号" @change="handleFilterYi">
            <el-option
            v-for="item in yiOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-select style="margin-left:30px" v-model="queryForm.channel_code" placeholder="请选择线路" @change="handleFilterEr">
            <el-option
            v-for="item in erOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-select  style="margin-left:30px" v-model="queryForm.node_id" placeholder="请选择线路节点" @change="handleFilterSan">
            <el-option
            v-for="item in sanOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-button class="filter-item" style="float: right;" type="primary" icon="el-icon-search" @click="handleFilterSan">
          {{ $t('table.search') }}
        </el-button> 
        <div></div>
        <div :id="id" :class="className" :style="{height:height,width:width}" >

        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import { queryDataTuBiao,queryDataTuBiaoOption } from '@/api/data/data.js'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'id'
    },
    width: {
      type: String,
      default: '1000px'
    },
    height: {
      type: String,
      default: '600px'
    }
  },
  data() {
    return {
      chart: null,
      allList:[],
      yiOption:[],
      erOption:[],
      sanOption:[],
      queryForm:{
        device_code:'',
        channel_code:'',
        node_id:'',
        ope:'check',
      }
    }
  },
  mounted() {
    queryDataTuBiaoOption({'ope':'data'}).then(res => {
      debugger
      if (res.retcode == 200) {
        this.allList=res.result
        for(var i=0;i<this.allList.length;i++){
          let temp=this.allList[i].device_code
          this.yiOption.push({value: temp,label: temp})
        }
      }
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    handleFilterYi(){
      for(var i=0;i<this.allList.length;i++){
          let temp=this.allList[i].device_code
          if(temp==this.queryForm.device_code){
            let channel_list=this.allList[i].channel_list
            for(var j=0;j<channel_list.length;j++){
              this.erOption.push({value: channel_list[j].channel_code,label: channel_list[j].channel_name})
            }
            break;
          }
        }
    },
    handleFilterSan(){
      queryDataTuBiao(this.queryForm).then(res => {
        // debugger
        if (res.retcode == 200) {
          var yData=res.result
          var yMax=0
          for(var i=0;i<yData.length;i++){
            if(yMax<yData[i]){
              yMax=yData[i]
            }
          }
          var xData=[]
          xData.push(0)
          for(var i=1;i<=yMax;i++){
            xData.push(i*10)
          }
          this.initChart(xData,yData)
        }
      })
    },
    handleFilterEr(){
      for(var i=0;i<this.allList.length;i++){
          let temp=this.allList[i].device_code
          if(temp==this.queryForm.device_code){
            let channel_list=this.allList[i].channel_list
            for(var j=0;j<channel_list.length;j++){
              if(channel_list[j].channel_code==this.queryForm.channel_code){
                let node_ids=channel_list[j].node_ids
                for(var k=0;k<node_ids.length;k++){
                  this.sanOption.push({value: node_ids[k],label: node_ids[k]})
                }
                break;
              }
            }
            break;
          }
        }
    },
    initChart(xData,yData) {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yData,
            type: 'line'
          }
        ]
      })
    }
  }
}
</script>
