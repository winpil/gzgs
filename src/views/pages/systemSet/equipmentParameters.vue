<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="150px">         
            <!-- <el-form-item label="id序号"  :style="itemStyle">
                <el-input :disabled="readOnly" v-model="form.id" ></el-input>
            </el-form-item>
            <div class="clear"></div>    -->
            <el-form-item label="FFT转换系数"  :style="itemStyle">
                <el-input :disabled="readOnly" v-model="form.fft_change" ></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="FFT起始频率"  :style="itemStyle">
                <el-input :disabled="readOnly" v-model="form.fft_start_freq" ></el-input>
            </el-form-item>
            <el-form-item label="FFT结束频率" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.fft_end_freq" ></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="FFT长度限制" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.fft_length"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="平滑级别" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.smooth_level"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="匹配程度" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.match_level"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="匹配到并更新程度" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.match_update_level"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="空闲时间" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.free_time"></el-input>
            </el-form-item>    
            <el-form-item label="剪切长度" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.cutting_length"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="距离换算参数" style="width:66%" > 
                <el-input placeholder="距离换算参数x" :disabled="readOnly" v-model="form.position_x" style="float: left;width: calc(50% - 75px);"></el-input>
                <el-input placeholder="距离换算参数y" :disabled="readOnly" v-model="form.position_y" style="float: left;width: calc(50% - 75px);margin-left: 30px;"></el-input>
            </el-form-item>    
        </el-form>    
        <div class="clear"></div>
        <div style="margin-left:150px">
            <el-button v-show="readOnly" type="primary" style="width:150px;margin-bottom:30px;" @click="readOnly=false">
                修 改
            </el-button>
            <el-button v-show="!readOnly" type="primary" style="width:150px;margin-bottom:30px;" @click="updateFun">
                确 认
            </el-button>
            <el-button v-show="!readOnly" style="width:150px;margin-bottom:30px;" @click="readOnly=true">
                放 弃
            </el-button>
        </div>
    </div>
</template>

<script>
import { workParamInfo,workParamCRUD } from '@/api/alarm/alarm.js'
export default {
    data() {
        return {
            itemStyle:'width: 33%;',
            readOnly:true,
            form:{
                id:'',
                fft_change:'',
                fft_start_freq:'',
                fft_end_freq:'',
                fft_length:'',
                smooth_level:'',
                match_level:'',
                match_update_level:'',
                free_time:'',
                cutting_length:'',
                position_x:'',
                position_y:'',
            },
        }
    },
    created() {
        workParamInfo({}).then(res => {
            if (res.retcode == 200) {
                this.form=res.result
            }
        })
    },
    methods:{
        updateFun(){
            workParamCRUD(this.form).then(res => {
                if (res.retcode == 200) {
                    this.$message({ type: 'success', message: '修改成功！' })
                    this.readOnly=true
                }
            })
        },
    }
}
</script>

<style scoped>
    .clear{
        clear: both;
    }
    .el-form-item{
        float: left;
    }
</style>