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
            checkInfo:{}
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
                this.checkInfo=res.result
              }
            })
            if(this.isShow){
                return ;
            }
            this.percentageVal=1;
            this.isShow=true;
            let that=this;
            var t2 = window.setInterval(function() {               
                that.percentageVal+=3;
                if(that.percentageVal>=100){
                    window.clearInterval(t2);
                    var t1 = window.setTimeout(function() {
                        that.$message({
                            message: '自检完成',
                            type: 'success'
                        });
                        that.is_show_info=true
                    },200)
                }
            },90);
            
            
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