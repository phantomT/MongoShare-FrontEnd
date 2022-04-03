<template>
	<el-row :gutter="20">
	  	<el-col :span="24">
	  		<el-card class="box-card" v-loading="loading">
				<div style="text-align: center;">
					<span style="font-size: 12px;margin-right: 10px;">{{file.filename}}</span>
					<span style="font-size: 12px;">{{file.filesize}}</span>
				</div>
				<div style="text-align: center;margin-top: 20px;">
					<el-button size="small" type="primary" @click="download">下载</el-button>
				</div>
	  		</el-card>
	  	</el-col>
	</el-row>
</template>

<script>
	export default{
		data(){
			return {
				loading:false,
				file:{
					id:"",
					filename:"",
					fileicon:"",
					filesize:"",
					filesuffix:"",
					filemd5:""
				},
			}
		},
		methods:{
			setData(id,filename,filesize,filesuffix,filemd5){
				this.file.id=id;
				this.file.filename=filename;
				this.file.filesize=filesize;
				this.file.filesuffix=filesuffix;
				this.file.filemd5=filemd5;
			},
			download(){
				location.href=this.baseurl+"/disk/filedownload/download?fileid="+this.file.id+"&token="+sessionStorage.getItem("token");
			}
		}
	}
</script>

<style>
</style>