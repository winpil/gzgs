<template>
    <div class="app-container">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-button type="primary"  @click="startZiJian" icon="el-icon-refresh">开始自检</el-button>
        </div>
        <div v-show="isShow">
            <el-progress :percentage="percentageVal" :format="format"></el-progress>
        </div>
        <div v-show="is_show_info" style="margin-top:30px">
          <el-form ref="checkInfo" :model="checkInfo" label-width="150px">         
            <el-form-item label="自检时间"  :style="itemStyle">
                <el-input :disabled="readOnly" v-model="checkInfo.check_time"></el-input>
            </el-form-item>
            <el-form-item label="CPU使用率"  :style="itemStyle">
                <el-input :disabled="readOnly" v-model="checkInfo.host_cpu"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="内存使用率" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="checkInfo.host_mem"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="时钟状态" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="checkInfo.host_clock"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="风扇状态" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="checkInfo.host_fan"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="电源状态" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="checkInfo.host_power"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="网络状态" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="checkInfo.host_internet"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="激光器状态" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="checkInfo.host_laser"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="光信号状态" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="checkInfo.host_signal"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="断纤状态" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="checkInfo.host_fiber"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="设备温度" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="checkInfo.host_temp"></el-input>
            </el-form-item>
          </el-form>  
        </div>
    </div>
</template>

<script>
import { sysCheckInfo } from '@/api/line/line.js'

export default {
    data() {
        return {
            itemStyle:'width: 33%;',
            readOnly:true,
            is_show_info:false,
            isShow:false,
            percentageVal:0,
            checkInfo:{
                check_time:'',
                host_cpu:'',
                host_mem:'',
                host_clock:'',
                host_fan:'',
                host_power:'',
                host_internet:'',
                host_laser:'',
                host_signal:'',
                host_fiber:'',
                host_temp:'',
            },
            checkInfoTemp:{
              
            }
        }
    },
    methods: {
        format(percentageVal) {
            return percentageVal >= 100 ? '完成' : `${percentageVal}%`;
        },
        startZiJian(){
            // debugger;
            sysCheckInfo({}).then(res => {
              if (res.retcode == 200) {
                this.checkInfoTemp=res.result
              }
            })
            if(this.isShow){
                return ;
            }
            this.percentageVal=0;
            this.isShow=true;
            let that=this;
            that.is_show_info=true
            var t2 = window.setInterval(function() {               
                that.percentageVal+=20;
                // debugger
                if(that.percentageVal>=20){
                  that.checkInfo.check_time=that.checkInfoTemp.check_time
                  that.checkInfo.host_cpu=that.checkInfoTemp.host_cpu
                  that.checkInfo.host_mem=that.checkInfoTemp.host_mem
                }
                if(that.percentageVal>=40){
                  that.checkInfo.host_clock=that.checkInfoTemp.host_clock
                  that.checkInfo.host_fan=that.checkInfoTemp.host_fan
                }
                if(that.percentageVal>=60){
                  that.checkInfo.host_power=that.checkInfoTemp.host_power
                  that.checkInfo.host_internet=that.checkInfoTemp.host_internet
                }
                if(that.percentageVal>=80){
                  that.checkInfo.host_laser=that.checkInfoTemp.host_laser
                  that.checkInfo.host_signal=that.checkInfoTemp.host_signal
                }
                
                if(that.percentageVal>=100){
                    window.clearInterval(t2);
                    //var t1 = window.setTimeout(function() {
                        that.$message({
                            message: '自检完成',
                            type: 'success'
                        });
                        // that.is_show_info=true
                        that.checkInfo=that.checkInfoTemp
                    //},200)
                }
            },1000);
            
            
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