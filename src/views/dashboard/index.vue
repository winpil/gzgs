<template>
  <div class="gs-home-wrapper" @click.capture="showWindow = false" ref="doc" >
    <img src="../../assets/img/background.png" class="bg-img" alt="">
    <div class="top-title">
      <img src="../../assets/img/topleft.png" class="top-left-wrapper" alt="">
      <div class="top-mid-wrapper">
        <img src="../../assets/img/topmid.png" class="f-width f-width">
        <span class="title-content f-width abs">预警平台网管系统</span>
      </div>
      <img src="../../assets/img/topright.png" class="top-right-img abs">
      <span style="position: absolute;z-index: 9;color: #23cefd;right: 3%;top: 10%;">{{time}}</span>
    </div>
    <svg-icon :icon-class="fullscreen?'exit-fullscreen':'fullscreen'" @click="handleFullScreen" style="position: absolute;right: 2vw;top: 5vh;color: #23cefd;;z-inde: 999;cursor: pointer;width: 20px;height: 20px;"/>
    <div class="bottom-content f-width abs">
      <div class="content-mid f-height abs" style="width: 76.5%;"> 
        <div class="f-width rel" style="height: 97.5%;margin-bottom: 1.5vh;">
          <!-- 线路信息窗口开始  -->
          <div class=“gs-info-window-line” 
          :style="{'position': 'absolute', 'background': 'rgba(8, 32, 51, 0.85)', 'z-index': '12', 'border-radius': '6px', 'color': 'rgb(35 206 253)', 'left': '10px', 'top': '10px','font-size': '14px'}"
          ref="infoWindow" 
          v-show="showWindow">
              <div class="line-info-title">
                <span class="title-detail">
                  <span v-if="infoType == 0">断纤信息</span>  
                  <span v-if="infoType == 1">线路名称：{{currentLineInfo.name}}</span>
                  <span v-if="infoType == 2">告警信息</span>  
                </span>
              </div>
              <div class="line-info-content" v-if="infoType == 0">
                <div class="content-detail"><span>断纤地址：</span> <span>{{currentErrorChannels.address}}</span></div>
                <div class="content-detail"><span>断纤详情：</span> <span>{{currentErrorChannels.fiberInfo}}</span> </div>
              </div>
              <div class="line-info-content" v-if="infoType == 1">
                <div class="content-detail"><span>线路ID：</span> <span>{{Number(currentLineInfo.channel_code)+1}}</span></div>
                <div class="content-detail"><span>负责人1：</span> <span>{{currentLineInfo.head1}}</span> </div>
                <div class="content-detail"><span>联系电话：</span> <span>{{currentLineInfo.phone1}}</span> </div>
                <div class="content-detail"><span>负责人2：</span> <span>{{currentLineInfo.head2}}</span> </div>
                <div class="content-detail"><span>联系电话：</span> <span>{{currentLineInfo.phone2}}</span> </div>
              </div>
              <div class="line-info-content" v-if="infoType == 2">
                <div class="content-detail"><span>位置：</span> <span>{{currentAlarm.address}}</span></div>
                <div class="content-detail"><span>距离：</span> <span>{{currentAlarm.position}}</span></div>
                <div class="content-detail"><span>振动开始时间：</span> <span>{{currentAlarm.beginTime}}</span></div>
                <div class="content-detail"><span>振动结束时间：</span> <span>{{currentAlarm.endTime}}</span></div>
                <div class="content-detail"><span>次数：</span> <span>{{currentAlarm.frequency}}</span> </div>
                <div class="content-detail"><span>类型：</span> <span>{{currentAlarm.alarmType}}</span> </div>
                <div class="content-detail"><span>等级：</span> <span>{{currentAlarm.level}}</span> </div>
                <div class="content-detail"><el-button style="float: right;margin-right: 10px;"  @click="addToWhiteList(currentAlarm.id)">加入白名单</el-button></div>
              </div>
          </div>
          <div v-show="showBlink">
              <img :src="blinkImg" :style="{'position': 'absolute', 'z-index': '12','right': '0px', 'top': '0px'}"/>
          </div>
          <!-- 线路信息窗口结束 -->
          <img src="../../assets/img/map.png" class="f-width f-height abs" style="left: 0; top: 0;z-index: 2;" alt="">
          <baidu-map :mapStyle="mapStyle" :mapClick="false" :scroll-wheel-zoom="true" :center="center" :zoom="zoom" @ready="handler" class="bm-view">
            <!-- 自定义点 -->
            <bm-marker :position="item" :dragging="false" v-for="(item) in linePoint" :key="'linePoint' + item.id" :icon="{url: item.icon, size: {width: 35, height: 35}}" @click="showLineInfo(item)"></bm-marker>
            <bm-marker :position="item" :dragging="false" v-for="(item) in alarmPoints" :key="'alarmPoint'+ item.id" :icon="{url: item.icon, size: {width: 35, height: 35}}" @click="showAlarmInfo(item)"></bm-marker>
            <bm-marker :position="item" :dragging="false" v-for="(item) in deviceErrorChannels" :key="item.deviceCode + item.id" :icon="{url: item.icon, size: {width: 35, height: 35}}" @click="showErrorChannelsInfo(item)">></bm-marker>
             <!-- <bm-marker :position="item" :dragging="false" v-for="(item, index) in linePoint" :key="index" :icon="{url: item.icon, size: {width: 35, height: 35}}" @click="handleShowDecInfo(item.id)"></bm-marker>-->
            <!-- <bm-marker :position="item" :dragging="true" v-for="(item, index) in polylinePath" :key="index" :icon="{url: 'https://s1.ax1x.com/2020/08/03/aUAul9.gif', size: {width: 35, height: 35}}"></bm-marker> -->
            <!-- 折线控件 -->
            <!--<div v-for="(line, index) in lines" :key=" 'line' + '-' + line.zone_id + '-' + index">-->
              <bm-polyline v-for="(item, index2) in lines2" :key="'lines'+ item.channel_code" :path="item.points" :stroke-color="item.lineColor"
                @mouseover="lineIn(item,index2)" 
                @mouseout="lineOut(item,index2)"
                :stroke-opacity="0.75" :stroke-weight="4" :editing="false" @click="showLineInfo(item)" >
              </bm-polyline>    
            <!--</div>-->
            <bm-polyline v-for="(field, index) in alarmlines" :key="'alarm' + index" :path="field.nodes" stroke-color="#ec2d2e"
              style="z-index: 100"
              :stroke-opacity="0.9" :stroke-weight="4" :editing="false" @click="test(field.zone)">
            </bm-polyline>    
          </baidu-map>
        </div>
      </div>
      <div class="content-right f-height abs" style="width: 25%;right: 0;padding: 0 20px;">
        <div class="f-width rel" style="height: 20%;margin-bottom: 1.5vh;position:relative;">
          <img src="../../assets/img/condition.png" class="f-width f-height" alt="">
          <div class="com-title-wrapper abs">
            <img src="../../assets/img/title.png" class="f-width f-height" alt="">
            <span class="com-title-content abs">实时数据</span>
          </div>
          <div class="f-width f-height abs" style="top: 35%;left: 3.5%;margin-top:5px;" >
            <div class="switch-all">
              <span style="color:#fff;font-size: 15px;">查看实时数据：</span>
              <span class="switch"  @click="openSwitch">
                <div class="switch-bg" :class="{on:realTime==1}">
                    <div class="switch-btn" :class="{on:realTime==1}"></div>
                </div>
              </span>
            </div>
          </div>
          <div class="f-width f-height abs" style="top: 35%;left: 3.5%;margin-top:30px;" >
            <el-button type="primary" @click="cleanAlarm" v-bind:disabled="!realTime">清空告警</el-button>
          </div>
        </div>
        <div class="f-width rel" style="height: 20%;margin-bottom: 1.5vh;position:relative;">
          <img src="../../assets/img/condition.png" class="f-width f-height" alt="">
          <div class="com-title-wrapper abs">
            <img src="../../assets/img/title.png" class="f-width f-height" alt="">
            <span class="com-title-content abs">线路时间选择</span>
          </div>
          <div class="f-width f-height abs" style="top: 35%;left: 3.5%;" >
            <el-select ref="selectLine" class="map-select" size="mini" v-model="mapForm.line" @change="changeLine" v-bind:disabled="realTime" :popper-append-to-body="false">
              <el-option v-for="item in lineList" :key="item.channel_code"  :value="item.channel_code" :label="item.field_name">
                {{item.field_name}}
              </el-option>
            </el-select>
          </div>
          <div class="f-width f-height abs" style="top: 65%;left: 3.5%;">
            <el-select ref="selectTime" class="map-select" size="mini" v-model="mapForm.time"  @change="changeTime" v-bind:disabled="realTime" :popper-append-to-body="false">
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
        <div class="f-width rel" style="height: 55.5%;">
          <img src="../../assets/img/event.png" class="f-width f-height" alt="">
          <div class="com-title-wrapper abs">
            <img src="../../assets/img/title.png" class="f-width f-height" alt="">
            <span class="com-title-content abs">告警统计</span>
          </div>
          <div class="f-width f-height abs" style="top: 15%;left: 3.5%;color:#fff;font-size: 15px;" >
            线路：<el-select ref="selectLine2" class="map-select" size="mini" v-model="mapForm.line2" @change="changeLine2" :popper-append-to-body="false">
              <el-option v-for="item in lineList2" :key="item.field_id"  :value="item.field_id" :label="item.field_name">
                {{item.field_name}}
              </el-option>
            </el-select>
          </div>
          <div class="abs f-width user_skills scrollbar" style="top: 20%;height: 100%;">
            <el-scrollbar style="height:100%">
            <el-table
              :data="alarmCountList"
              style="width: 94%;height:84%">
              <el-table-column
                prop="name"
                align="center"
                width="77"
                label="告警等级">
              </el-table-column>
              <el-table-column
                prop="alarm_times"
                label="报警次数"
                width="77"
                align="center">
              </el-table-column>
              <el-table-column
                prop="alarm_deal"
                label="已处理次数"
                align="center">
              </el-table-column>
            </el-table>
            </el-scrollbar>
          </div>
        </div>
        <Modal :show="showModal" :title="modalTitle" @hideModal="hideModal" @submit="submitModal">
          <el-form ref="whiteListForm" :model="whiteListForm">
            <el-form-item style="color:#FFF" label="到期日">
              <el-date-picker v-model="whiteListForm.endDate" type="datetime" placeholder="选择日期" />
            </el-form-item>
          </el-form>
        </Modal>
        <Modal :show="showDeviceMsg" :title="deviceMsgTitle" @hideModal="hideDeviceMsg" @submit="hideDeviceMsg">
          <p style="color:#fff">{{deviceErrorMsg}}</p>
        </Modal>
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
import { queryAlarm,queryRealTimeAlarm,alertWhite,clearAlarm,queryAlarmCount } from '@/api/alarm/alarm.js'
import { queryLineDetail } from '@/api/line/line.js'
import { deviceInfo } from '@/api/device/device.js'
import echarts from 'echarts'
import { queryAreaGps, queryDeviceGps, getAreaInfo, getMapCenter, getDeviceInfo, queryZoneInfo, getAlarmFields } from '@/api/dashboard/dashboard.js'
import Modal from './modal.vue'
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
      lines2: [],
      linePoint:[],
      alarmlines: [],
      lineColor: [],
      showWindow: false,
      mapForm: {
        area: '请选择区域',
        time: '一周内'
      },
      currentDev: {},
      currentZone: {},
      currentAlarm:{},
      currentErrorChannels:{},
      whiteListForm:{},
      infoType: '',
      areaList: [],
      lineList: [],
      lineList2: [],
      defaultAreaId : "0001",
      alarmPoints : [],
      currentLine : "全部",
      currentLineInfo:{},
      currentDate : 1,
      showBlink : true,
      currentStartDate : this.defaultStartDate(),
      currentEndDate : this.defaultEndDate(),
      endPointIcon : [],
      realTime : true,
      blinkImg : require("../../assets/img/greenLight.png"),
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
      modalTitle: '加入白名单',
      showModal: false,
      deviceName:"",
      deviceMsgTitle:"设备故障",
      showDeviceMsg: false,
      isDeviceError: false,
      deviceErrorMsg:"正常运行",
      deviceErrorChannels : [],
      alarmCountList: [],
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
  components: {
      Modal
    },
  created() {
    this.endPointIcon=[this.selfImgBaseUrl+"RREFwF.png",
                      this.selfImgBaseUrl+"RRECLT.png",
                      this.selfImgBaseUrl+"RREwm8.png",
                      this.selfImgBaseUrl+"RRE9yV.png",
                      this.selfImgBaseUrl+"RRAzzq.png",
                      this.selfImgBaseUrl+"RREieU.png"];
    //this.getInfo()
    this.getDeviceGps()
    this.getLineList();
    //this.getCenter() // 获取地图坐标中线点
    //this.getAreaInfo() // 区域统计信息
    this.getAreaList() // 获取地区列表
    // 获取事件列表数据
    if(this.realTime){
      this.getRealTableData();
    }else{
      this.getTableData();
    }
    this.getErrorChannels()
    this.queryLineDetail() // 获取所有责任区的告警事件
    this.time = (new Date()).toLocaleString()
  },
  mounted() {
    setInterval(() => {
      if(this.realTime){
        this.getRealTableData();
      }else{
        this.getTableData();
      }
    }, 1000*60)
    setInterval(() => {
      //this.getAlarmFields()
    }, 5000)
    setInterval(() => {
      this.gettTime()
    }, 1000)
    setInterval(() => {
      this.getDeviceInfo()//获取设备状态
      this.builBlink()//亮灯
    }, 1000)
    //设备故障时十分钟提醒一次
    setInterval(() => {
      if(this.isDeviceError){
        this.showDeviceMsg = true;
      }
    }, 1000*60*10)
    setInterval(() => {
      this.mapForm.line2Index += 1
      if(this.mapForm.line2Index >= this.lineList2.length){
        this.mapForm.line2Index = 0
      }
      this.mapForm.line2 = this.lineList2[this.mapForm.line2Index].field_id
      this.getAlarmCount();
    }, 1000*15)
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
              tempObj.channel_code = item.channel_code
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
    defaultEndDate() {
      var tmp = Date.parse(new Date()).toString();
      tmp = tmp.substr(0,10);
      return tmp;
    },
    defaultStartDate() {
      var tmp = Date.parse(new Date());
      tmp = tmp - 1000 * 60 * 60 * 24 * 7;
      tmp = tmp.toString().substr(0,10);
      return tmp;
    },
    defaultStartDate2() {
      var tmp = Date.parse(new Date());
      tmp = tmp - 1000 * 60 * 60 * 24 * 14;
      tmp = tmp.toString().substr(0,10);
      return tmp;
    },
    defaultStartDate3() {
      var tmp = Date.parse(new Date());
      tmp = tmp - 1000 * 60 * 60 * 24 * 30;
      tmp = tmp.toString().substr(0,10);
      return tmp;
    },
    getLineList() {
      let params = {}
      params.area_id = this.defaultAreaId;
      queryAreaGps(params).then(res => {
        if (res.retcode === 200 && res.result && res.result.length > 0) {
          //下拉框内容
          this.lineList = [];
          this.lineList2 = [];
          this.lineList.push({"channel_code":"全部","field_name":"全部"})
          res.result[0].fields.forEach(f => {
              this.lineList.push({"channel_code":f.channel_code,"field_name":f.field_name})
              this.lineList2.push({"field_id":f.field_id,"field_name":f.field_name})
          })
          this.mapForm.line = this.currentLine;
          this.mapForm.line2 = this.lineList2[0].field_id;
          this.mapForm.line2Index = 0;
          this.getAlarmCount();
        }
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
            if(item.area_id == this.defaultAreaId){
              this.center.lng = item.longitude
              this.center.lat = item.latitude
              let params = {}
              params.area_id = item.area_id;
              queryAreaGps(params).then(res => {
                if (res.retcode === 200 && res.result && res.result.length > 0) {
                  //线路图
                  this.lines2 = [];
                  this.linePoint = [];
                  res.result[0].fields.forEach((it,i) => {
                    this.buildMapLines(it,i);
                  })
                  return true;
                }
              })
            }
          })
        }
      })
    },
    buildMapLines(line,i) {
      if(this.currentLine == "全部" || this.realTime || line.channel_code == this.currentLine){
        let tempObj = {}
        tempObj.points = []
        line.nodes.forEach(node => {
          let nodeObj = {}
          nodeObj.lng = node.longitude
          nodeObj.lat = node.latitude
          nodeObj.order = node.order
          tempObj['points'].push(nodeObj)
        })
        tempObj.channel_code = line.channel_code
        tempObj.name = line.field_name
        tempObj.head1 = line.head1
        tempObj.phone1 = line.phone1
        tempObj.head2 = line.head2
        tempObj.phone2 = line.phone2
        tempObj.lineColor = NORMAL_COLOR
        this.lines2.push(tempObj)
        //获取起点和终点
        if(this.linePoint.length == 0){//起点只要一个
          let startPoint = {};
          startPoint.lng = line.nodes[0].longitude
          startPoint.lat = line.nodes[0].latitude
          startPoint.filedId = line.channel_code
          startPoint.type = "start"
          startPoint.id = line.channel_code + "start"
          startPoint.icon = this.selfImgBaseUrl+"RELhIs.png"
          this.linePoint.push(startPoint);
        }
        i = i % 6
        let endPoint = {};
        endPoint.lng = line.nodes[line.nodes.length-1].longitude
        endPoint.lat = line.nodes[line.nodes.length-1].latitude
        endPoint.filedId = line.channel_code
        endPoint.type = "end"
        endPoint.id = line.channel_code + "end"
        endPoint.name = line.field_name
        endPoint.head1 = line.head1
        endPoint.phone1 = line.phone1
        endPoint.head2 = line.head2
        endPoint.phone2 = line.phone2
        endPoint.channel_code = line.channel_code
        endPoint.icon = this.endPointIcon[i]
        this.linePoint.push(endPoint);
      }
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
        //this.initChart1()
        //this.initChart3()
      })
    },

    getTableData() {
      this.currentEndDate = this.defaultEndDate();
      if(this.currentDate == 1){
        this.currentStartDate = this.defaultStartDate();
      }else if(this.currentDate == 2){
        this.currentStartDate = this.defaultStartDate2();
      }else if(this.currentDate == 3){
        this.currentStartDate = this.defaultStartDate3();
      }
      let params = {}
      params.page = 1
      params.limit = 1000
      params.begin_time = this.currentStartDate;
      params.end_time = this.currentEndDate;
      params.area_id = this.defaultAreaId;
      queryAlarm(params).then(res => {
        if (res.retcode === 200 && res.result && res.result.length > 0) {
          this.tableData = [];
          this.alarmPoints = [];
          res.result.forEach(it => {
            if(it.channel == this.currentLine || this.currentLine == "全部"){
              this.tableData.push({"field_id":it.channel_code,"alarm_level":it.alarm_level})
              let alarmPoint = {};
              alarmPoint.lng = it.longitude
              alarmPoint.lat = it.latitude
              alarmPoint.id = it.id
              alarmPoint.type = "alarm"
              alarmPoint.level = it.alarm_level
              alarmPoint.beginTime = it.begin_time
              alarmPoint.endTime = it.end_time
              alarmPoint.position = it.position
              alarmPoint.alarmType = it.alarm_type
              alarmPoint.frequency = it.frequency
              alarmPoint.fieldId = it.channel_code
              alarmPoint.address = it.address
              if(it.alarm_level == "严重告警"){
                alarmPoint.icon = this.selfImgBaseUrl+"RFTa9g.png"
              }else if(it.alarm_level == "中级告警"){
                alarmPoint.icon = this.selfImgBaseUrl+"RFTwcj.png"
              }else{
                alarmPoint.icon = this.selfImgBaseUrl+"RFTd3Q.png";
              }
              this.alarmPoints.push(alarmPoint);
            }
          })
        }
      })
    },
    getRealTableData() {
      let params = {}
      queryRealTimeAlarm(params).then(res => {
        if (res.retcode === 200) {
          this.tableData = res.result
          this.alarmPoints = [];
          res.result.forEach(it => {
            let alarmPoint = {};
            alarmPoint.lng = it.longitude
            alarmPoint.lat = it.latitude
            alarmPoint.id = it.id
            alarmPoint.type = "alarm"
            alarmPoint.level = it.alarm_level
            alarmPoint.beginTime = it.begin_time
            alarmPoint.endTime = it.end_time
            alarmPoint.position = it.position
            alarmPoint.alarmType = it.alarm_type
            alarmPoint.frequency = it.frequency
            alarmPoint.fieldId = it.channel_code
            alarmPoint.address = it.address
            if(it.alarm_level == "严重告警"){
              if(it.is_now_shake){
                alarmPoint.icon = this.selfImgBaseUrl+"RELfaj.gif"
              }else{
                alarmPoint.icon = this.selfImgBaseUrl+"RFTa9g.png"
              }
            }else if(it.alarm_level == "中级告警"){
              if(it.is_now_shake){
                alarmPoint.icon = this.selfImgBaseUrl+"RELWZQ.gif"
              }else{
                alarmPoint.icon = this.selfImgBaseUrl+"RFTwcj.png"
              }
            }else{
              if(it.is_now_shake){
                alarmPoint.icon = this.selfImgBaseUrl+"REL2qg.gif";
              }else{
                alarmPoint.icon = this.selfImgBaseUrl+"RFTd3Q.png";
              }
            }
            this.alarmPoints.push(alarmPoint);
          })
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
          this.polylinePath = res.result
          this.polylinePath.forEach(item => {
            item.lng = item.longitude
            item.lat = item.latitude
            item.id = item.device_id
          })
        }
      })
    },
    getErrorChannels(){
      deviceInfo().then(res => {
        if (res.retcode === 200) {
          let rs = res.result[0]//只有一个设备
          this.deviceErrorChannels = [];
          rs.channels.forEach(it => {
            if(it.fiber_info != "正常" && (this.currentLine == "全部" || this.realTime || it.channel_code == this.currentLine)){
              this.deviceErrorChannels.push({"id":it.id,"lng":it.longitude,"lat":it.latitude,"fiberInfo":it.fiber_info,"address":it.address,"icon":this.selfImgBaseUrl+"RcXvcR.png","deviceCode":it.device_code});
            }
          })
        }
      })
    },
    getDeviceInfo() {
     deviceInfo().then(res => {
        if (res.retcode === 200) {
          this.deviceErrorMsg = "";
          let flag = true
          let rs = res.result[0]//只有一个设备
          this.deviceName = rs.device_name
          rs.channels.forEach(it => {
            if(it.fiber_info != "正常"){
              flag = false
              this.deviceErrorMsg += it.id+"号光纤"+it.fiber_info+"&"
            }
          })
          let deviceStatus = rs.device_run_status[0];
          if(flag && deviceStatus.is_online && deviceStatus.is_device_online && deviceStatus.device_status ){
            this.blinkImg = require("../../assets/img/greenLight.png")
            this.showDeviceMsg = false;
            this.isDeviceError = false;
          }else{
            this.blinkImg = require("../../assets/img/redLigth.png")
            if(!this.isDeviceError){
              this.showDeviceMsg = true;
            }
            this.isDeviceError = true;
            if(!deviceStatus.is_online){
              this.deviceErrorMsg += "数据处理程序故障&"
            }
            if(!deviceStatus.is_device_online){
              this.deviceErrorMsg += "断网&"
            }
            if(!deviceStatus.device_status){
              this.deviceErrorMsg += "设备故障"
            }
          }
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
    showAlarmInfo(it) {
      this.currentAlarm = it
      this.infoType = 2
      this.showWindow = true
      this.$forceUpdate()
    },
    showErrorChannelsInfo(it) {
      this.currentErrorChannels = it
      this.infoType = 0
      this.showWindow = true
      this.$forceUpdate()
    },
    addToWhiteList(id) {
      this.showModal = true
      this.whiteListForm.id = id
      this.whiteListForm.endDate = new Date()
    },
    changeLine(val){
      console.log(val);
      this.currentLine = val;
      let params = {}
      params.area_id = this.defaultAreaId;
      queryAreaGps(params).then(res => {
        if (res.retcode === 200) {
          this.lines2 = [];
          this.linePoint = [];
          res.result[0].fields.forEach((it,i) => {
            this.buildMapLines(it,i);
          })
        }
      })
      this.getTableData();
      this.getErrorChannels();
    },
    changeLine2(val){
      this.lineList2.forEach((it,i) => {
        if(it.field_id == val){
          this.mapForm.line2Index = i
        }
        this.getAlarmCount()
      })
    },
    changeTime(val){
      console.log(val);
      this.currentDate = val;
      this.getTableData();
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
      window.map = map;
      map.ControlAnchor = 'BMAP_ANCHOR_TOP_LEFT'
      map.enableAutoResize()
    },
    lineIn(it,i) {
      //let tempArr = str.split('--')
      //this.lines[tempArr[0]].fields[tempArr[1]].lineColor = '#e6a700'
      this.lines2[i].lineColor = '#e6a700'
    },
    lineOut(it,i) {
      //let tempArr = str.split('--')
      //this.lines[tempArr[0]].fields[tempArr[1]].lineColor = '#23cefd'
      this.lines2[i].lineColor = '#23cefd'
    },
    showLineInfo(it) {
      if(it.type != "start"){
        this.currentLineInfo = it
        this.infoType = 1
        this.showWindow = true
        this.$forceUpdate()
      }
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
      if(this.realTime){
        this.getAreaList() // 获取地区列表
        this.getRealTableData();
      }else{
        this.getAreaList() // 获取地区列表
        this.getTableData() // 获取事件列表数据
      } 
    },
    hideModal(){
      // 取消弹窗回调
      this.showModal = false
    },
    submitModal(){
      let params = {}
      params.alarm_id = this.whiteListForm.id
      console.log(this.whiteListForm.endDate);
      if(this.whiteListForm.endDate){
        params.end_time = (this.whiteListForm.endDate.getTime()+"").substr(0,10)
        alertWhite(params).then(res => {
          if (res.retcode === 200) {
            this.$message({ type: 'success', message: '加入白名单成功！' })
            if(this.realTime){
              this.getRealTableData();
            }else{
              this.getTableData();
            }
          }
        })
        this.showModal = false
      }else{
          this.$message({ type: 'warning', message: '请输入到期日！' })
      }
    },
    hideDeviceMsg (){
      // 取消弹窗回调
      this.showDeviceMsg = false
    },
    builBlink() {
      this.showBlink = !this.showBlink
    },
    cleanAlarm() {
      let params = {}
      let alarmIds = []
      this.alarmPoints.forEach(it => {
        alarmIds.push(it.id)
      }) 
      params.alarm_ids = alarmIds
      clearAlarm(params).then(res => {
        if (res.retcode === 200) {
          this.$message({ type: 'success', message: '清空告警成功！' })
          if(this.realTime){
            this.getRealTableData();
          }else{
            this.getTableData();
          }
        }
      })
    },
    getAlarmCount(){
      let params = {}
      params.field_id = this.mapForm.line2
      queryAlarmCount(params).then(res => {
        if (res.retcode === 200) {
          this.alarmCountList = res.result
        }
      })
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
  right: 40px;
  top: 10px;
  z-index:100; 
}
.switch{
    width: 2.25rem;
    height: 1.17rem;
    border-radius: 50px;
    border: 1px solid #0671a8;
    position: absolute;
}
.switch-btn{
    width: 1.17rem;
    height: 1.17rem;
    border-radius: 50%;
    border: 1px solid #021019;
    position: absolute;
    background-color: #1890ff;
    top: -1px;
    left: -1px;
    transition:left .5s;
    -moz-transition:left .5s; /* Firefox 4 */
    -webkit-transition:left .5s; /* Safari and Chrome */
    -o-transition:left .5s; /* Opera */
}
.switch-bg{
    background-color: #104c74;
    width: 1.12rem;
    height: 1.17rem;
    border-radius: 50px;
    transition: width .5s;
    -moz-transition: width .5s; /* Firefox 4 */
    -webkit-transition:  width .5s; /* Safari and Chrome */
}
.switch-btn.on{
    left: 1.12rem;
}
.switch-bg.on{
    width: 2.25rem;
}
/*滚动条样式*/
.scrollbar {
  white-space: nowrap;
  el-scrollbar {
    display: flex;
    justify-content: space-around;
    padding: 0 10px;
  }
  .el-scrollbar__wrap {
    overflow: scroll;
    width: 110%;
    height: 100%;
  }

}
</style>
