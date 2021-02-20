<template>
  <div class="container">
    <div class="btn-box">
      <Button @click="restore" :disabled="!isChange">还原</Button>
      <Button type="primary" @click="save" :disabled="!isChange">保存</Button>
    </div>
    <template v-if="renderList.length != 0">
      <transition-group name="list">
        <span
          v-for="(item, index) of renderList"
          :key="item[unique]"
          class="item"
          @click.stop="onClick(index)"
        >
          <slot :item="renderList[index]" class="slot"></slot>
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
            :title="closeTitle"
            v-if="closeable"
            @click.stop="onClose(index)"
          />
        </span>
      </transition-group>
    </template>
    <template v-else>
      <span><Icon type="ios-sad-outline" /> 没有数据</span>
    </template>
  </div>
</template>
<script>
export default {
  name: "SortList",
  data() {
    return { renderList: [], isChange: false };
  },
  props: {
    list: {
      type: Array,
      default: () => new Array()
    },
    closeable: {
      type: Boolean,
      default: true
    },
    closeTitle: {
      type: String,
      default: "关闭"
    },
    unique: {
      type: String,
      required: true
    }
  },
  mounted() {
    // this.renderList = JSON.parse(JSON.stringify(this.list));
    // console.log(this.renderList);
  },
  watch: {
    list(newValue, oldValue) {
      this.renderList = JSON.parse(JSON.stringify(newValue));
      this.isChange = false;
    }
  },
  methods: {
    arrowEnable(index, isLeft) {
      if (index == 0 && isLeft) {
        return false;
      }
      if (index == this.renderList.length - 1 && !isLeft) {
        return false;
      }
      return true;
    },
    onMove(index, isLeft) {
      if (!this.arrowEnable(index, isLeft)) {
        this.$Message.warning({ content: "不能再移动了" });
        return;
      }
      this.isChange = true;
      let tp = JSON.parse(JSON.stringify(this.renderList));

      let changeItem = tp[index];
      if (isLeft) {
        tp.splice(index - 1, 2, tp[index], tp[index - 1]);
      } else {
        tp.splice(index, 2, tp[index + 1], tp[index]);
      }
      let uniqueKeys = new Array();
      for (let p of tp) {
        uniqueKeys.push(p[this.unique]);
      }
      this.$emit("on-change", {
        oldValue: JSON.parse(JSON.stringify(this.list)),
        newValue: JSON.parse(JSON.stringify(tp)),
        uniqueKeys,
        type: "move"
      });
      this.renderList = tp;
    },
    onClose(index) {
      let tp = JSON.parse(JSON.stringify(this.renderList));
      tp.splice(index, 1);
      this.isChange = true;
      let uniqueKeys = new Array();
      for (let p of tp) {
        uniqueKeys.push(p[this.unique]);
      }
      this.$emit("on-change", {
        oldValue: JSON.parse(JSON.stringify(this.list)),
        newValue: JSON.parse(JSON.stringify(tp)),
        uniqueKeys,
        type: "close"
      });
      this.renderList = tp;
    },
    onClick(index) {
      this.$emit("on-click", {
        index,
        item: JSON.parse(JSON.stringify(this.renderList[index])),
        type: "close"
      });
    },
    restore() {
      this.renderList = JSON.parse(JSON.stringify(this.list));
      this.isChange = false;
    },
    save() {
      let tp = JSON.parse(JSON.stringify(this.renderList));
      let uniqueKeys = new Array();
      for (let p of tp) {
        uniqueKeys.push(p[this.unique]);
      }
      this.$emit("on-save", {
        oldValue: JSON.parse(JSON.stringify(this.list)),
        newValue: tp,
        uniqueKeys
      });
    }
  }
};
</script>
<style scoped>
.container {
}
.item {
  display: inline-block;
  background-color: #eee;
  margin: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  /* font-size: 16px; */
}
.btn-box {
  margin-bottom: 10px;
  margin-left: 5px;
}
.list-move {
  transition: transform 1s;
}
</style>
