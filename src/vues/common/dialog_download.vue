
<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-card class="box-card" v-loading="loading">
        <div style="text-align: center;">
          <span style="font-size: 16px;">{{ file.title + "等文件" }}</span>
        </div>
        <div style="text-align: center;">
          共<span style="font-size: 12px;color: red;">{{ file.totalsize }}</span>；
          共<span style="font-size: 12px;color: red;">{{ file.foldernum }}</span>个文件夹；
          共<span style="font-size: 12px;color: red;">{{ file.filenum }}</span>个文件
        </div>
        <div v-if="file.isbig==0">
          <div style="text-align: center;margin-top: 20px;">
            <el-input size="small" v-model="downloadname" placeholder="下载名称" style="width: 200px;"></el-input>
            <el-select size="small" v-model="downloadsuffix" placeholder="打包格式" style="width: 100px;"
                       :disabled="packAble">
              <el-option label="zip" value="zip"></el-option>
              <el-option label="rar" value="rar"></el-option>
            </el-select>
            <el-button size="small" type="primary" @click="download">下载</el-button>
            <el-button size="small" type="primary" @click="preview">预览</el-button>
          </div>
        </div>
        <div v-if="file.isbig==1">
          <div style="color: red;text-align: center;">合并文件下载最大支持1G</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
import qs from 'qs';

export default {
  data() {
    return {
      loading: false,
      msg: "",
      idjson: "",
      downloadname: "",
      downloadsuffix: "",
      fileMd5:"",
      packAble: false,
      file: {
        title: "",
        totalsize: "",
        filenum: 0,
        foldernum: 0,
        isbig: 0,
      },
    };
  },
  methods: {
    setData(idjson, title, fileMd5) {
      this.idjson = idjson;
      this.fileMd5 = fileMd5;
      this.file.title = title;
      this.downloadname = title;
      this.getDownloadInfo();
    },
    getDownloadInfo() {
      this.loading = true;
      this.$http.post('disk/fileDownload/getDownloadInfo', {
        "idJson": this.idjson,
        "token": sessionStorage.getItem("token"),
      }).then(response => {
        this.loading = false;
        var data = response.body;
        if (data.code == 0) {
          this.file.totalsize = data.data.totalSizeName;
          this.file.filenum = data.data.fileNum;
          this.file.foldernum = data.data.folderNum;
          this.file.isbig = data.data.isBig;
        } else {
          this.msg = data.msg;
        }
        if (this.file.filenum > 1) {
          this.packAble = false;
        } else {
          this.packAble = true;
        }
        if (this.packAble === true) {
          this.downloadsuffix = "raw";
        }
      });
    },
    download() {
      if (this.downloadname == null || this.downloadname.length == 0) {
        this.alertMsg(1, "请填写下载文件名称");
        return;
      }
      if ((this.downloadsuffix == null || this.downloadsuffix.length == 0) && this.packAble === false) {
        this.alertMsg(1, "请选择下载文件格式");
        return;
      }
      this.loading = true;
      var params = {
        "downloadName": this.downloadname,
        "downloadSuffix": this.downloadsuffix,
        "idJson": this.idjson,
        "token": sessionStorage.getItem("token"),
      };
      axios
          .post(this.baseurl + '/disk/fileDownload/download',
              qs.stringify(params),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                responseType: "blob",
              },
          )
          .then(response => {
            var blob = new Blob([response.data]);
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            if (this.downloadsuffix == "raw") {
              downloadElement.download = this.downloadname;
            } else {
              downloadElement.download = this.downloadname + "." + this.downloadsuffix;
            }
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(href);
          });

      this.loading = false;
    },
    preview() {

      this.loading = true;
      var params = {
        "fileMd5":this.fileMd5,
        "token": sessionStorage.getItem("token"),
      };

      axios
          .post(this.baseurl + '/disk/fileDownload/preview',
              qs.stringify(params),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              },
          )
          .then(response => {
            console.log(response.data);
            let url = "ftp://127.0.0.1/"+response.data.data;
            window.open('http://127.0.0.1:8012/onlinePreview?url='+encodeURIComponent(Base64.encode(url)));
          });

      this.loading = false;
    },
  },
};
</script>

<style>
</style>