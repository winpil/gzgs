<template>
    <div class="app-container">
        <div :id="id" :class="className" :style="{height:height,width:width}" >

        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
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
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const xData = (function() {
        const data = []
        for (let i = 1; i < 13; i++) {
          data.push(i + 'month')
        }
        return data
      }())
      this.chart.setOption({
        legend: {
            data:['按条件展示实时振动波形图标']
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: false},
                dataView : {show: false, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: false},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        tooltip : {
            trigger: 'axis',
            formatter: "Temperature : <br/>{b}km : {c}°C"
        },
        xAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value} °C'
                }
            }
        ],
        yAxis : [
            {
                type : 'category',
                axisLine : {onZero: false},
                axisLabel : {
                    formatter: '{value} km'
                },
                boundaryGap : false,
                data : ['0', '10', '20', '30', '40', '50', '60', '70', '80']
            }
        ],
        series : [
            {
                name:'按条件展示实时振动波形图标',
                type:'line',
                smooth:true,
                itemStyle: {
                    normal: {
                        color : '#1890ff',
                        lineStyle: {
                            color : '#1890ff'
                        }
                    }
                },
                data:[15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
            }
        ]
        })
    }
  }
}
</script>
