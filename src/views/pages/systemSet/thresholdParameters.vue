<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="150px">            
            <el-form-item label="id序号"  :style="itemStyle">
                <el-input :disabled="readOnly" v-model="form.id" ></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="置信度"  :style="itemStyle">
                <el-input :disabled="readOnly" v-model="form.confidence" ></el-input>
            </el-form-item>
            <div class="clear"></div>
            <el-form-item label="振动次数" :style="itemStyle" >
                <el-input :disabled="readOnly" v-model="form.shake_count" ></el-input>
            </el-form-item>
            <div class="clear"></div>
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
import { alertParamInfo,alertParamCRUD } from '@/api/alarm/alarm.js'
export default {
    data() {
        return {
            itemStyle:'width: 33%;',
            readOnly:true,
            form:{
                id:'',
                confidence:'',
                shake_count:'',
            },
        }
    },
    created() {
        alertParamInfo({}).then(res => {
            if (res.retcode == 200) {
                this.form=res.result
            }
        })
    },
    methods:{
        updateFun(){
            alertParamCRUD(this.form).then(res => {
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