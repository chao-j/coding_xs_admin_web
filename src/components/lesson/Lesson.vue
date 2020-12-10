<template>
  <div>
    <Form inline>
      <FormItem>
        <Select
          v-model="selectedModular"
          filterable
          placeholder="请选择一个模块"
          not-found-text="没有内容"
          @on-change="onSelect"
          style="width:200px"
        >
          <Option
            v-for="(value, key) in modulars"
            :value="value.id"
            :key="value.id"
            >{{ value.id }} - {{ value.name
            }}{{ value.lessons.length == 0 ? " - (无数据)" : "" }}</Option
          >
        </Select>
      </FormItem>
      <FormItem>
        <Button
          type="primary"
          :disabled="selectedModular == -1"
          @click="popModal('create')"
          >新建课程</Button
        >
      </FormItem>
    </Form>
    <template v-if="!showSpin">
      <div>
        <SortList
          :list="lessons"
          v-slot="child"
          unique="id"
          @on-change="onChange"
          @on-click="onLessonSelect"
        >
          <span style="font-size: 20px;">{{ child.item.name }}</span>
        </SortList>
      </div>
    </template>
    <template v-else>
      <div><Icon type="ios-loading" /> 数据加载中</div>
    </template>
    <Modal v-model="showModal" loading @on-ok="setLesson">
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
            placeholder="请输入模块名"
            maxlength="16"
            clearable
          >
          </Input>
        </FormItem>
      </Form>
      <div class="icon-box">
        <img
          v-for="(item, index) of icons"
          :src="$server.serverUrl + item.url"
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
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.selectedModular = id;
        this.lessons = JSON.parse(JSON.stringify(this.modulars[id].lessons));
        this.showSpin = false;
      }, 600);
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
    onChange(arr) {
      // console.log(arr);
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
            this.getModulars();
          }
        })
        .catch(err => {})
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
</style>
