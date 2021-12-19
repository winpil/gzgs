<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
        <!-- <lang-select class="set-language" /> -->
      </div>

      <el-form-item prop="account">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="account"
          v-model="loginForm.account"
          placeholder="账号/手机号"
          name="account"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
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
      </el-tooltip>
      <!-- <el-form-item prop="pcode">
        <span class="svg-container">
          <svg-icon icon-class="international" />
        </span>
        <el-input
          ref="pcode"
          v-model="loginForm.pcode"
          placeholder="点击图片更换验证码"
          name="pcode"
          type="text"
          tabindex="3"
          width="width: calc(85% - 110px)"
          autocomplete="on"
        />
        <v-sidentify @click.native="resetImg" :identifyCode="identifyCode"></v-sidentify>
        <img :src="imgUrl" @click="resetImg" class="vertify_img" />
      </el-form-item> -->
      <!-- <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="example" />
        </span>
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="手机号"
          name="phone"
          type="text"
          tabindex="6"
          autocomplete="on"
        />
      </el-form-item> -->
      <!-- <el-form-item prop="phone_auth_code">
        <span class="svg-container">
          <svg-icon icon-class="component" />
        </span>
        <el-input
          ref="phone_auth_code"
          v-model="loginForm.phone_auth_code"
          placeholder="验证码"
          name="phone_auth_code"
          type="text"
          tabindex="4"
          width="width: calc(85% - 210px)"
          autocomplete="on"
        />
        <span class="yzmDjsMsg_class" @click="getCode('loginForm')">
          {{ yzmDjsMsg }}
        </span>
      </el-form-item> -->

      <el-button :loading="loading" type="primary" style="width:32%;margin-bottom:30px;" @click.native.prevent="handleLogin">
        {{ $t('login.logIn') }}
      </el-button>
      <el-button  style="width:32%;margin-bottom:30px;" @click.native.prevent="resetForm">
        重置
      </el-button>
      <el-button  style="width:31%;margin-bottom:30px;" @click="forgetPasswordFun">
        忘记密码
      </el-button>

      <!-- <div style="position:relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin</span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">
            {{ $t('login.username') }} : editor
          </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
          {{ $t('login.thirdparty') }}
        </el-button>
      </div> -->
    </el-form>

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
            ref="phone_auth_code"
            v-model="forgetPasswordForm.phone_auth_code"
            placeholder="验证码"
            name="phone_auth_code"
            type="text"
            tabindex="4"
            width="width: calc(85% - 210px)"
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

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
 import Sidentify from '@/components/Sidentify'  //**引入验证码组件**
import { validUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './components/SocialSignin'

import { authCode,login,forgetPassword } from '@/api/login/user.js'

export default {
  name: 'Login',
  components: { LangSelect, SocialSign,'v-sidentify':Sidentify },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入账号/手机号'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入手机号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码'))
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
      loginForm: {
        account: '',
        password: '',
        pCode:'',
        phone:'12345678901',
        phone_auth_code:'123456',
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        //phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
      },
      forgetPasswordRules:{
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        surePassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      forgetPasswordVisible:false,
      //获取手机验证码倒计时
      identifyCode:'',
      identifyCodes: "1234567890",
      yzmDjsMsg:'获取验证码',
      timer:{},
      disabled:false,
      //验证码图片
      // imgUrl:'https://imghtml.baoday.cn/upload/article/000/000/006/5dbff8e2babb9202.jpg',
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.refreshCode();
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
    if (this.loginForm.account === '') {
      this.$refs.account.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
     randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
  makeCode(o, l) {
     for (let i = 0; i < l; i++) {
         this.identifyCode += this.identifyCodes[
           this.randomNum(0, this.identifyCodes.length)
         ];
     }
  },
    forgetPasswordLogin(){
      if(this.forgetPasswordForm.surePassword!=this.forgetPasswordForm.password){
         this.$message({
            message: '两次密码不一样',
            type: 'warning'
          });
        this.$refs.surePassword.focus();            
        return 
      }
      this.forgetPasswordForm.new_pwd=this.forgetPasswordForm.password
      forgetPassword(this.forgetPasswordForm).then(res => {
        // debugger
        if (res.data.retcode == 200) {
          this.$message({ type: 'success', message: '密码修改成功！'})
          this.forgetPasswordClose();
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
    resetImg(){
      //重新获取图片的验证码
      this.refreshCode();
    },
    tackBtn(phone){       //验证码倒数60秒
      let that=this;
      authCode(phone).then(res => {
        console.log(res);
        debugger
        if(res.data.retcode!=200){
          that.disabled = false;
          that.$message.error(res.data.error);
          return 
        }else{
          let time = 60;
          that.timer = setInterval(() => {
          if(time == 0){
              clearInterval(that.timer);
              that.yzmDjsMsg = '获取验证码';
              that.disabled = false;
          }else{
              that.disabled = true;
              that.yzmDjsMsg = time + '秒后重试';
              time--;
          }
      }, 1000);
        }
        console.log(res);
      });   
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
            /* if(checkForm=='loginForm' && that.identifyCode!=that.loginForm.pcode){
              this.$message({
                message: '请输入正确的图片验证码',
                type: 'warning'
              });
              this.$refs.pcode.focus();
              return ;
            }
            let data={purpose:(checkForm=='loginForm'?1:3),phone:that[checkForm].phone};
            this.tackBtn(data);   //验证码倒数60秒
        	   */
          }
        })        
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
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
    resetForm(){
      this.$refs.loginForm.resetFields();
    },
    handleLogin() {
      console.log('000')
      console.log(this.loginForm)
      let that=this
      this.$refs.loginForm.validate(valid => {
        console.log('111')
        if (valid) {
          console.log('222')
          this.loading = true
          this.$store.dispatch('user/login', that.loginForm)
            .then(() => {
              console.log('333')
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch((err) => {
              console.log('444', err)
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

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
</style>
