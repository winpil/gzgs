<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="150px">            
            <el-form-item label="FFT转换系数"  :style="itemStyle">
                <el-input :disabled="readOnly" v-model="form.FFTZh" ></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="FFT起始频率"  :style="itemStyle">
                <el-input :disabled="readOnly" v-model="form.FFTStart" ></el-input>
            </el-form-item>
            <el-form-item label="FFT结束频率" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.FFTEnd" ></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="FFT长度限制" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.FFTCd"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="平滑级别" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.phjb"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="匹配程度" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.ppcd"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="匹配到并更新程度" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.ppd"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="空闲时间" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.kxsj"></el-input>
            </el-form-item>    
            <el-form-item label="剪切长度" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.jqcd"></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="距离换算参数" style="width:66%" > 
                <el-input :disabled="readOnly" v-model="form.jlhsyi" style="float: left;width: calc(50% - 75px);"></el-input>
                <el-input :disabled="readOnly" v-model="form.jlhser" style="float: left;width: calc(50% - 75px);margin-left: 30px;"></el-input>
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
export default {
    data() {
        return {
            itemStyle:'width: 33%;',
            readOnly:true,
            form:{},
        }
    },
    methods:{
        updateFun(){

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