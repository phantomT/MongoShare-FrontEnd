<template>
	<div style="background: #fff;height: 80%;padding-top: 100px;box-sizing: border-box;">
		<el-card class="box-card">
		  	<div slot="header" class="clearfix">
		  		<img src="../assets/img/logo.png" />
		    	<span style="color: black;font-weight: bold;">登录入口</span>
		  	</div>
		  	<el-form ref="form" :model="form" :rules="formRules" label-width="0px" v-loading="loading">
  				<el-form-item>
    				<el-input v-model="form.username" class="input" placeholder="请输入登录账号"></el-input>
  				</el-form-item>
  				<el-form-item>
    				<el-input type="password" v-model="form.password" class="input" placeholder="请输入登录密码"></el-input>
  				</el-form-item>
  				<el-form-item>
    				<el-button type="warning" class="input" @click="onSubmit">登录</el-button>
  				</el-form-item>
  			</el-form>
			<p style="color: blue;margin-bottom: 10px;">新用户登录将会自动注册</p>
  			<p style="color: blue;margin-bottom: 10px;">小组成员：田宝宁、刘玄亮、王博</p>
			<img src="../assets/img/ustc.png" style="margin-top:20px" width="300px"/>
		</el-card>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				loading: false,
				form: {
					username:'',
					password:''
				},
				formRules: {
					username: [
						{ required: true, message: '请输入登录账号', trigger: 'blur' },
						{ min: 3, max: 10, message: '长度在3到10个字符', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入登录密码', trigger: 'blur' },
						{ min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
					]
				}
			}
		},
		created(){
		},
		methods:{
			onSubmit(){
				this.loading = true;
				this.$http.post('security/login', {
					"username": this.form.username,
					"password": this.form.password
				}).then(response => {
					this.loading = false;
					var data = response.body;
					if(data.code === 0){
						this.addSession(data.data.id,data.data.nickname,data.data.token);
						// sessionStorage.setItem('token', data.data.token);
						sessionStorage.setItem('username', this.form.username);
						this.$router.push("/main");
					}
				});
			}
		}
	}
</script>

<style>
	.box-card{
		width: 500px;
		margin: 0 auto;
		padding: 14px 75px 14px;
		box-sizing: border-box;
		box-shadow: 0px 20px 40px 0px rgba(0,0,0,0.3);
	}
	.input{
		width: 100%;
	}
</style>