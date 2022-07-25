<template>
  <div id="login">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="main"></div>
          <div class="form">
            <h3 class="createCount" @click="showRegister">创建账户</h3>
            <transition name="slide">
              <div v-bind:class="{ show: isShowRegister }" class="register">
                <el-form
                  :model="register"
                  status-icon
                  :rules="rules"
                  ref="ruleForm"
                  label-width="60px"
                  class="demo-ruleForm"
                >
                  <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="register.username" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="register.password" autocomplete="off"></el-input>
                  </el-form-item>
                  <p v-bind:class="{ error: register.isError }">{{ register.notice }}</p>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </transition>
            <h3 class="loginCount" @click="showLogin">登录</h3>
            <transition name="slide">
              <div v-bind:class="{ show: isShowLogin }" class="login">
                <el-form
                  :model="login"
                  status-icon
                  :rules="rules"
                  ref="formNameLogin"
                  label-width="80px"
                  class="demo-ruleForm"
                >
                  <el-form-item label="用户名" prop="username">
                    <el-input type="text" v-model="login.username" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="login.password" autocomplete="off"></el-input>
                  </el-form-item>
                  <p v-bind:class="{ error: login.isError }">{{ login.notice }}</p>
                  <el-form-item>
                    <el-button type="primary" @click="submitFormLogin('formNameLogin')">提交</el-button>
                  </el-form-item>
                </el-form>
                <p v-bind:class="{ error: login.isError }">{{ login.notice }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/helpers/request.js'
import Bus from '@/helpers/bus.js'
export default {
  name: 'Login',
  data () {
    var validateUsername = (rule, value, callback) => {
      // console.log(value)
      if (value === '') {
        return callback(new Error('用户名不能为空'))
      } else {
        setTimeout(() => {
          if (!/^[a-zA-Z0-9_-]{4,16}$/.test(this.register.username || this.login.username)) {
            callback(new Error('必须是4-16位字母或数字'))
            this.register.isError = true
          } else {
            callback()
          }
        }, 1000)
      }
    }

    var validatePassword = (rule, value, callback) => {
      // console.log(value)
      if (value === '') {
        return callback(new Error('请输入密码'))
      } else {
        setTimeout(() => {
          if (!/^\d{3,}$/.test(this.register.password || this.login.password)) {
            callback(new Error('至少三位'))
            this.register.isError = true
          } else {
            callback()
          }
        }, 1000)
      }
    }

    return {
      isShowLogin: true,
      isShowRegister: false,
      login: {
        username: '',
        password: '',
        notice: '输入用户名和密码',
        isError: false
      },
      register: {
        username: '',
        password: '',
        notice: '创建账号后，请记住用户名和密码',
        isError: false
      },
      rules: {
        username: [
          { validator: validateUsername, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ]

      }
    }
  },
  async created () {

  },
  methods: {
    showLogin () {
      this.isShowLogin = true
      this.isShowRegister = false
    },
    showRegister () {
      this.isShowLogin = false
      this.isShowRegister = true
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            await request.register({ username: this.register.username, password: this.register.password })
            this.$message({
              message: '注册成功',
              type: 'success'
            })
          } catch (err) {
            this.register.notice = err.msg
            this.register.isError = true
          }
        } else {
          this.$message({
            message: '登录失败',
            type: 'error'
          })
          return false
        }
      }
      )
    },
    submitFormLogin (formNameLogin) {
      this.$refs[formNameLogin].validate(async (valid) => {
        if (valid) {
          try {
            await request.login({ username: this.login.username, password: this.login.password })
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            this.login.isError = false
            this.login.notice = ''
            // 调用bus实例传递两个不相关的数据
            Bus.$emit('userInfo', { username: this.login.username })
            this.$router.push('/notebooks')
          } catch (data) {
            this.login.isError = true
            this.login.notice = data.msg
          }
        } else {
          this.$message({
            message: '登录失败',
            type: 'error'
          })
          return false
        }
      }
      )
    }
  }
}

</script>
<style lang="less">
.modal-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 800px;
  height: 500px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  display: flex;

  .main {
    flex: 1;
    background: #36bc64 url(//cloud.hunger-valley.com/17-12-13/38476998.jpg-middle) center center no-repeat;
    background-size: contain;
  }
  .form {
    width: 270px;
    border-left: 1px solid #ccc;
    overflow: hidden;

    h3 {
      padding: 10px 20px;
      margin-top: -1px;
      font-weight: normal;
      font-size: 16px;
      border-top: 1px solid #eee;
      cursor: pointer;

      &:nth-of-type(2) {
        border-bottom: 1px solid #eee;
      }
    }

    .button {
      background-color: #2bb964;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-weight: bold;
      color: #fff;
      border-radius: 4px;
      margin-top: 18px;
      cursor: pointer;
    }

    .login,
    .register {
      padding: 0px 20px;
      border-top: 1px solid #eee;
      height: 0;
      overflow: hidden;
      transition: height 0.4s;

      &.show {
        height: 193px;
      }

      input {
        display: block;
        width: 100%;
        height: 35px;
        line-height: 35px;
        padding: 0 6px;
        border-radius: 4px;
        border: 1px solid #ccc;
        outline: none;
        font-size: 14px;
        margin-top: 10px;
      }
      input:focus {
        border: 3px solid #9dcaf8;
      }

      p {
        font-size: 12px;
        margin-top: 10px;
        color: #444;
      }
      .error {
        color: red;
      }
    }
    .login {
      border-top: 0;
    }
  }
}
</style>
