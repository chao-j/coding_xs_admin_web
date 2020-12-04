<template>
  <div id="app">
    <router-view name="navbar" />
    <router-view name="side" class="side" />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
  height: 100vh;
  /* border: 1px solid red;
  overflow-y: scroll; */
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
}
.side {
  height: 100%;
  width: 100%;
  /* border: 1px solid red; */
  overflow-y: scroll;
}
</style>
