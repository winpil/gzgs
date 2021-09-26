<template>
    <div class="app-container">
        <div :id="id" :class="className" :style="{height:height,width:width}" >

        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import { queryDataTuBiao } from '@/api/data/data.js'

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
      chart: null
    }
  },
  mounted() {
    queryDataTuBiao({'alert_id':'20201126144247720000'}).then(res => {
        debugger
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
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
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
