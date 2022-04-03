<template>
	<el-row :gutter="20">
		<el-col :span="24" style="box-sizing: border-box;">
			<el-input v-model="inputFilename" placeholder="请输入文件名" class="UploadFilename" clearable>
				<template slot="prepend">URL上传的文件名：</template>
			</el-input>
			<el-input v-model="inputURL" placeholder="请输入文件URL" class="UploadFromURL" clearable>
				<template slot="prepend">使用URL上传：</template>
				<el-button slot="append" v-loading="loading" type="primary" icon="el-icon-upload2" plain v-if="inputURL && inputFilename" @click="handleUploadURL()">
					上传
				</el-button>
				<el-button slot="append" v-loading="loading" type="primary" icon="el-icon-upload2" plain v-if="!inputURL || !inputFilename" disabled @click="handleUploadURL()">
					上传
				</el-button>
			</el-input>
		</el-col>
	</el-row>
</template>

<script>
export default {
	data() {
		return {
			loading:false,
			inputURL: "",
			inputFilename: "",
			folderid: "",
			urlValid: true,
			nameValid: true
		}
	},
	created() {
	},
	methods: {
		handleUploadURL() { // 上传URL文件的处理函数
			this.urlValidation(this.inputURL);
			this.nameValidation(this.inputFilename);
			if(this.urlValid && this.nameValid){
				this.loading=true;
				this.$http.post('disk/fileupload/urlUp',{
					"userid":sessionStorage.getItem("username"),
					"pid":this.folderid,
					"url":this.inputURL,
					"filename":this.inputFilename,
					"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						this.$emit('closeAndRefresh');
						this.$message({
							message: "URL文件上传成功",
							type: 'success'
						});
					}
					this.loading=false;
				});
			}
		},
		setData(folderid){
			this.folderid = folderid;
		},
		urlValidation(url){
			var strRegex = "^(https|http|ftp|rtsp|mms)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$";
			var re = new RegExp(strRegex);
			if(re.test(url)){
				this.urlValid = true;
			} else {
				this.urlValid = false;
				this.inputURL = "";
				this.$message({
					message: "URL不合法, 请重新输入",
					type: 'warning'
				});
			}
		},
		nameValidation(fname){
			if(fname.length > 64){
				this.inputFilename = "";
				this.$message({
					message: "文件名过长, 请重新输入",
					type: 'warning'
				});
				return;
			}
			var strRegex = "^[^/\\:;*?<>|\"={}]{1,64}$";
			var re = new RegExp(strRegex);
			if(re.test(fname)){
				this.nameValid = true;
			} else {
				this. nameValid = false;
				this.inputFilename = "";
				this.$message({
					message: "文件名不能包含\\/:;*?<>|\"={}等字符, 请重新输入",
					type: 'warning'
				});
			}
		}
	}
}
</script>

<style scoped="scoped">
.UploadOptions {
	margin-bottom: 10px;
}
.UploadFilename {
	margin-bottom: 5px;
}
</style>
