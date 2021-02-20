<template>
  <div>
    <div>
      <h3 class="title">请选择一个模块</h3>
      <div>
        <span
          v-for="(value, key) in modulars"
          :key="key"
          :class="{ item: true, 'item-active': key == selectedModularId }"
          @click="selectModular(key)"
        >
          {{ value.name }}
        </span>
      </div>
      <h3 class="title">请选择一个课程</h3>
      <div>
        <template v-if="lessons.length == 0">
          <span>没有课程</span>
        </template>
        <template v-else>
          <span
            v-for="(item, index) in lessons"
            :key="item.id"
            :class="{ item: true, 'item-active': item.id == selectedLessonId }"
            @click="selectLesson(index)"
          >
            {{ item.name }}
          </span>
        </template>
      </div>
    </div>
    <div>
      <h3 class="title">课程操作</h3>
      <div class="lessons-box">
        <div class="lessons-side">
          TODO:显示已有章节
        </div>
        <div class="lessons-side">
          TODO:显示所有章节文件
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Chapter",
  data() {
    return {
      modulars: [],
      selectedModularId: -1,
      selectedLessonId: -1,
      lessons: []
    };
  },
  mounted() {
    // this.action = this.$server.apiUrl + this.action;
    this.getModulars();
  },
  methods: {
    getModulars() {
      this.axios.post(`manager/lesson/getAllLessons`).then(result => {
        let {
          data: { code, data }
        } = result;
        if (this.$server.isSuccess(code)) {
          this.modulars = data;
        }
      });
    },
    selectModular(key) {
      this.selectedModularId = key;
    },
    selectLesson(index) {
      this.selectedLessonId = this.lessons[index].id;
      // alert(this.selectedModularId + "," + this.selectedLessonId);
    }
  },
  watch: {
    selectedModularId(newValue, oldValue) {
      this.lessons = this.modulars[newValue].lessons;
    }
  },
  computed: {}
};
</script>
<style scoped>
.upload-list {
  padding: 10px 0;
}
.title {
  color: #5cadff;
  padding-left: 1em;
  border-left: 2px solid #5cadff;
  margin: 10px 0;
}
.item {
  margin: 5px;
  border-radius: 5px;
  padding: 5px;
  user-select: none;
  background-color: #eee;
}
.item-active {
  background-color: #5cadff;
  color: #eee;
}
.lessons-box {
  display: flex;
}
.lessons-box .lessons-side {
  flex: 1 1 auto;
}
</style>
