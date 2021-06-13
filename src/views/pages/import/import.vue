<template>
    <div>
        <div class="filter-container formBar">
            <div class="form-head">
                数据导入
            </div>
            <!-- <el-button class="filter-item" style="float: right;" type="primary" icon="el-icon-document-checked" @click="handleAdd">
                添加备份
            </el-button>
            <el-button class="filter-item" style="float: right;margin-right: 10px;background: #e67f00;border: 1px solid #e67f00;" type="primary" icon="el-icon-document-checked" @click="handleSubmit">
                立即备份
            </el-button> -->
        </div>
        <div style="padding-left: 25px;padding-right: 25px;overflow: auto;margin-top: 10px;">
            <div class="dataitem" style="height: 80px;border: 1px solid #c1c0c0;border-radius: 7px;padding: 30px 40px 10px 40px;color: #666;font-size: 16px;position: relative;margin-bottom: 20px;" v-for="(item, index) in importList" :key="item.id">
                <div style="margin-right: 15px;width: 120px;display: inline-block;">{{item.name}}:</div>
                <input type="file" style="width: 80%;" @change="updateFile($event, index)" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                <el-button type="primary" @click="insertTotal(item.id, index)" style="position: absolute;right: 30px;top: 25px;">确 定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { insertArea } from '@/api/area/area.js';
import { insertSmt, insertFields, insertNodes, insertGt } from '@/api/device/device.js';
import { insertZones } from '@/api/line/line.js'
import { insertEvent } from '@/api/alarm/alarm.js'
import { param2Obj } from '../../../utils';
export default {
    data() {
        return {
            importList: [
                {
                    id: 1,
                    name: '区域信息导入',
                    file: {}
                },
                {
                    id: 2,
                    name: '事件信息导入',
                    file: {}
                },
                {
                    id: 3,
                    name: '防区信息导入',
                    file: {}
                },
                {
                    id: 4,
                    name: '节点信息导入',
                    file: {}
                },
                {
                    id: 5,
                    name: 'SMT信息导入',
                    file: {}
                },
                {
                    id: 6,
                    name: 'GT信息导入',
                    file: {}
                },
                {
                    id: 7,
                    name: '线路信息导入',
                    file: {}
                },
            ]
        }
    },
    methods: {
        updateFile(e, index) {
            let file = e.target.files[0];
            this.importList[index].file = new FormData(); //创建form对象
            this.importList[index].file.append('excel_file',file);//通过append向form对象添加数据
            console.log(this.importList[index].file.get('excel_file'));
        },

        insertTotal(id, index) {
            switch (id) {
                case 1:
                    if(!this.beforeCommit(this.importList[index].file)) return
                    this.insertArea(this.importList[index].file)
                    break;

                case 2:
                    if(!this.beforeCommit(this.importList[index].file)) return
                    this.insertEvent(this.importList[index].file)
                    break;

                case 3:
                    if(!this.beforeCommit(this.importList[index].file)) return
                    this.insertFields(this.importList[index].file)
                    break;

                case 4:
                    if(!this.beforeCommit(this.importList[index].file)) return
                    this.insertNodes(this.importList[index].file)
                    break;

                case 5:
                    if(!this.beforeCommit(this.importList[index].file)) return
                    this.insertSmt(this.importList[index].file)
                    break;

                case 6:
                    if(!this.beforeCommit(this.importList[index].file)) return
                    this.insertGt(this.importList[index].file)
                    break;

                case 7:
                    if(!this.beforeCommit(this.importList[index].file)) return
                    this.insertZones(this.importList[index].file)
                    break;
            
                default:
                    break;
            }
        },

        beforeCommit(param) {
            // console.log(typeof param.get == 'undefined')
            if (typeof param.get == 'undefined') {
                this.$message({ type: 'warning', message: '请选择导入文件！' })
                return false
            }
            return true
        },
        
        insertArea(param) {
            insertArea(param).then(res => {
                if (res.retcode == 200) {
                this.$message({ type: 'success', message: '数据导入成功！' })
                setTimeout(() => {
                    this.dialogVisible = false
                }, 500);
                } else {
                this.$message({ type: 'warning', message: `数据导入失败！${res.status}` })
                }
            })
        },

        insertSmt(param) {
            insertSmt(param).then(res => {
                if (res.retcode == 200) {
                this.$message({ type: 'success', message: '设备导入成功！' })
                setTimeout(() => {
                    this.dialogVisible = false
                }, 500);
                } else {
                this.$message({ type: 'warning', message: `设备导入失败！${res.status}` })
                }
            })
        },

        insertFields(param) {
            insertFields(param).then(res => {
                if (res.retcode == 200) {
                this.$message({ type: 'success', message: '防区导入成功！' })
                setTimeout(() => {
                    this.dialogVisible = false
                }, 500);
                } else {
                this.$message({ type: 'warning', message: `防区导入失败！${res.status}` })
                }
            })
        },

        insertNodes(param) {
            insertNodes(param).then(res => {
                if (res.retcode == 200) {
                this.$message({ type: 'success', message: '节点导入成功！' })
                setTimeout(() => {
                    this.dialogVisible = false
                }, 500);
                } else {
                this.$message({ type: 'warning', message: `节点导入失败！${res.status}` })
                }
            })
        },

        insertGt(param) {
            insertGt(param).then(res => {
                if (res.retcode == 200) {
                this.$message({ type: 'success', message: '数据导入成功！' })
                setTimeout(() => {
                    this.dialogVisible = false
                }, 500);
                } else {
                this.$message({ type: 'warning', message: `数据导入失败！${res.status}` })
                }
            })
        },

        insertZones(param) {
            insertZones(param).then(res => {
                if (res.retcode == 200) {
                this.$message({ type: 'success', message: '数据导入成功！' })
                setTimeout(() => {
                    this.dialogVisible = false
                }, 500);
                } else {
                this.$message({ type: 'warning', message: `数据导入失败！${res.status}` })
                }
            })
        },

        insertEvent(param) {
            insertEvent(param).then(res => {
                if (res.retcode == 200) {
                this.$message({ type: 'success', message: '数据导入成功！' })
                setTimeout(() => {
                    this.dialogVisible = false
                }, 500);
                } else {
                this.$message({ type: 'warning', message: `数据导入失败！${res.status}` })
                }
            })
        },

    }
}
</script>

<style lang="less" scoped>

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

</style>