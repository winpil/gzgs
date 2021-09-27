<template>
  <div class="navbar login-container">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <lang-select class="right-menu-item hover-effect" />

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="selfImgBaseUrl+'f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link> -->
          <el-dropdown-item divided @click.native="updatePwd">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    
    <el-dialog :before-close="forgetPasswordClose" width="600px" title="忘记密码" :close-on-click-modal="false" :visible.sync="forgetPasswordVisible">
      <el-form ref="forgetPasswordForm" :model="forgetPasswordForm" :rules="forgetPasswordRules" >
        <el-form-item prop="account">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="account"
            v-model="forgetPasswordForm.account"
            placeholder="账号/手机号"
            name="account"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
        <el-form-item prop="phone">
          <span class="svg-container">
            <svg-icon icon-class="example" />
          </span>
          <el-input
            ref="phone"
            v-model="forgetPasswordForm.phone"
            placeholder="手机号"
            name="phone"
            type="text"
            tabindex="6"
            autocomplete="on"
          />
        </el-form-item>
        <el-form-item prop="phone_auth_code">
          <span class="svg-container">
            <svg-icon icon-class="component" />
          </span>
          <el-input
            class="myyzminput"
            ref="phone_auth_code"
            v-model="forgetPasswordForm.phone_auth_code"
            placeholder="验证码"
            name="phone_auth_code"
            type="text"
            tabindex="4"
            width="78%"
            autocomplete="on"
          />
          <span class="yzmDjsMsg_class" @click="getCode('forgetPasswordForm')">
            {{ yzmDjsMsg }}
          </span>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="forgetPasswordForm.password"
            :type="passwordType"
            placeholder="新密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item prop="surePassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="surePassword"
            v-model="forgetPasswordForm.surePassword"
            :type="passwordType"
            placeholder="确认密码"
            name="surePassword"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native.prevent="forgetPasswordClose" >取 消</el-button>
        <el-button type="primary" @click.native.prevent="forgetPasswordLogin" >提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import { authCode,forgetPassword } from '@/api/login/user.js'
import { validUsername } from '@/utils/validate'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    Search
  },
   data() {
     const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
     return {
      forgetPasswordForm:{
        account:'',
        password:'',
        surePassword:'',
        phone:'',
        phone_auth_code:'',
      },
      forgetPasswordRules:{
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        phone: [{ required: true, trigger: 'blur', validator: validateUsername }],
        surePassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      forgetPasswordVisible:false,
      //获取手机验证码倒计时
      identifyCode:'',
      identifyCodes: "1234567890",
      yzmDjsMsg:'获取验证码',
      timer:{},
      disabled:false,
     }
   },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    forgetPasswordLogin(){
      if(this.forgetPasswordForm.surePassword!=this.forgetPasswordForm.password){
         this.$message({
            message: '两次密码不一样',
            type: 'warning'
          });
        this.$refs.surePassword.focus();            
        return 
      }
      let that=this
      this.forgetPasswordForm.new_pwd=this.forgetPasswordForm.password
      forgetPassword(this.forgetPasswordForm).then(res => {
        // debugger
        if (res.data.retcode == 200) {
          this.$message({ type: 'success', message: '密码修改成功，请重新登录！'})
          this.forgetPasswordClose();
          that.logout()
          //this.$router.push({path: '/login'})
        }
      })
    },
    forgetPasswordClose(){
      this.yzmDjsMsg = '获取验证码';
      this.disabled = false;
      clearInterval(this.timer);
      this.forgetPasswordVisible=false;
    },
    forgetPasswordFun(){
      clearInterval(this.timer);
      this.yzmDjsMsg = '获取验证码';
      this.disabled = false;
      this.forgetPasswordVisible=true;
    },
    getCode(checkForm){
      // debugger;
        if(this.disabled){
          return ;
        }
        let that=this;
        this.$refs[checkForm].validateField('phone', (err) =>{
        if(err){
            this.$message({
              message: '请输入正确的账号/手机号',
              type: 'warning'
            });
            this.$refs.phone.focus();
            return;
          }else{
            if(checkForm=='loginForm' && that.identifyCode!=that.loginForm.pcode){
              this.$message({
                message: '请输入正确的图片验证码',
                type: 'warning'
              });
              this.$refs.pcode.focus();
              return ;
            }
            let data={purpose:1,phone:that[checkForm].phone};
            this.tackBtn(data);   //验证码倒数60秒
          }
        })        
    },
    tackBtn(phone){       //验证码倒数60秒
      authCode(phone).then(res => {
        console.log(res);
      });
      let time = 60;
      let that=this;
      this.timer = setInterval(() => {
          if(time == 0){
              clearInterval(that.timer);
              this.yzmDjsMsg = '获取验证码';
              this.disabled = false;
          }else{
              this.disabled = true;
              this.yzmDjsMsg = time + '秒后重试';
              time--;
          }
      }, 1000);
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    updatePwd(){
        this.forgetPasswordVisible=true
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

.el-input{
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 92%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }
.yzmDjsMsg_class{
  position: absolute;
  right: 0;
  bottom: 0;
  width: 110px;
  height: 50px;
  cursor: pointer;
  color: #fff;
  line-height: 50px;
  text-align: right;
  padding-right: 15px;
  font-size: inherit;
}
.login-container .el-input input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: #fff;
    height: 47px;
    caret-color: #fff;
}
.vertify_img {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 110px;
  height:50px;
  cursor: pointer;
}
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
.myyzminput{
  width: 78% !important;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
