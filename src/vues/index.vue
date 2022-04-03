<template>
	<div style="height: 100%;">
		<el-container style="height: 100%;">
			<el-header class="header">
				<el-row>
	  				<el-col :span="10" class="headercol">
						<img src="../assets/img/logo.png" style="vertical-align: middle;"/>
	  				</el-col>
					<el-col :span="8" class="headercol">
						<img src="../assets/img/ustc.png" style="vertical-align: middle;" width="230px"/>
	  				</el-col>
					<el-col :span="4" class="headername" align="right" >
						<div>欢迎：{{ nickname }}</div>
	  				</el-col>
					<el-col :span="2" class="headercol" align="right">
						<el-button type="text" icon="el-icon-switch-button" @click="handleLogout">退出</el-button>
	  				</el-col>
	  			</el-row>
			</el-header>
			<el-container style="height: 100%;">
    			<el-main style="overflow:auto;height: 100%;">
    				<router-view></router-view>
    			</el-main>
  			</el-container>
		</el-container>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				nickname: sessionStorage.getItem("username"),
			}
		},
		created() {
    	},
		mounted () {
  		},
		methods: {
			handleLogout() {
				sessionStorage.clear();
				this.$router.push("/toLogin");
			}
		}
	}
</script>

<style scoped="scoped">
	.header{
		background: white;
		/*box-shadow: 0 6px 0 rgba(0,0,0,.05);
		z-index: 11111;*/
		border-bottom: 1px solid #f4f4f4;
		box-shadow: 0px 3px 3px rgba(0,0,0,.05);
		z-index: 1111;
	}
	.headercol{
		/*line-height: 60px;*/
		box-sizing: border-box;
		margin-top: 10px;
		font: bold;
	}
	.headername {
		margin-top: 20px;
	}
	
</style>
