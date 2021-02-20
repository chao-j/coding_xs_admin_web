<template>
  <div>
    <div class="title-box">
      <h3 class="title">选择模块</h3>
      <span
        :class="{
          modular: true,
          'active-modular': selectedModular == value.id
        }"
        v-for="(value, key) in modulars"
        :value="value.id"
        :key="value.id"
        @click="onSelect(value.id)"
      >
        <span class="id">{{ value.id }}</span> {{ value.name }} (<span
          class="lesson-count"
          >{{ value.lessons.length }}</span
        >)
      </span>
    </div>
    <div class="title-box">
      <h3 class="title">同步课程</h3>
      <template v-if="!showSpin">
        <div>
          <SortList
            :list="lessons"
            v-slot="child"
            unique="id"
            @on-change="onChange"
            @on-click="onLessonSelect"
            @on-save="onSave"
            ref="sortList"
          >
            <span style="font-size: 16px;">{{ child.item.name }}</span>
          </SortList>
        </div>
      </template>
      <template v-else>
        <div><Icon type="ios-loading" /> 数据加载中</div>
      </template>
    </div>
    <div class="title-box">
      <h3 class="title">新建课程</h3>
      <Button
        type="primary"
        :disabled="selectedModular == -1"
        @click="popModal('create')"
        >新建课程</Button
      >
      <span v-if="selectedModular == -1"
        ><Icon type="md-help" color="red" /> 需要选择一个模块</span
      >
      <span v-else
        ><Icon type="md-checkmark" color="green" /> 当前选择模块：{{
          modulars[selectedModular].name
        }}</span
      >
    </div>
    <Modal
      v-model="showModal"
      loading
      @on-ok="setLesson"
      :ok-text="mode == 'create' ? '创建' : '提交修改'"
    >
      <h3 slot="header">{{ mode == "create" ? "新建课程" : "修改课程" }}</h3>
      <Form :model="createForm" inline>
        <FormItem>
          <Input
            v-model="createForm.name"
            placeholder="请输入课程名"
            maxlength="16"
            clearable
          >
          </Input>
        </FormItem>
        <FormItem>
          <Input
            v-model="createForm.desc"
            placeholder="请输入课程描述"
            type="textarea"
            maxlength="80"
            autosize
            clearable
          >
          </Input>
        </FormItem>
      </Form>
      <div class="icon-box">
        <img
          v-for="(item, index) of icons"
          :src="$server.serverUrl + 'upload/lessonicon/' + item.url"
          :key="item.name"
          :class="{
            'active-img': index == createForm.iconIndex
          }"
          @click="iconSelect(index)"
        />
      </div>
    </Modal>
  </div>
</template>
<script>
import SortList from "../components/SortList.vue";
export default {
  name: "Lesson",
  data() {
    return {
      modulars: [],
      selectedModular: -1,
      lessons: [],
      showSpin: false,
      icons: [],
      showModal: false,
      mode: "create",
      createForm: {
        id: "",
        name: "",
        desc: "",
        icon: "",
        iconIndex: -1
      }
    };
  },
  mounted() {
    this.getModulars();
    this.getIcons();
  },
  methods: {
    onSelect(id) {
      this.showSpin = true;
      // if (this.debounceTimer) {
      //   clearTimeout(this.debounceTimer);
      // }
      // this.debounceTimer = setTimeout(() => {

      // }, 600);
      this.selectedModular = id;
      this.lessons = this.modulars[id].lessons;
      this.showSpin = false;
    },
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
    getIcons() {
      this.axios.post(`manager/lesson/getAllLessonIcon`).then(result => {
        let {
          data: { code, data }
        } = result;
        if (this.$server.isSuccess(code)) {
          this.icons = data;
        }
      });
    },
    onChange({ oldValue, newValue, uniqueKeys, type }) {
      // console.log(arr);
      // console.log({ oldValue, newValue, uniqueKeys, type });
    },
    onSave({ oldValue, newValue, uniqueKeys }) {
      this.axios
        .post("manager/lesson/syncLesson", {
          lessons: uniqueKeys.join(","),
          mId: this.selectedModular
        })
        .then(res => {
          let { code, msg } = res.data;
          if (this.$server.isSuccess(code)) {
            this.$Message.success({ content: msg });
            this.lessons = newValue;
            this.modulars[this.selectedModular].lessons = newValue;
          }
        });
    },
    setLesson() {
      let { id, name, desc, icon } = this.createForm;
      this.axios
        .post(`manager/lesson/setLesson`, {
          id,
          name,
          desc,
          icon,
          mId: this.selectedModular
        })
        .then(res => {
          let {
            data: { code, data, msg }
          } = res;
          if (this.$server.isSuccess(code)) {
            this.$Message.success({ content: msg });
            // 如果是创建课程，需要获取返回的id来设置，因为此时是没有id的，直接设置会出错
            let newValue = { id, name, desc, icon };
            let newLessons = this.lessons;
            console.log(newLessons);
            if (!id && data) {
              console.log(id, data.insertId);
              id = data.insertId;
              newLessons.push(newValue);
            } else {
              for (let i = 0; i < newLessons.length; i++) {
                console.log(newLessons[i].id, id);
                if (newLessons[i].id == id) {
                  newLessons.splice(i, 1, newValue);
                  break;
                }
              }
            }
            this.lessons = newLessons;
            this.modulars[this.selectedModular].lessons = newLessons;
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.showModal = false;
          this.createForm = {
            id: "",
            name: "",
            desc: "",
            icon: "",
            iconIndex: -1
          };
        });
    },
    iconSelect(index) {
      if (index == this.createForm.iconIndex) this.createForm.iconIndex = -1;
      else {
        this.createForm.iconIndex = index;
      }
      this.createForm.icon = this.icons[this.createForm.iconIndex].name;
    },
    popModal(modal) {
      this.showModal = true;
      this.mode = modal;

      if (modal == "create") {
        this.createForm = {
          id: "",
          name: "",
          desc: "",
          icon: "",
          iconIndex: -1
        };
      }
      if (modal == "modify") {
      }
    },
    onLessonSelect({ index, item }) {
      const temp = this.icons.map(item => item.url);
      let icon = "default.png";
      for (let p of this.icons) {
        if (p.url == item.url) {
          icon = item.name;
        }
      }
      this.createForm = { ...item, iconIndex: temp.indexOf(item.icon), icon };
      this.popModal("modify");
    }
  },
  computed: {},
  components: {
    SortList
  }
};
</script>
<style scoped>
.icon-box {
  height: 120px;
  overflow-y: scroll;
}
.icon-box img {
  width: 28px;
  height: 28px;
  padding: 2px;
  border: 1px dashed transparent;
  margin: 5px;
}
.icon-box img.active-img {
  border: 1px dashed #888;
}
.modular {
  display: inline-block;
  margin: 5px;
  padding: 5px 10px;
  background-color: #eee;
}
.active-modular {
  background-color: #5cadff;
  color: #fff;
}
.title-box {
  margin: 10px 0;
}
.title {
  color: #5cadff;
  padding-left: 1em;
  border-left: 2px solid #5cadff;
  margin: 10px 0;
}
</style>
