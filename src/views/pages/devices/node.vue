<template>
    <div>   
        <el-form ref="nodeForm" :model="nodeForm" :rules="nodeRules" class="form-container">
            <div class="createPost-main-container">
            <el-row>
                <el-col :span="24" class="form-wrapper">
                <div class="postInfo-container fit-padding">
                    <el-row style="white-space: nowrap;overflow: auto;">
                    <el-col :lg="6" :md="8">
                        <el-form-item label-width="100px" label="节点顺序:" class="postInfo-container-item" prop="order">
                        <el-input v-model="nodeForm.order" clearable placeholder="请输入节点顺序" :disabled="showFlag === pageType.detail || nodeForm.status === 1"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="7" :md="8">
                        <el-form-item label-width="100px" label="经度:" class="postInfo-container-item" prop="longitude">
                        <el-input v-model="nodeForm.longitude" clearable :disabled="showFlag === pageType.detail || nodeForm.status === 1" placeholder="请输入经度"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="7" :md="8">
                        <el-form-item label-width="100px" label="纬度:" class="postInfo-container-item" prop="latitude">
                        <el-input v-model="nodeForm.latitude" clearable :disabled="showFlag === pageType.detail || nodeForm.status === 1" placeholder="请输入纬度"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="4" :md="8" style="min-height: 1px;padding: 0 20px;">
                        <el-button @click="handleConfirm" v-show="nodeForm.status === 0" style="margin-left: 10px;">确认</el-button>
                        <span></span>
                        <el-button @click="handleUpdate" v-show="nodeForm.status === 1" style="margin-left: 10px;">修改</el-button>
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
            nodeForm: {
                order: '',
                longitude: '',
                latitude: '',
                status: ''
            },
            nodeRules: {
                order: [{ required: true, message: '请输入节点顺序', trigger: 'blur' }],
                longitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
                latitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
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
    },
    methods: {
        handleDel() {
            let val = this.nodeForm.id || ''
            this.$confirm('节点删除后无法恢复，是否继续删除？', '提示', {
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
            this.$refs['nodeForm'].validate((valid) => {
                if (valid) {
                validTemp = true
                } else {
                validTemp = false
                return false;
                }
            });
            if (!validTemp) return 
            this.nodeForm.status = 1
            this.$emit('getNode', this.nodeForm)
            this.$forceUpdate()
        },
        handleUpdate() {
            this.nodeForm.status = 0
            this.$forceUpdate()
        },
        addField() {
            console.log('add', this.smtid)
            let params = {}
            params.interval_start = this.nodeForm.interval_start
            params.interval_end = this.nodeForm.interval_end
            params.zone = this.nodeForm.zone
            params.smt_id = this.smtid
            params.smt_field = this.nodeForm.smt_field
            createField(params).then(res => {
                if (res.retcode === 200) {
                    this.$message({ type: 'success', message: '新增防区成功！' })
                    this.nodeForm.status = 1
                    this.$emit('getBlock', this.nodeForm)
                    this.$forceUpdate()
                } else{
                    this.$message({ type: 'warning', message: '新增防区失败，请输入防区号唯一！' })
                }
            })
        },
        updateField() {
            console.log('update', this.smtid)
            let params = {}
            params.interval_start = this.nodeForm.interval_start
            params.interval_end = this.nodeForm.interval_end
            params.zone = this.nodeForm.zone
            params.smt_id = this.smtid
            params.smt_field = this.nodeForm.smt_field
            updateField(params).then(res => {
                if (res.retcode === 200) {
                    this.$message({ type: 'success', message: '修改防区成功！' })
                    this.nodeForm.status = 1
                    this.$emit('getBlock', this.nodeForm)
                    this.$forceUpdate()
                } else{
                    this.$message({ type: 'warning', message: '修改防区失败！' })
                }
            })
        }
    },
    mounted() {
        this.nodeForm = JSON.parse(JSON.stringify(this.block))
        
        if (this.nodeForm.status != 0 && this.nodeForm.status != 1) {
            this.nodeForm.status = 0
            this.$forceUpdate()
        }
        this.$refs.nodeForm.resetFields()
        console.log(this.nodeForm)
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