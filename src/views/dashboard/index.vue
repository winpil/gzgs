<template>
  <div class="gs-home-wrapper" @click.capture="showWindow = false" ref="doc">
    <img src="../../assets/img/background.png" class="bg-img" alt="">
    <div class="top-title">
      <img src="../../assets/img/topleft.png" class="top-left-wrapper" alt="">
      <div class="top-mid-wrapper">
        <img src="../../assets/img/topmid.png" class="f-width f-width">
        <span class="title-content f-width abs">振动预警防护全覆盖平台</span>
      </div>
      <img src="../../assets/img/topright.png" class="top-right-img abs">
      <span style="position: absolute;z-index: 9;color: #23cefd;right: 3%;top: 10%;">{{time}}</span>
    </div>
    <svg-icon :icon-class="fullscreen?'exit-fullscreen':'fullscreen'" @click="handleFullScreen" style="position: absolute;right: 2vw;top: 5vh;color: #23cefd;;z-inde: 999;cursor: pointer;width: 20px;height: 20px;"/>
    <div class="bottom-content f-width abs">
      <div class="content-mid f-height abs" style="width: 76.5%;"> 
        <div class="f-width rel" style="height: 97.5%;margin-bottom: 1.5vh;">
          <!-- 线路信息窗口开始 -->
          <div class=“gs-info-window-line” 
          :style="{'position': 'absolute', 'width': '250px', 'height': '145px', 'background': 'rgba(8, 32, 51, 0.85)', 'z-index': '12', 'border-radius': '6px', 'color': 'rgb(35 206 253)', 'left': '10px', 'top': '10px','font-size': '14px'}"
          ref="infoWindow" 
          v-show="showWindow">
              <div class="line-info-title">
                <span class="title-detail">
                  <span v-if="infoType == 0">线路名称：{{currentZone.name}}</span>  
                  <span v-if="infoType == 1">设备名称：{{currentDev.name}}</span>  
                </span>
              </div>
              <div class="line-info-content" v-if="infoType == 0">
                <div class="content-detail"><span>防区数：</span> <span>{{currentZone.fields_num}}</span></div>
                <div class="content-detail"><span>告警事件数：</span> <span>{{currentZone.alarm_num}}</span> </div>
                <div class="content-detail"><span>负责人一：</span> <span>{{currentZone.person1}}</span> </div>
                <div class="content-detail"><span>负责人二：</span> <span>{{currentZone.person2}}</span> </div>
              </div>
              <div class="line-info-content" v-if="infoType == 1">
                <div class="content-detail"><span>设备号：</span> <span>{{currentDev.device_id}}</span></div>
                <div class="content-detail"><span>告警事件数：</span> <span>{{currentDev.alarm_num}}</span> </div>
                <!-- <div class="content-detail"><span>发生时间：</span> <span>{{currentDev.time}}</span> </div> -->
                <!-- <div class="content-detail"><span>负责人二：</span> <span>李四</span> </div> -->
              </div>
          </div>
          <!-- 线路信息窗口结束 -->
          <img src="../../assets/img/map.png" class="f-width f-height abs" style="left: 0; top: 0;z-index: 2;" alt="">
          <baidu-map :mapStyle="mapStyle" :mapClick="false" :scroll-wheel-zoom="true" :center="center" :zoom="zoom" @ready="handler" class="bm-view">
            <!-- 自定义点 -->
            <bm-marker :position="item" :dragging="false" v-for="(item, index) in polylinePath" :key="index" :icon="{url: index % 2 === 0 ? 'https://s1.ax1x.com/2020/08/03/aUiTte.gif' : 'https://s1.ax1x.com/2020/08/03/aUAul9.gif', size: {width: 35, height: 35}}" @click="handleShowDecInfo(item.id)"></bm-marker>
            <!-- <bm-marker :position="item" :dragging="true" v-for="(item, index) in polylinePath" :key="index" :icon="{url: 'https://s1.ax1x.com/2020/08/03/aUAul9.gif', size: {width: 35, height: 35}}"></bm-marker> -->
            <!-- 折线控件 -->
            <div v-for="(line, index) in lines" :key=" 'line' + '-' + line.zone_id + '-' + index">
              <bm-polyline v-for="(item, index2) in line.fields" :key="line.zone_id + '--' + index2" :path="item.points" :stroke-color="item.lineColor"
                @mouseover="lineIn(index + '--' + index2)"
                @mouseout="lineOut(index + '--' + index2)"
                :stroke-opacity="0.75" :stroke-weight="4" :editing="false" @click="test(line.zone_id)">
              </bm-polyline>    
            </div>
            <bm-polyline v-for="(field, index) in alarmlines" :key="'alarm' + index" :path="field.nodes" stroke-color="#ec2d2e"
              style="z-index: 100"
              :stroke-opacity="0.9" :stroke-weight="4" :editing="false" @click="test(field.zone)">
            </bm-polyline>    
          </baidu-map>
        </div>
      </div>
      <div class="content-right f-height abs" style="width: 25%;right: 0;padding: 0 20px;">
        <div class="f-width rel" style="height: 17%;margin-bottom: 1.5vh;position:relative;">
          <img src="../../assets/img/condition.png" class="f-width f-height" alt="">
          <div class="switch-all">
            <span style="color:#fff;font-size: 5px;">查看实时数据：</span>
            <span class="switch">
                <div class="switch-bg" :class="{on:realTime==1}">
                    <div class="switch-btn" :class="{on:realTime==1}" @click="openSwitch" ></div>
                </div>
            </span>
          </div>
          <div class="com-title-wrapper abs">
            <img src="../../assets/img/title.png" class="f-width f-height" alt="">
            <span class="com-title-content abs">线路时间选择</span>
          </div>
          <div class="f-width f-height abs" style="top: 35%;left: 3.5%;">
            <el-select class="map-select" size="mini" v-model="mapForm.line">
              <el-option v-for="item in lineList" :key="item.field_id"  :value="item.field_id" :label="item.field_id">
                {{item.field_id}}
              </el-option>
            </el-select>
          </div>
          <div class="f-width f-height abs" style="top: 65%;left: 3.5%;">
            <el-select class="map-select" size="mini" v-model="mapForm.time">
              <el-option value="1" label="一周内">
                一周内
              </el-option>
              <el-option value="2" label="两周内">
                两周内
              </el-option>
              <el-option value="3" label="一月内">
                一月内
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="f-width rel" style="height: 80.5%;">
          <img src="../../assets/img/event.png" class="f-width f-height" alt="">
          <div class="com-title-wrapper abs">
            <img src="../../assets/img/title.png" class="f-width f-height" alt="">
            <span class="com-title-content abs">近期事件列表</span>
          </div>
          <div class="abs f-width user_skills" style="top: 8%;height: 100%;">
            <el-table
              :data="tableData"
              style="width: 94%;height:84%">
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                prop="begin_time"
                align="center"
                min-width="100"
                label="发生时间">
              </el-table-column>
              <el-table-column
                prop="position"
                label="发生位置"
                align="left">
              </el-table-column>
            </el-table>
          </div>
        </div>
        
      </div>
    </div>    

    

    <!-- 地区信息窗口开始 -->
    <div draggable="true" style="display: none;">
      <div class="gs-info-window-area">
        <div class="area-wrapper" @click="handleShowAreaInfo">
          <span>地图统计信息</span> 
          <div class="" style="position: absolute;right: 15px;top: 0px;">
            <i v-if="showArea == true" class="el-icon-arrow-up" />
            <i v-else class="el-icon-arrow-down" />
          </div>
        </div>
      </div>
    </div>
    <!-- 地区信息窗口结束 -->
  </div>
