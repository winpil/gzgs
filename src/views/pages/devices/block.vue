<template>
    <div>   
        <el-form ref="blockForm" :model="blockForm" :rules="blockRules" class="form-container">
            <div class="createPost-main-container">
            <el-row>
                <el-col :span="24" class="form-wrapper">
                <div class="postInfo-container fit-padding">
                    <el-row style="white-space: nowrap;overflow: auto;">
                    <el-col :lg="5" :md="8">
                        <el-form-item label-width="100px" label="防区号:" class="postInfo-container-item" prop="smt_field">
                        <el-input v-model="blockForm.smt_field" clearable :disabled="showFlag === pageType.detail || blockForm.status === 1 || blockForm.smt_field !== ''" placeholder="请输入防区号"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="5" :md="8">
                        <el-form-item label-width="100px" label="选择线路:" class="postInfo-container-item" prop="zone">
                        <el-select v-model="blockForm.zone" filterable default-first-option placeholder="请选择线路" :disabled="showFlag === pageType.detail || blockForm.status === 1">
                            <el-option v-for="(item,index) in lineList" :key="item.zone + index" :label="item.name" :value="item.zone" />
                        </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="5" :md="8">
                        <el-form-item label-width="100px" label="区间开始:" class="postInfo-container-item" prop="interval_start">
                        <el-input v-model="blockForm.interval_start" clearable :disabled="showFlag === pageType.detail || blockForm.status === 1" placeholder="区间开始值"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="5" :md="8">
                        <el-form-item label-width="100px" label="区间结束:" class="postInfo-container-item" prop="interval_end">
                        <el-input v-model="blockForm.interval_end" clearable :disabled="showFlag === pageType.detail || blockForm.status === 1" placeholder="区间结束值"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="4" :md="8" style="min-height: 1px;padding: 0 20px;">
                        <el-button @click="handleConfirm" v-show="blockForm.status === 0" style="margin-left: 10px;">确认</el-button>
                        <span></span>
                        <el-button @click="handleUpdate" v-show="blockForm.status === 1" style="margin-left: 10px;">修改</el-button>
                        <el-button @click="handleDel">删除</el-button>
                    </el-col>
                    </el-row>
                </div>
                </el-col>
            </el-row>
            </div>
        </el-form>
    </div>
</template>

<script>
import { createField, updateField } from '@/api/device/device.js'
export default {
    data() {
        return {
            blockForm: {
                smt_field: '',
                zone: '',
                interval_start: '',
                interval_end: '',
                smt_id: ''
            },
            blockRules: {
                smt_field: [{ required: true, message: '请输入防区号', trigger: 'blur' }],
                zone: [{ required: true, message: '请选择线路', trigger: 'change' }],
                interval_start: [{ required: true, message: '请输入区间开始值', trigger: 'blur' }],
                interval_end: [{ required: true, message: '请输入区间结束值', trigger: 'blur' }],
            },
            pageType: {
                list: 0,
                add: 1,
                edit: 2,
                detail: 3
            },
        }
    },
    props: {
        showFlag: {
            type: Number
        },
        block: {
            type: Object
        },
        smtid: {
            type: String
        },
        lineList: {
            type: Array
        }
    },
    methods: {
        handleDel() {
            let val = (this.blockForm.timeStamp == undefined || this.blockForm.timeStamp == '') ? this.blockForm.smt_field : this.blockForm.timeStamp
            this.$confirm('防区删除后无法恢复，是否继续删除？', '提示', {
                confirmButtonText: '提交',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('del', val)
            }).catch((err) => {
                console.log(err)
            })
        },
        handleConfirm() {
            let validTemp
            this.$refs['blockForm'].validate((valid) => {
                if (valid) {
                validTemp = true
                } else {
                validTemp = false
                return false;
                }
            });
            if (!validTemp) return 
            console.log(this.showFlag)
            if (this.showFlag === this.pageType.add) {
                this.blockForm.status = 1
                this.$emit('getBlock', this.blockForm)
                this.$forceUpdate()
            } else if (this.showFlag === this.pageType.edit) {
                console.log(111, this.block.smt_field)
                if (this.block.smt_field === '') {
                    this.addField()
                } else {
                    this.updateField()
                }
            }
            
        },
        handleUpdate() {
            this.blockForm.status = 0
            this.$forceUpdate()
        },
        addField() {
            console.log('add', this.smtid)
            let params = {}
            params.interval_start = this.blockForm.interval_start
            params.interval_end = this.blockForm.interval_end
            params.zone = this.blockForm.zone
            params.smt_id = this.smtid
            params.smt_field = this.blockForm.smt_field
            createField(params).then(res => {
                if (res.retcode === 200) {
                    this.$message({ type: 'success', message: '新增防区成功！' })
                    this.blockForm.status = 1
                    this.$emit('getBlock', this.blockForm)
                    this.$forceUpdate()
                } else{
                    this.$message({ type: 'warning', message: '新增防区失败，请输入防区号唯一！' })
                }
            })
        },
        updateField() {
            console.log('update', this.smtid)
            let params = {}
            params.interval_start = this.blockForm.interval_start
            params.interval_end = this.blockForm.interval_end
            params.zone = this.blockForm.zone
            params.smt_id = this.smtid
            params.smt_field = this.blockForm.smt_field
            updateField(params).then(res => {
                if (res.retcode === 200) {
                    this.$message({ type: 'success', message: '修改防区成功！' })
                    this.blockForm.status = 1
                    this.$emit('getBlock', this.blockForm)
                    this.$forceUpdate()
                } else{
                    this.$message({ type: 'warning', message: '修改防区失败！' })
                }
            })
        }
    },
    mounted() {
        this.blockForm = JSON.parse(JSON.stringify(this.block))
        
        if (this.blockForm.status != 0 && this.blockForm.status != 1) {
            this.blockForm.status = 0
            this.$forceUpdate()
        }
        this.$refs.blockForm.resetFields()
        console.log(this.blockForm)
    }
}
</script>

<style lang="less" scoped>
  .form-container {
    // margin-left: 40px;
    // margin-right: 10px;
    margin-top: 30px;
    margin-bottom: 20px;
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
</style>