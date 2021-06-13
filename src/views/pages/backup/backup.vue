<template>
  <div>
    <div v-if="showFlag === pageType.list">
        <div class="filter-container formBar">
            <div class="form-head">
                数据备份
            </div>
            <el-button class="filter-item" style="float: right;" type="primary" icon="el-icon-document-checked" @click="handleAdd">
                添加备份
            </el-button>
            <el-button class="filter-item" style="float: right;margin-right: 10px;background: #e67f00;border: 1px solid #e67f00;" type="primary" icon="el-icon-document-checked" @click="handleSubmit">
                立即备份
            </el-button>
        </div>
        <div class="datalist" style="padding-left: 25px;padding-right: 25px;overflow: auto;">
            <div class="dataitem" style="height: 175px;border: 1px solid #c1c0c0;border-radius: 7px;padding: 30px 30px 30px 80px;color: #666;font-size: 16px;position: relative;margin-bottom: 20px;" v-for="item in dataList" :key="item.id">
                <div class="item-row" style="display: flex;justify-content: space-around;margin-bottom: 30px;">
                    <div style="flex: 1;">
                        备份主机IP：{{item.ip}}
                    </div>
                    <div style="flex: 1;">
                        备份主机端口：{{item.port || 8001}}
                    </div>
                    <div style="flex: 1;">
                        备份频率：{{item.frequency}} 月/次
                    </div>
                </div>
                <div class="item-row" style="display: flex;justify-content: space-around;margin-bottom: 30px;">
                    <div style="flex: 1;">
                        数据库名称：{{item.name}}
                    </div>
                    <div style="flex: 1;">
                        数据库账户：{{item.user}}
                    </div>
                    <div style="flex: 1;">
                        数据库密码：{{item.password}}
                    </div>
                </div>
                <div class="item-row" style="display: flex;justify-content: space-around;">
                    <div style="flex: 1;">
                        最近备份时间：2020-08-13 12:00:00
                    </div>
                    <div style="flex: 1;">
                        下次备份时间：2020-09-13 12:00:00
                    </div>
                    <div style="flex: 1;">
                    </div>
                </div>
                <el-button style="position: absolute;right: 50px;top: 20px;width: 100px;" type="primary" plain @click="handleUpdate(item)">修改</el-button>
                <el-button style="position: absolute;right: 50px;top: 70px;width: 100px;" type="primary" plain @click="handleDelete(item)">删除</el-button>
            </div>
        </div>
    </div>
    <div v-else-if="showFlag === pageType.add || showFlag === pageType.edit">
        <div class="filter-container formBar">
            <div class="form-head">
                新增计划备份
            </div>
            <el-button class="filter-item" style="float: right;" type="primary" icon="el-icon-back" @click="handleReturn">
                返回
            </el-button>
            <el-button class="filter-item" style="float: right;margin-right: 10px;" type="primary" icon="el-icon-document-checked" @click="handleSubmit">
                提交
            </el-button>
        </div>
        <el-form ref="postForm" :model="postForm" :rules="postRules" class="form-container">
            <div class="createPost-main-container">
                <el-row>
                    <el-col :span="24" class="form-wrapper">
                    <div class="postInfo-container fit-padding" >
                        <el-row style="margin-bottom: 20px;padding-left:50px;">
                            <el-col :span="18">
                                <el-form-item label-width="120px" label="备份主机IP:" class="postInfo-container-item" prop="ip">
                                <el-input placeholder="请输入备份主机IP" v-model="postForm.ip" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" style="min-height: 1px;">
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom: 20px;padding-left:50px;">
                            <el-col :span="18">
                                <el-form-item label-width="120px" label="备份频率:" class="postInfo-container-item" prop="frequency">
                                <el-input placeholder="请输入备份频率" v-model="postForm.frequency" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" style="min-height: 1px;">
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom: 20px;padding-left:50px;">
                            <el-col :span="18">
                                <el-form-item label-width="120px" label="数据库名称:" class="postInfo-container-item" prop="name">
                                <el-input placeholder="请输入数据库名称" v-model="postForm.name" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" style="min-height: 1px;">
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom: 20px;padding-left:50px;">
                            <el-col :span="18">
                                <el-form-item label-width="120px" label="数据库用户名:" class="postInfo-container-item" prop="user">
                                <el-input placeholder="请输入数据库用户名" v-model="postForm.user" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" style="min-height: 1px;">
                            </el-col>
                        </el-row>
                        <el-row style="margin-bottom: 20px;padding-left:50px;">
                            <el-col :span="18">
                                <el-form-item label-width="120px" label="数据库密码:" class="postInfo-container-item" prop="password">
                                <el-input placeholder="请输入数据库密码" v-model="postForm.password" style="min-width: 120px;" clearable :disabled="showFlag === pageType.detail"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" style="min-height: 1px;">
                            </el-col>
                        </el-row>
                    </div>
                    </el-col>
                </el-row>
            </div>
        </el-form>
    </div>
    
  </div>