</template>

<script>
import { queryArea } from '@/api/area/area.js'
import { queryAlarm } from '@/api/alarm/alarm.js'
import { queryLineDetail } from '@/api/line/line.js'
import echarts from 'echarts'
import { queryAreaGps, queryDeviceGps, getAreaInfo, getMapCenter, getDeviceInfo, queryZoneInfo, getAlarmFields } from '@/api/dashboard/dashboard.js'
const NORMAL_COLOR = '#23cefd'
const SPECIAL_COLOR = "black"
export default {
  name: 'Dashboard',
  data() {
    return {
      fullscreen: false,
      value1: '',
      time: '',
      showArea: true,
      center: {lng: 120.203365, lat: 30.211784},
      zoom: 8,
      polylinePath: [],
      lines: [],
      alarmlines: [],
      lineColor: [],
      showWindow: false,
      mapForm: {
        area: '请选择区域',
        time: '一周内'
      },
      currentDev: {},
      currentZone: {},
      infoType: '',
      areaList: [],
      lineList: [],
      realTime:0,
      mapStyle: {
        features: ["road", "building", "water", "land"], //隐藏地图上的"poi",
        style: "midnight"
        // var style_map=['normal','light','dark','redalert','googlelite','grassgreen','midnight','pink','darkgreen','bluish','grayscale','hardedge'];
        //分别风格是：默认地图样式，清新蓝风格，黑夜风格，红色警戒风格，精简风格，自然绿风格，午夜蓝风格，浪漫粉风格，青春绿风格，清新蓝绿风格，高端灰风格，强边界风格
      },
      chart1: '',
      chart2: '',
      chart3: '',
      chart1Data: [],
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '2020/7/24'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '2020/7/24'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '2020/7/24'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '2020/7/24'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '2020/7/24'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '2020/7/24'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '2020/7/24'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '2020/7/24'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '2020/7/24'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '2020/7/24'
          }]
    
    
    }
  },
  created() {
    this.getInfo()
    this.getDeviceGps()
    //this.getCenter() // 获取地图坐标中线点
    //this.getAreaInfo() // 区域统计信息
    this.getAreaList() // 获取地区列表
    this.getTableData() // 获取事件列表数据
    this.queryLineDetail() // 获取所有责任区的告警事件
    this.time = (new Date()).toLocaleString()
  },
  mounted() {
    setInterval(() => {
      this.getAlarmFields()
    }, 5000)
    setInterval(() => {
      this.gettTime()
    }, 1000)
  },
  computed: {
    alarmCount() {
      let count = 0
      this.chart1Data.forEach((item, index) => {
        if (index > 0) {
          count += Number(item[0])
        }
      })
      return count
    }
  },
  methods: {
    initChart1() {
      this.chart1 = echarts.init(this.$refs.chart1)
      this.chart1.setOption({
          title: {
            show: "true",
            text: "各责任区事件统计",
            textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
              // fontFamily: 'Arial, Verdana, sans...',
              fontSize: 16,
              // fontStyle: 'normal',
              // fontWeight: 'normal',
              color: "#d6d2d2"
            },
            top: "0px",
            left: "8%"
          },
          dataset: {
              source: this.chart1Data
          },
          grid: {
            top: "15%",
            left: "40px",
            bottom: "17.5%"
          },
          xAxis: {
              type: 'value',
              // name: '事件数',
              color: "#d6d2d2",
              splitLine: {show: false},
              // data: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
              axisLabel: {
                  show: true,
                  textStyle: {
                      color: '#d6d2d2'
                  }
              },
              axisLine: {
                  lineStyle: {
                      color: '#fff', // 颜色
                  }
              }
          },
          yAxis: {
              type: 'category',
              // name: '责任区名',
              splitLine: {show: false},
              // data: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
              axisLabel: {
                  show: true,
                  textStyle: {
                      color: '#d6d2d2'
                  },
                  width: '50px'
              },
              axisLine: {
                  show: false,
                  lineStyle: {
                      color: '#fff', // 颜色
                  }
              },
              nameTextStyle: {
                width: "50px"
              }
          },
          color: "#23cefd",
          // grid: {containLabel: true},
          series: [
              {
                  type: 'bar',
                  encode: {
                      // Map the "amount" column to X axis.
                      x: 'amount',
                      // Map the "product" column to Y axis
                      y: 'product'
                  },
                  barWidth: 20
              }
          ]
        }
      )
      window.addEventListener("resize",()=>{
        this.chart1.resize();
      })
    },

    // 获取GPS数据
    getInfo() {
      this.listLoading = true
      queryAreaGps(this.queryForm).then(res => {
        if (res.retcode === 200 && res.result && res.result.length > 0) {
          let originArr = res.result // 所有责任区（含id）
          let afterArr = [] // 数据处理重组，最内层添加线条颜色字段
          originArr.forEach(line => {
            let originLine = {}
            originLine.zone_id = line.zone_id
            originLine.fields = []
            line.fields.forEach(item => {
              let tempObj = {}
              tempObj.points = []
              item.nodes.forEach(node => {
                let nodeObj = {}
                nodeObj.lng = node.longitude
                nodeObj.lat = node.latitude
                nodeObj.order = node.order
                tempObj['points'].push(nodeObj)
              })
              tempObj.field_id = item.field_id
              tempObj.lineColor = NORMAL_COLOR
              originLine.fields.push(tempObj)
            })
            afterArr.push(originLine)
          })
          this.lines = afterArr
          this.getAlarmFields()
          console.log("this.lines", this.lines)
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1 * 1000)
      })
    },

    // 获取地区数据
    getAreaList() {
      let params = {}
      params.page = 1
      params.limit = 1000
      queryArea(params).then(res => {
        if (res.retcode == 200) {
          /* this.areaList = res.result
          this.mapForm.area = this.areaList[0].area_id
          if (this.areaList && this.areaList.length > 0) {
            this.total = this.areaList.length
          } */
          res.result.some(item => {
            if(item.area_id == '0001'){
              this.center.lng = item.longitude
              this.center.lat = item.latitude
              let params = {}
              params.area_id = item.area_id;
              queryAreaGps(params).then(res => {
                if (res.retcode === 200 && res.result && res.result.length > 0) {
                  this.lineList = res.result[0].fields;
                  this.mapForm.line = this.lineList[0].field_id;
                  return true;
                }
              })
            }
          })
        }
      })
    },

    queryLineDetail() {
      let now = new Date()
      let nowStr = now.getFullYear() + '-' + (Number(now.getMonth()) + 1) + '-' + now.getDay() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
      let beforeStr = now.getFullYear() + '-' + (Number(now.getMonth()) + 1) + '-' + Number(now.getDay() - 7) + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
      queryLineDetail({ begin_time: '2020-8-1 00:00:00', end_time: '2020-8-10 00:00:00' }).then(res => {
        if (res.retcode == 200 && res.result && res.result.length > 0) {
          this.chart1Data.push(['amount', 'product'])
          res.result.forEach(item => {
            let temp = []
            temp.push(item.total_count)
            temp.push(item.name)
            this.chart1Data.push(temp)
            this.chargeCount += Number(item.total_deal)
            this.disCount += Number(item.total_miss)
          })
        } else {
          this.chart1Data = [
            ['amount', 'product'],
            [40, '示例一'],
            [20, '示例二'],
            [30, '示例三'],
            [16, '示例四']
          ]
        }
        this.initChart1()
        this.initChart3()
      })
    },

    getTableData() {
      let params = {}
      params.page = 1
      params.limit = 1000
      queryAlarm(params).then(res => {
        if (res.retcode === 200 && res.result && res.result.length > 0) {
          this.tableData = res.result
        }
      })
    },

    getCenter() {
      getMapCenter().then(res => {
        if (res.retcode === 200 && res.result && res.result.length > 0) {
          this.center = res.result
        }
      })
    },

    getDeviceGps() {
      queryDeviceGps().then(res => {
        if (res.retcode === 200 && res.result && res.result.length > 0) {
        console.log("-----------------console.log(res.result);---------------------");
        console.log(res.result);
          this.polylinePath = res.result
          this.polylinePath.forEach(item => {
            item.lng = item.longitude
            item.lat = item.latitude
            item.id = item.device_id
          })
        }
      })
    },
    getAlarmFields() {
      getAlarmFields().then(res => {
        if (res.retcode == 200 && res.result && res.result.length > 0) {
          let result = res.result
          let arr = []
          // Object.keys(result).forEach(k => {
          //   arr.push(result[k])
          // })
          result.forEach(zone => {
            let field = {}
            field.nodes = zone.node_list
            field.nodes.forEach(node => {
              node.lng = node.longitude
              node.lat = node.latitude
            })
            field.zone = zone.zone
            arr.push(field)
          })
          arr[0]['nodes'][1].lng = 120.243142000000
          arr[0]['nodes'][1].lat = 30.227980000000
          console.log('arr', arr)
          this.alarmlines = arr
        }
      })
    },
    getAreaInfo() {
      let params = {}
      params.starttime = '2020-07-21 15:01:23'
      params.endtime = '2020-07-28 15:01:23'
      getAreaInfo(params).then(res => {
        if (res.retcode === 200) {
          // [52, '责任区'],
          // [40, '设备数'],
          // [30, '防区型'],
          // [20, '定位型'],
          // [40, '责任人']
          let tempArr1 = []
          tempArr1.push(res.zone_num || 0)
          tempArr1.push('责任区')
          let tempArr2 = []
          tempArr2.push((res.gt_num + res.smt_num) || 0)
          tempArr2.push('设备数')
          let tempArr3 = []
          tempArr3.push(res.smt_num || 0)
          tempArr3.push('防区型')
          let tempArr4 = []
          tempArr4.push(res.gt_num || 0)
          tempArr4.push('定位型')
          let tempArr5 = []
          tempArr5.push((res.zone_num * 2) || 0)
          tempArr5.push('责任人')
          this.areaData = [ ['amount', 'product'], tempArr1, tempArr2, tempArr3, tempArr4, tempArr5 ]
          console.log('this.areaData', this.areaData)
          setTimeout(() => {
            this.initChart2()
          }, 500)
        }
      })
    },
    gettTime() {
      let time = new Date()
      let timestr = time.toLocaleString()
      this.time = timestr
    },

    handleShowDecInfo(id) {
      getDeviceInfo({ id: id }).then(res => {
        if (res.retcode === 200) {
          if (!res.result) {
            this.$message({ type: 'warning', message: '设备数据异常！' })
          } else {
            this.currentDev = res.result
            this.infoType = 1
            this.showWindow = true
            this.$forceUpdate()
          }
        }
      })
    },

    test(id) {
      // this.info.height = event.screenY
      // this.info.width = event.screenX
      let params = {}
      params.id = id
      params.starttime = '2020-08-01 00:00:00'
      params.endtime = '2020-08-10 00:00:00'
      queryZoneInfo(params).then(res => {
        if (res.retcode === 200) {
          if (!res.result) {
            this.$message({ type: 'warning', message: '线路数据异常！' })
          } else {
            this.currentZone = res.result
            this.infoType = 0
            this.showWindow = true
            this.$forceUpdate()
          }
        }
      })
      // this.$refs['infoWindow'].style.left = event.pixel.x + 15 + 'px'
      // this.$refs['infoWindow'].style.top = event.pixel.y - 205 + 'px'
    },
    handler ({BMap, map}) {
      console.log('首页地图信息：', BMap, map)
      this.center.lng = this.center.longitude
      this.center.lat = this.center.latitude
      this.zoom = 14
      map.ControlAnchor = 'BMAP_ANCHOR_TOP_LEFT'
      map.enableAutoResize()
    },
    lineIn(str) {
      let tempArr = str.split('--')
      this.lines[tempArr[0]].fields[tempArr[1]].lineColor = '#e6a700'
    },
    lineOut(str) {
      let tempArr = str.split('--')
      this.lines[tempArr[0]].fields[tempArr[1]].lineColor = '#23cefd'
    },
    handleShowAreaInfo() {
      this.showArea = !this.showArea
    },

    handleFullScreen(){
      let element = this.$refs.doc
      if (this.fullscreen) {
          if (document.exitFullscreen) {
              document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
          }
      } else {
          if (element.requestFullscreen) {
              element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
              element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
              // IE11
              element.msRequestFullscreen();
          }
      }
      this.fullscreen = !this.fullscreen;
    },

    initChart2() {
      this.chart2 = echarts.init(this.$refs.chart2)
      this.chart2.setOption({
          dataset: {
              source: this.areaData
          },
          grid: {
            top: "50px",
            left: "50px",
            bottom: "10%"
          },
          xAxis: {
              type: 'value',
              // name: '事件数',
              color: "#d6d2d2",
              splitLine: {show: false},
              // data: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
              axisLabel: {
                  show: true,
                  textStyle: {
                      color: '#d6d2d2'
                  }
              },
              axisLine: {
                  lineStyle: {
                      color: '#fff', // 颜色
                  }
              }
          },
          yAxis: {
              type: 'category',
              // name: '责任区名',
              splitLine: {show: false},
              // data: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
              axisLabel: {
                  show: true,
                  textStyle: {
                      color: '#d6d2d2'
                  },
                  width: '50px'
              },
              axisLine: {
                  show: false,
                  lineStyle: {
                      color: '#fff', // 颜色
                  }
              },
              nameTextStyle: {
                width: "50px"
              }
          },
          color: "#23cefd",
          // grid: {containLabel: true},
          series: [
              {
                  type: 'bar',
                  encode: {
                      // Map the "amount" column to X axis.
                      x: 'amount',
                      // Map the "product" column to Y axis
                      y: 'product'
                  },
                  barWidth: 20
              }
          ]
        }
      )
      window.addEventListener("resize",()=>{
        this.chart2.resize();
      })
    },

    initChart3() {
      this.chart3 = echarts.init(this.$refs.chart3)
      this.chart3.setOption({
          color:["#23cefd", "#61a0a8"],
          series: [
              {
                  name: '事件类型',
                  type: 'pie',
                  radius: ['40%', '55%'],
                  center: ['50%', '60%'],
                  label: {
                      formatter: '{b|{b}}：\n{hr|}\n    {d|{d}}%   ',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderColor: '#aaa',
                      borderWidth: 1,
                      borderRadius: 4,
                      // padding: [2, 7],
                      rich: {
                          b: {
                              // color: '#999',
                              lineHeight: 20,
                              align: 'center',
                          },
                          d: {
                            // color: '#999',
                            lineHeight: 20,
                            align: 'center'
                          },
                          hr: {
                              borderColor: '#aaa',
                              width: '100%',
                              borderWidth: 0.5,
                              height: 0
                          },
                      }
                  },
                  data: [
                      {value: this.disCount || 10, name: '非管控中'},
                      {value: this.chargeCount  || 10, name: '管控中'}
                  ]
              }
          ]
        }
      )
      window.addEventListener("resize",()=>{
        this.chart3.resize();
      })
    },

    openSwitch(){
      this.realTime = !this.realTime;
      console.log(this.realTime)
    }
  }
}
</script>

