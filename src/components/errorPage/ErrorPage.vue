<template>
  <div>
    404-page not found
    <div>
      <span @click="tokenTest('set')">token_set</span>
      <span @click="tokenTest('get')">token_get</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "ErrorPage",
  methods: {
    tokenTest(mode) {
      this.axios.post(`users/${mode}?count=111&pwd=222`).then(result => {
        console.log(result);
      });
    }
  }
};
</script>
