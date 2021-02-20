<template>
  <div class="container">
    <!-- 新建模块 -->
    <div>
      <Form :model="createForm" inline>
        <FormItem>
          <Input
            v-model="createForm.name"
            placeholder="请输入模块名"
            maxlength="16"
            clearable
          >
          </Input>
        </FormItem>
        <FormItem>
          <Input
            v-model="createForm.desc"
            placeholder="请输入模块描述"
            maxlength="80"
            type="textarea"
            autosize
            clearable
          >
          </Input>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="createModular"
            :loading="createForm.loading"
            :disabled="createDisable"
            >创建</Button
          >
        </FormItem>
        <FormItem>
          <Button type="info" @click="getAllModular()">刷新</Button>
        </FormItem>
      </Form>
    </div>
    <!-- 开放模块调整 -->
    <div>
      <div class="modular-panel">
        <h3>
          开放<small>（{{ modularMode }}）</small>
        </h3>
        <transition-group name="flip-list">
          <span
            class="block"
            v-for="(item, index) in openModulars"
            :key="item.id"
            @click="popModal(item)"
            >{{ item.id }} {{ item.name }}
            <Icon
              :color="arrowEnable(index, true) ? '#2d8cf0' : '#c5c8ce'"
              type="md-arrow-dropleft-circle"
              :title="arrowEnable(index, true) ? '前移' : '已经是第一个'"
              @click.stop="onMove(index, true)"
            />
            <Icon
              :color="arrowEnable(index, false) ? '#2d8cf0' : '#c5c8ce'"
              type="md-arrow-dropright-circle"
              :title="arrowEnable(index, false) ? '后移' : '已经是最后'"
              @click.stop="onMove(index, false)"
            />
            <Icon
              color="#ed4014"
              type="md-close-circle"
              title="设为未开放"
              @click.stop="closeModular(index)"
            />
          </span>
        </transition-group>
      </div>
      <div class="modular-panel">
        <h3>未开放</h3>
        <span
          class="block"
          v-for="(item, index) in closeModulars"
          :key="item.id"
          @click="popModal(item)"
          >{{ item.id }} {{ item.name }}
          <Icon
            color="#19be6b"
            type="md-add-circle"
            title="设为开放"
            @click.stop="openModular(index)"
          />
        </span>
      </div>
      <div class="submit-box">
        <Button type="primary" :disabled="!isChange" @click="save"
          >保存更改</Button
        >
        <Button type="primary" :disabled="!isChange" @click="restore"
          >还原</Button
        >
      </div>
    </div>
    <Modal v-model="showModal" title="修改模块" loading @on-ok="modify">
      <Form :model="modForm" inline>
        <FormItem>
          <Input
            v-model="modForm.name"
            placeholder="请输入模块名"
            maxlength="16"
            clearable
          >
          </Input>
        </FormItem>
        <FormItem>
          <Input
            v-model="modForm.desc"
            placeholder="请输入描述"
            maxlength="80"
            type="textarea"
            autosize
            clearable
          >
          </Input>
        </FormItem>
      </Form>
      <p>
        原数据(id:{{ modForm.id }}) 模块名:{{ modForm.oldName }} 模块描述:{{
          modForm.oldDesc || "undefined"
        }}
      </p>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "Modular",
  data() {
    return {
      showModal: false,
      modForm: {
        id: -1,
        oldName: "",
        oldDesc: "",
        name: "",
        desc: ""
      },
      createForm: {
        name: "",
        desc: "",
        loading: false
      },
      closeModulars: [
        // { id: 1, name: "网页开发" },
        // { id: 2, name: "JavaScript" },
        // { id: 3, name: "Blender" }
      ],
      openModulars: [
        // { id: 4, name: "Unity" },
        // { id: 5, name: "GIS" },
        // { id: 6, name: "Unreal" }
      ],
      modularMode: "当前模板空间",
      isChange: false
    };
  },
  mounted() {
    this.getAllModular();
  },
  methods: {
    popModal({ id, name, desc }) {
      this.showModal = true;
      this.modForm = {
        id,
        name,
        desc,
        oldDesc: desc,
        oldName: name
      };
    },
    createModular() {
      let { name, desc } = this.createForm;

      if (name == "") {
        this.$Message.error({ content: "模块名不能为空" });
        return;
      }
      this.createForm.loading = true;
      this.axios
        .post(`manager/lesson/createModular`, { name, desc })
        .then(result => {
          if (this.$server.isSuccess(result.data.code)) {
            this.$Message.success({ content: "模块创建成功" });
            this.createForm = {
              name: "",
              desc: ""
            };
            this.getAllModular();
          }
        })
        .catch(err => {
          this.$Message.error({ content: "模块创建失败：" + err.message });
        })
        .finally(() => {
          this.createForm.loading = false;
        });
    },
    getAllModular() {
      this.axios
        .post(`manager/lesson/getAllModular`)
        .then(result => {
          if (this.$server.isSuccess(result.data.code)) {
            // console.log(result);
            let { modularMode, allModulars, openModulars } = result.data.data;
            this.modularMode = modularMode;
            this.openModulars = openModulars;
            this.closeModulars = allModulars; // 全部模块已经在后端过滤了开放的模块
            // this.closeModulars = allModulars.filter(val => {
            //   let isOpen = false;
            //   for (let i = 0; i < openModulars.length; i++) {
            //     let temp = val.id == openModulars[i].id;
            //     if (temp) {
            //       isOpen = true;
            //       break;
            //     }
            //   }
            //   return !isOpen;
            // });
            this.oldClose = JSON.parse(JSON.stringify(this.closeModulars));
            this.oldOpen = JSON.parse(JSON.stringify(this.openModulars));
            // for (let p in allModulars) {
            //   console.log(p);
            // }
          }
        })
        .catch(err => {
          this.$Message.error({ content: "获取模块信息失败：" + err.message });
        });
    },
    arrowEnable(index, isLeft) {
      if (index == 0 && isLeft) {
        return false;
      }
      if (index == this.openModulars.length - 1 && !isLeft) {
        return false;
      }
      return true;
    },
    onMove(index, isLeft) {
      if (!this.arrowEnable(index, isLeft)) {
        this.$Message.warning({ content: "不能再移动了" });
        return;
      }

      let tp = this.openModulars[index];
      this.isChange = true;
      if (isLeft) {
        this.$set(this.openModulars, index, this.openModulars[index - 1]);
        this.$set(this.openModulars, index - 1, tp);
      } else {
        this.$set(this.openModulars, index, this.openModulars[index + 1]);
        this.$set(this.openModulars, index + 1, tp);
      }
    },
    restore() {
      // console.log(JSON.stringify(this.openModulars));
      this.openModulars = JSON.parse(JSON.stringify(this.oldOpen));
      this.closeModulars = JSON.parse(JSON.stringify(this.oldClose));
      // console.log(JSON.stringify(this.openModulars));
    },
    save() {
      let modulars = new Array();
      for (let m of this.openModulars) {
        modulars.push(m.id);
      }
      // console.log(modulars.join(","));
      const includeIDs = modulars.join(",");
      this.axios
        .post(`manager/lesson/syncModular`, {
          name: this.modularMode,
          openModulars: includeIDs
        })
        .then(result => {
          let { code, msg } = result.data;
          if (this.$server.isSuccess(code)) {
            this.$Message.success({ content: msg });
          }
        })
        .catch(err => {});
    },
    closeModular(index) {
      let tp = this.openModulars[index];
      this.openModulars.splice(index, 1);
      this.closeModulars.push(tp);
      this.isChange = true;
    },
    openModular(index) {
      let tp = this.closeModulars[index];
      this.closeModulars.splice(index, 1);
      this.openModulars.push(tp);
      this.isChange = true;
    },
    modify() {
      const { name, id, desc, oldName, oldDesc } = this.modForm;
      this.showModal = false;

      if (name == oldName && desc == oldDesc) {
        this.$Message.warning({ content: "模块未修改" });
        return;
      }
      this.axios
        .post("manager/lesson/setModular", { id, name, desc })
        .then(result => {
          let { code, msg } = result.data;
          if (this.$server.isSuccess(code)) {
            this.$Message.success({ content: msg });
            this.getAllModular();
          }
        });
    }
  },
  computed: {
    createDisable() {
      let { name, loading } = this.createForm;
      return name == "" || loading;
    }
  }
};
</script>
<style scoped>
.container {
  box-sizing: border-box;
  padding: 10px;
}
.modular-panel {
}
.modular-panel h3 {
  color: #2d8cf0;
  margin: 10px 0;
}
.modular-panel .block {
  display: inline-block;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
  background-color: #eee;
}
.submit-box {
  padding: 20px 0;
}
.flip-list-move {
  transition: transform 1s;
}
</style>