<style scoped lang='less'>
  .f-width {
    width: 100%;
  }

  .f-height {
    height: 100%;
  }

  .abs {
    position: absolute;
  }

  .rel {
    position: relative;
  }


  .gs-home-wrapper {
    // background:url(../../assets/img/backimage.jpg) no-repeat;
    .bg-img {
      width: 100%;
      height: 100%;
      position: absolute;
    }

    .top-title {
      height: 10%;
      width: 100%;
      position: absolute;
      display: flex;

      .top-left-wrapper {
        width: 21%;
        height: 30%;
        position: absolute;
        left: 1.2vw;
        top: 5%;
      }

      .top-right-img {
        width: 21%;
        height: 30%;
        right: 1.2vw;
        top: 5%;
      }

      .top-mid-wrapper {
        width: 64%;
        height: 100%;
        position: absolute;
        left: 18%;

        .title-content {
          font-size: 1.5vw;
          color: #23cefd;
          text-align: center;
          left: 0;
          top: 15%;
        }
      }
    }

    .bottom-content {
      height: 90%;
      bottom: 0px;

      .content-left {
        width: 25%;
        padding: 0 20px;

        .content-left-top {
          height: 18%;
          margin-bottom: 1.5vh;
        }

        .content-left-mid {
          height: 49.2%;
          margin-bottom: 1.5vh;

          .event-num-wrapper {
            height: 15%;
            top: 17%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 20px;

            .event-num-words {
              color: #23cefd;
              font-size: 18px;
            }

            .event-num-content {
              width: 50%;
              height: 80%;
              border: 1.5px solid #23cefd;
              border-radius: 10px;
              margin: 0 10px;
              font-size: 2vw;
              color: #23cefd;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
  }

  .bm-view {
    padding: 10px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
  }

  .form-input {
      width: 334px;
      margin-right: 10px;
  }

  .gs-info-window-area {
    position: absolute;
    width: 430px;
    height: 40px;
    background: rgba(53, 199, 186, 0.85);
    z-index: 1;
    left: 10px;
    top: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    .area-wrapper {
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #dfe6ec;
      color: #f3f3f3;
      font-size: 17px;
      padding-left: 15px;
      line-height: 40px;
      position: relative;
    }
  }

  .line-info-title {
      height: 40px;
      border-bottom: 1px solid rgb(35 206 253);

      .title-detail {
        padding-left: 8px;
        line-height: 40px;
      }
    }

  .line-info-content {
      padding: 10px;

      .content-detail {
        margin-bottom: 5px;
      }
  }

  .com-title-wrapper {
    height: 30px;
    width: 65%;
    left: 10px;
    top: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;

    .com-title-content {
      text-align: center;
      width: 70%;
      left: 0;
      top: 5px;
      color: #23cefd;
    }
  }

  .map-select {
    width: 70%;background: #121c35
  }

  .chart1 {
    height:65%;
    width:90%;
    left: 20px;
    bottom: 0;
    z-index:2;
  }

  /deep/ .el-input__inner {
    background: rgba(0,0,0,0.2);
    border: 1px solid #0e7eb5;
    color: #23cefd;
  }

  /deep/ .el-input__inner:hover {
    border: 1px solid #0e7eb5 !important;
  }

  /deep/ .el-input__inner:focus {
    border: 1px solid #0e7eb5 !important;
  }

 .user_skills{
   margin: auto;
  }
  .user_skills /deep/ .el-table--fit{
      padding: 20px;
  }
  .user_skills /deep/  .el-table, .el-table__expanded-cell {
      background-color: transparent;
  }

  .user_skills /deep/ .el-table tr {
    color: #d6d2d2;
    background-color: transparent!important;
  }
  .user_skills /deep/ .el-table th {
    background-color: transparent!important;
    color: #d6d2d2;
    border-bottom: unset;
  }
  .user_skills /deep/ .el-table td {
    color: #d6d2d2;
    border-bottom: unset;
  }
  .user_skills /deep/  .el-table--enable-row-transition .el-table__body td, .el-table .cell{
    background-color: transparent;
  }
  .el-table::before {//去除底部白线
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0px;
  }

  @media screen and (max-width: 1320px) {
    .gs-info-window-area {
      top: 70px;
    }
}
.switch-all{
  position: absolute;
  right: 40px;
  top: 10px;
  z-index:100; 
}
.switch{
    width: 2rem;
    height: 1.1rem;
    border-radius: 50px;
    border: 1px solid #0671a8;
    position: absolute;
}
.switch-btn{
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    border: 1px solid #021019;
    position: absolute;
    background-color: #00aeff;
    top: -1px;
    left: -1px;
    transition:left .5s;
    -moz-transition:left .5s; /* Firefox 4 */
    -webkit-transition:left .5s; /* Safari and Chrome */
    -o-transition:left .5s; /* Opera */
}
.switch-bg{
    background-color: #104c74;
    width: 1rem;
    height: 1.1rem;
    border-radius: 50px;
    transition: width .5s;
    -moz-transition: width .5s; /* Firefox 4 */
    -webkit-transition:  width .5s; /* Safari and Chrome */
}
.switch-btn.on{
    left: 1rem;
}
.switch-bg.on{
    width: 2rem;
}
</style>
