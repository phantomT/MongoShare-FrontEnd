<template>
  <el-row :gutter="20">
    <el-col :span="24" style="box-sizing: border-box;">
      <el-input v-model="inputURL" placeholder="请输入文件URL" class="UploadFromURL" clearable>
        <template slot="prepend">使用URL上传：</template>
        <el-button slot="append" v-loading="loading" type="primary" icon="el-icon-upload2" plain @click="handleUploadURL()">
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
      inputURL: ''
    }
  },
  created() {
  },
  methods: {
    handleUploadURL() { // 上传URL文件的处理函数
      console.log()
    }
  }
}
</script>

<style scoped="scoped">
.UploadOptions {
    margin-bottom: 10px;
}
</style>
