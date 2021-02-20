<template>
  <Tabs v-model="tabValue">
    <TabPane label="课程管理" name="lesson">
      <Lesson></Lesson>
    </TabPane>
    <TabPane label="内容管理" name="chapter">
      <Chapter></Chapter>
    </TabPane>
  </Tabs>
</template>
<script>
import Lesson from "./Lesson.vue";
import Chapter from "./Chapter";
export default {
  name: "Course",
  data() {
    return { tabValue: "lesson" };
  },
  components: {
    Lesson,
    Chapter
  }
};
</script>
<style></style>
