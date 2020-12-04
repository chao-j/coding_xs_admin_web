<template>
  <div class="container">
    <div class="header">
      <img src="../../assets/logo.png" />
      <span v-if="name == ''">CXS管理平台</span>
      <span v-else class="name">{{ name }}</span>
    </div>
    <Menu active-name="" :open-names="['1']" theme="dark">
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-book" />
          内容管理
        </template>
        <MenuItem name="1-1" to="/modular">模块管理</MenuItem>
        <MenuItem name="1-2">课程管理</MenuItem>
        <MenuItem name="1-3">章节管理</MenuItem>
        <MenuItem name="1-4">上传中心</MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>
<script>
export default {
  name: "NavBar",
  data() {
    return {
      name: ""
    };
  },
  mounted() {}
};
</script>
<style scoped>
.container {
  background-color: #515a6e;
}
.header {
  border-bottom: 1px solid #888;
  height: 30px;
  text-align: left;
  padding-left: 10px;
}
.header img {
  width: 30px;
  height: 30px;
  vertical-align: middle;
}
.header span {
  vertical-align: middle;
  font-weight: bolder;
  color: #fff;
}
.name {
  color: #1cc09f;
}
</style>
