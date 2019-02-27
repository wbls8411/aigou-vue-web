<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: 'admin',
          checkPass: 'admin'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
          // 登录的逻辑:  获取表单的数据,
          // 向后台的登录的服务发送请求
          // 得到返回值进行是否成功的判断和页面的跳转
          //问题一::怎么想后退发送请求:
          //  ajax===>promise==>axios
          //问题二:后台呢?
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
              // 组装form参数
            var loginParams = { name: this.ruleForm2.account, password: this.ruleForm2.checkPass };

            // 发送登录的请求:使用功能axios发送请求
            this.$http.post("/employee/employee/login",loginParams).then(
                d => {
                    console.debug(d);//{"data":{"msg":"TaPo((","object":{},"success":false}}
                    this.logining = false;
                    //NProgress.done();
                    let { msg, success, object } = d.data;
                    // {"msg":"TaPo((","object":{},"success":false}
                    // { success: true, msg: "登录成功", object: null }
                    if (!success) {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        // session的设置
                        //返回的object是null,那么存在session中的就是null,然后在main.js:如果session中
                        //没有user,会直接又走到登录路由
                        object ={"name":"admin"};
                        sessionStorage.setItem('user', JSON.stringify(object));
                        this.$router.push({ path: '/' });
                    }
                }
            )





          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>