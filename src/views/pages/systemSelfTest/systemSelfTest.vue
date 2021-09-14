<template>
    <div class="app-container">
        <div class="filter-container" style="margin-bottom: 10px;">
            <el-button type="primary"  @click="startZiJian" icon="el-icon-refresh">开始自检</el-button>
        </div>
        <div v-show="isShow">
            <el-progress :percentage="percentageVal" :format="format"></el-progress>
        </div>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            isShow:false,
            percentageVal:0,
        }
    },
    methods: {
        format(percentageVal) {
            return percentageVal >= 100 ? '完成' : `${percentageVal}%`;
        },
        startZiJian(){
            // debugger;
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