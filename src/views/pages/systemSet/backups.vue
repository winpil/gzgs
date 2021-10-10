<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button style="margin-right:100px" class="filter-item" type="primary" icon="el-icon-search" @click="daochu">数据导出</el-button>
            <el-date-picker
                v-model="value1"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
            </el-date-picker>
        </div>
        <div class="filter-container">
            <el-button style="margin-right:100px" class="filter-item" type="primary" icon="el-icon-search" @click="shanchu">数据删除</el-button>
            <el-date-picker
                v-model="value2"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
            </el-date-picker>
        </div>
    </div>
</template>

<script>
import { sysExportData,sysDelData } from '@/api/alarm/alarm.js'
export default {
    data() {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            value1:'',
            value2:''
        }
    },
    methods:{
        daochu(){
            console.log(this.value1)
            let param={'start_time':this.value1[0],'end_time':this.value1[1]}
            sysExportData(param)
        },
        shanchu(){
            console.log(this.value2)
            let param={'start_time':this.value2[0],'end_time':this.value2[1]}
            this.$confirm('数据删除后将不可恢复，是否确认删除？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sysDelData(param).then(res => {
                    if (res.retcode === 200) {
                        this.$message({ type: 'success', message: '删除成功！' })
                    } else {
                        this.$message({ type: 'warning', message: `删除失败！${res.status}` })
                    }
                })
            }).catch(err => {
                console.log(err)
            })
            
        }
    }
}
</script>

<style scoped>
    
</style>