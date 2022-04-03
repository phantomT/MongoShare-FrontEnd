<template>
	<div style="height: 100%;">
		<el-row style="margin-top:-18px;margin-left: -20px;margin-right: -20px;">
			<el-col :span="12" class="nav">
				<el-dropdown trigger="click" placement="bottom-start" @command="handleCommandUpload" style="margin-left: 20px;">
					<el-button type="text" icon="el-icon-upload2" v-if="checkedcount==0">上传</el-button>
					<el-button type="text" icon="el-icon-upload2" v-if="checkedcount>0" disabled>上传</el-button>
					
					<el-dropdown-menu slot="dropdown" style="width: 200px;">
						<el-dropdown-item command="uploadFile" icon="el-icon-folder-add">上传文件</el-dropdown-item>
						<el-dropdown-item command="uploadFolder" icon="el-icon-folder-add">上传文件夹</el-dropdown-item>
						<el-dropdown-item command="uploadURL" icon="el-icon-folder-add">URL上传</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				
				<el-button type="text" icon="el-icon-bottom" v-if="checkedcount>0" @click="downloadBatch">打包下载</el-button>
				<el-button type="text" icon="el-icon-bottom" v-if="checkedcount==0" disabled>打包下载</el-button>
				
				<el-button type="text" icon="el-icon-delete" v-if="checkedcount>0 && checkAble==true" @click="deleteBatch">删除</el-button>
				<el-button type="text" icon="el-icon-delete" v-if="checkedcount==0 || checkAble==false" disabled>删除</el-button>
				
				<el-button type="text" icon="el-icon-document-remove" v-if="checkedcount>0 && checkAble==true" @click="moveUI">移动到</el-button>
				<el-button type="text" icon="el-icon-document-remove" v-if="checkedcount==0 || checkAble==false" disabled>移动到</el-button>
				
				<el-button type="text" icon="el-icon-edit" v-if="checkedcount==1 && checkAble==true" @click="renameUI()">重命名</el-button>
				<el-button type="text" icon="el-icon-edit" v-if="checkedcount!=1 || checkAble==false" disabled>重命名</el-button>
			</el-col>
			<el-col :span="12" class="search">
				<el-input v-model="listQuery.description" placeholder="请输入文字" class="searchInput" clearable>
					<el-select slot="prepend" v-model="listQuery.search" clearable placeholder="请选择检索方式" style="width: 150px" class="filter-item">
						<el-option v-for="item in searchMethod" :key="item.key" :label="item.label" :value="item.key" />
					</el-select>
					<el-button slot="append" v-loading="loading" type="primary" icon="el-icon-search" plain @click="handleSearch()">
						搜索
					</el-button>
				</el-input>
			</el-col>
		</el-row>
		<!--================================================================================-->
		<!--路径索引-->
		<el-row>
		  	<el-col :span="24">
				<el-button type="text" size="mini" icon="el-icon-caret-right" v-for="item in items" :key="item" @click="itemClickPrev(item.id)">{{item.name}}</el-button>
			</el-col>
		</el-row>
		
		<!--文件列表-->
		<el-row style="height: 85%;overflow: auto;">
		  	<el-col :span="24">
	  			<el-table v-loading="loading" :data="table.data" :stripe="false" size="small" @selection-change="selectionChange" @sort-change="sortChange">
		  			<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="filename" label="文件名" sortable>
						<template slot-scope="scope">
							<span class="link" @click="itemClickEnter(scope.row.rowindex)">{{scope.row.filename}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="filesize" label="大小" width="160" align="center" sortable>
						<template slot-scope="scope">
							<span v-if="scope.row.filesize!=0">{{scope.row.filesizename}}</span>
							<span v-if="scope.row.filesize==0">-</span>
						</template>
					</el-table-column>
					<el-table-column label="上传者" width="100" align="center">
          				<template slot-scope="scope">
            				<span>{{ scope.row.createusername }}</span>
          				</template>
        			</el-table-column>
					<el-table-column label="下载" width="90" align="center">
          				<template slot-scope="scope">
            				<el-button size="mini" type="text" icon="el-icon-bottom" @click="FileDownload(scope.row)">
                				下载
              				</el-button>
          				</template>
        			</el-table-column>
					<el-table-column prop="createtime" label="修改日期" width="260" align="center" sortable></el-table-column>
				</el-table>
		  	</el-col>
		</el-row>
		<!--================================================================================-->
		<!--换页栏-->
		<el-row>
		  	<el-col :span="24" style="text-align: center;">
		  		<el-pagination
					@size-change="sizechange"
					@current-change="currentchange"
					@prev-click="prevClick"
		      		@next-click="nextClick"
		      		:page-sizes="[10,20,30,40,50]"
		      		:current-page="table.currentpage"
		      		:page-size="table.pagesize"
		      		:total="table.total"
		      		layout="total, sizes, prev, pager, next, jumper">
		    	</el-pagination>	  	
		  	</el-col>
		</el-row>
		<!--================================================================================-->
		<!--弹出框-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width"
			:show-close="true" @close="cancel" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">

			<dlOpen ref="form" v-if="dialog.type=='open'"></dlOpen>
			<dlDownload ref="form" v-if="dialog.type=='download'"></dlDownload>
			<dlRename ref="form" v-if="dialog.type=='rename'" v-on:closeAndRefresh="dialogClose"></dlRename>
			<dlUpURL ref="form" v-if="dialog.type=='urlup'" v-on:closeAndRefresh="dialogClose"></dlUpURL>
			<dlMove ref="form" v-if="dialog.type=='move'" v-on:closeAndRefresh="dialogClose"></dlMove>
			<div slot="footer" class="dialog-footer" v-if="dialog.type=='move'">
    			<el-button @click="cancel()">取 消</el-button>
    			<el-button type="primary" @click="confirm()">确 定</el-button>
  			</div>
		</el-dialog>
		
		<!--上传弹出框-->
		<el-dialog :title="drawer.title" :visible.sync="drawer.visible" :width="drawer.width"
			:show-close="true" @close="drawerClose" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
			<dlUploader ref="uploader" v-if="drawer.type=='uploader'"></dlUploader>
		</el-dialog>	
	</div>
</template>

<script>
	import dlUploader from '../common/dialog_uploader.vue';
	import dlUpURL from '../common/dialog_urlupload.vue';
	import dlDownload from '../common/dialog_download.vue';
	import dlRename from '../common/dialog_rename.vue';
	import dlMove from './dialog_move.vue';
	import dlOpen from '../component/dialog_open.vue';
	
	export default {
		data(){
			return {
				loading:false,
				nickname: sessionStorage.getItem("username"),
				checkAble: true,
				checkedcount:0,
				checkeditems:[],
				items:[
					{"id":"0","name":"全部文件"}
				],
				search:{
					pid:0,
					orderfield:'createtime',
					ordertype:'descending'
				},
				table:{
					data:[],
					currentpage:1,
	      			pagesize:10,
	      			total:0,
				},
				dialog:{
      				width:"",
      				type:"",
      				visible: false,
      				title:''
      			},
      			drawer:{
      				title:'',
      				width:"800px",
      				type:"",
      				visible: false
      			},
				searchMethod: [{ label: '按名称检索', key: '+id' }, { label: '按内容检索', key: '-id' }],
				listQuery: {
					search: undefined,
					description: '',
					page: 1,
					limit: 20
				}
			}
		},
		components:{
			dlUploader,
			dlDownload,
			dlRename,
			dlMove,
			dlOpen,
			dlUpURL
		},
		created(){
			//查询
			this.searchs();
		},
		methods:{
			findList(){
				this.loading=true;
				this.$http.post('disk/file/findList',{
					"pid":this.search.pid,
					"orderfield":this.search.orderfield,
					"ordertype":this.search.ordertype,
					"page":this.table.currentpage,
					"limit":this.table.pagesize,
					//"token":sessionStorage.getItem("token")
				}).then(response => {
					var data=response.body;
					if(data.code==0){
						var rows=data.data.rows;
						if(rows!=null&&rows.length!=0){
							for(var i=0;i<rows.length;i++){
								var d=rows[i];
								d.rowindex=i;
							}
						}					
						this.table.data=rows;
						this.table.total=data.data.totalElements;
					}else{
						this.alertMsg(data.code,data.msg);
					}
					this.loading=false;
				});
			},
			selectionChange(val){ // 勾选checkbox
				this.checkedcount=val.length;
				this.checkeditems=[];
				var eqCount = 0;
				for(var i=0;i<val.length;i++){
					this.checkeditems.push({
						"id": val[i].id,
						"name": val[i].filename
					});
					if(val[i].createusername !== this.nickname && this.nickname !== 'admin') this.checkAble = false;
					else eqCount++;
				}
				if(eqCount === this.checkedcount) this.checkAble = true;
			},
			sortChange(column){ // 按照创建时间排序
				this.search.orderfield=column.prop;
				if(column.order==null){
					column.order="descending";
				}
				this.search.ordertype=column.order;
				this.searchs();
			},
			handleCommand2(command){
				var order="";
				if(this.search.orderfield==command){
					if(this.search.ordertype=="ascending"){
						order="descending";
					}else if(this.search.ordertype=="descending"){
						order="ascending";
					}
				}else{
					order="descending";
				}
				
				this.search.orderfield=command;
				this.search.ordertype=order;
				this.searchs();
			},
			///////////////////////////////////////////////////// 导航栏 /////////////////////////////////////////////////////////
			itemClickPrev(id){
				//条目
				var index=this.items.findIndex(item => {
					if(item.id==id){
						return true;
					}
				});
				
				var newitems=new Array();
				this.items.some((item,i) => {
					if(i<=index){
						newitems.push(item);
					}
				});
				this.items=[];
				this.items=newitems;
				
				//查询
				this.search.pid=id;
				this.searchs();
			},
			itemClickEnter(rowindex){ // 改成预览
				var row=this.table.data[rowindex];
				if(row==null){
					this.alertMsg(1,"您点击的记录不存在");
					return;
				}
				if(row.filetype==0){
					this.items.push({
						"id":row.id,
						"name":row.filename
					});
					this.search.pid=row.id;
					this.searchs();
				}else{
					this.dialog.width="550px";
					this.dialog.title="文件打开";
					this.dialog.visible=true;
					this.dialog.type="open";
					setTimeout(()=>{
						this.$refs.form.setData(row.id,row.filename,row.filesizename,row.filesuffix,row.filemd5);
					},0);
				}
			},
			//////////////////////////////////////////////////// 按钮操作 ////////////////////////////////////////////////////////
			handleCommandUpload(command){
				if(command == "uploadFile"){
					this.uploadUI('file');
				}else if(command == "uploadFolder"){
					this.uploadUI('folder');
				}else if(command == "uploadURL"){
					this.uploadUI('URL');
				}
			},
			uploadUI(type){ // 上传处理函数
				if(type == "file"){
					this.drawer.type = "uploader";
					this.drawer.visible = true;
					this.drawer.title = "上传文件";
				}else if(type == "folder"){
					this.drawer.type = "uploader";
					this.drawer.visible = true;
					this.drawer.title = "上传文件夹";
				}else{
					this.dialog.width="550px";
					this.dialog.title="使用URL上传文件";
					this.dialog.visible=true;
					this.dialog.type="urlup";
				}
				setTimeout(()=>{
					this.$refs.uploader.setData2(this.search.pid,type);
				},0);
			},
			renameUI(){ // 重命名处理函数
				var len=this.checkeditems.length;
				if(len==0){
					alertMsg(1,"请选择记录");
					return;
				}else if(len>1){
					alertMsg(1,"只能选择一条记录");
					return;
				}
				
				this.dialog.width="550px";
				this.dialog.title="重命名";
				this.dialog.visible=true;
				this.dialog.type="rename";
				
				setTimeout(()=>{
					this.$refs.form.showInfo(this.checkeditems[0].id);
				},0);
			},
			moveUI(){ // 移动文件处理函数
				var len=this.checkeditems.length;
				if(len==0){
					alertMsg(1,"请选择记录");
					return;
				}
				this.dialog.width="550px";
				this.dialog.title="移动到";
				this.dialog.visible=true;
				this.dialog.type="move";

				setTimeout(()=>{
					this.$refs.form.setId(JSON.stringify(this.checkeditems));
				},0);
			},
			deleteBatch(){ // 删除处理函数
				this.$confirm('此操作将删除您勾选的记录, 是否继续?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.loading=true;
        			this.$http.post('disk/filecommon/delete',{
						"userid":sessionStorage.getItem("username"),
        				"idjson":JSON.stringify(this.checkeditems),
        				"token":sessionStorage.getItem("token")
        			}).then(response => {
						var data = response.body;
						if(data.code == 0){
							this.searchs();
						}
						this.alertMsg(data.code,data.msg);
        				this.loading=false;
					});
        		});
			},
			downloadBatch(){ // 打包下载处理函数
				var len=this.checkeditems.length;
				if(len==0){
					alertMsg(1,"请选择记录");
					return;
				}
				var title=this.checkeditems[0].name+"等共"+len+"个文件";
				var idjson="";
				for(var i=0;i<this.checkeditems.length;i++){
					if(i==0){
						idjson=this.checkeditems[i].id;
					}else{
						idjson=idjson+","+this.checkeditems[i].id;
					}
				}
				
				this.dialog.width="550px";
				this.dialog.title="文件合并下载";
				this.dialog.visible=true;
				this.dialog.type="download";
				setTimeout(()=>{
					this.$refs.form.setData(idjson,title);
				},0);
			},
			FileDownload(row){ // 下载处理函数
				var idjson = row.id;
				var title = row.filename+"共1个文件";
				this.dialog.width = "550px";
				this.dialog.title = "文件下载";
				this.dialog.visible = true;
				this.dialog.type = "download";
				setTimeout(()=>{
					this.$refs.form.setData(idjson,title);
				},0);
			},
			handleSearch(){ // 搜索处理函数

			},
			///////////////////////////////////////////////////////弹出框///////////////////////////////////////////////////////////
			cancel(){
				this.dialog.visible=false;
				this.dialog.type="";
			},
			confirm(){
				setTimeout(()=>{
					this.$refs.form.save();
				},0);
			},
			dialogClose(){
				this.dialog.visible=false;
				this.dialog.type="";
				this.searchs();
			},
			drawerClose(){
				this.drawer.type="";
				this.drawer.visible=false;
				this.searchs();
			},
			////////////////////////////////////////////////// 换页栏 ////////////////////////////////////////////////////////
			refreshs(){
				this.$confirm('是否刷新列表?', '提示', {
          			confirmButtonText: '确定',
          			cancelButtonText: '取消',
          			type: 'warning'
        		}).then(() => {
        			this.searchs();
        		});
			},
			searchs(){
				this.table.currentpage=1;
				this.findList();
			},
			sizechange(pagesize){
				this.table.pagesize=pagesize;
				this.findList();
			},
			currentchange(currentpage){
				this.table.currentpage=currentpage;
				this.findList();
			},
			prevClick(){
				this.table.currentpage=this.table.currentpage-1;
				this.findList();
			},
			nextClick(){
				this.table.currentpage=this.table.currentpage+1;
				this.findList();
			}
		}
	}
</script>

<style scoped="scoped">
	.link:hover{
		color: blue;
		cursor: pointer;
	}
	.nav{
		background: #FFFFFF;
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #E4E7ED;
	}
	.search{
		background: #FFFFFF;
	}
</style>