</template>

<script>
import { createPlan, queryPlan, updatePlan, delPlan } from '@/api/backup/backup.js'
export default {
    data() {
        return {
            showFlag: 1,
            pageType: {
                list: 1,
                add: 2,
                edit: 3
            },
            currentRow: {},
            postForm: {
                ip: '',
                frequency: '',
                user: '',
                password: '',
                name: ''
            },
            dataList: [],
            postRules: {
                ip: [{ required: true, message: '请输入备份主机IP', trigger: 'blur' }],
                frequency: [{ required: true, message: '请输入备份频率', trigger: 'blur' }],
                user: [{ required: true, message: '请输入数据库用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入数据库密码', trigger: 'blur' }],
                name: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            queryPlan().then(res => {
                if (res.retcode == 200) {
                    this.dataList = res.result || []
                } else {
                    this.$message({ type: 'warning', message: res.status })
                }
            })
        },
        handleSubmit() {
            let validTemp
            this.$refs['postForm'].validate((valid) => {
                if (valid) {
                validTemp = true
                } else {
                console.log('error submit!!');
                validTemp = false
                return false;
                }
            });
            if (!validTemp) {
                return
            }
            let params = {}
            if (this.showFlag == this.pageType.add) {
                let data = []
                data.push(this.postForm)
                params.data = data
                createPlan(params).then(res => {
                    if (res.retcode == 200) {
                        this.$message({ type: 'success', message: '提交成功！' })
                        setTimeout(() => {
                            this.showFlag = this.pageType.list
                            this.handleReset()
                            this.getList()
                        }, 500)
                    } else {
                        this.$message({ type: 'warning', message: res.status })
                    }
                })
            } else if (this.showFlag == this.pageType.edit) {
                params = { id: this.currentRow.id, ...this.postForm }
                updatePlan(params).then(res => {
                    if (res.retcode == 200) {
                        this.$message({ type: 'success', message: '提交成功！' })
                        setTimeout(() => {
                            this.showFlag = this.pageType.list
                            this.handleReset()
                            this.getList()
                        }, 500)
                    } else {
                        this.$message({ type: 'warning', message: res.status })
                    }
                })
            }
            
        },

        handleReset() {
            Object.keys(this.postForm).forEach(item => {
                this.postForm[item] = ''
            })
            this.currentRow = {}
        },

        handleAdd() {
            this.showFlag = this.pageType.add
        },

        handleReturn() {
            this.showFlag = this.pageType.list
            this.handleReset()
        },
        
        handleUpdate(row) {
            this.currentRow = row
            Object.keys(this.postForm).forEach(item => {
                this.postForm[item] = row[item]
            })
            this.showFlag = this.pageType.edit
        },

        handleDelete(row) {
            this.$confirm('计划删除后将不可恢复，确认删除该计划？', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delPlan({ id: row.id }).then(res => {
                    if (res.retcode == 200) {
                        this.$message({ type: 'success', message: '删除成功！' })
                        setTimeout(() => {
                            this.getList()
                        }, 500)
                    } else {
                        this.$message({ type: 'warning', message: res.status })
                    }
                })
            })
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
    margin-top: 20px;
    margin: 20px 20px 0 20px;
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

  .datalist {
      height: calc(~"100vh - 200px");
      margin-top: 10px;
  }
</style>