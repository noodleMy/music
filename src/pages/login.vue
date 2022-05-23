<template>
  <div class="box">
      <div class="content3">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="手机号" prop="email">
                <el-input type="text" v-model="ruleForm.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
    name:'login',
    data(){
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      var email = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号不能为空'));
        }else {
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          email: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          email: [
            { validator: email, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            alert('submit!');
            let result = await this.$store.dispatch('Login',{email:this.ruleForm.email,password:this.ruleForm.pass})
            if(result == 200){
                this.$router.push({path:"/singlist"})
            }
            else{
                alert("输入错误")
            }
          } else {
            alert('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    
    }

}
</script>

<style lang="less" stoped>
    .box{
        width:100vw;
        height: 100vh;
        position: relative;
        .content3{  
            text-align: center;    
            display: flex;
            align-content: center;
            position: absolute;
            top:50%;
        }

    }
</style>