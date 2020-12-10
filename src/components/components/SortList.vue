<template>
  <div class="container">
    <template v-if="renderList.length != 0">
      <transition-group name="list">
        <span
          v-for="(item, index) of renderList"
          :key="item[unique] || index"
          class="item"
          @click.stop="onClick(index)"
        >
          <slot :item="renderList[index]" class="slot"></slot>
          <Icon
            :size="20"
            :color="arrowEnable(index, true) ? '#2d8cf0' : '#c5c8ce'"
            type="md-arrow-dropleft-circle"
            :title="arrowEnable(index, true) ? '前移' : '已经是第一个'"
            @click.stop="onMove(index, true)"
          />
          <Icon
            :size="20"
            :color="arrowEnable(index, false) ? '#2d8cf0' : '#c5c8ce'"
            type="md-arrow-dropright-circle"
            :title="arrowEnable(index, false) ? '后移' : '已经是最后'"
            @click.stop="onMove(index, false)"
          />
          <Icon
            :size="20"
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
    return { renderList: [] };
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
      default: "id"
    }
  },
  mounted() {
    this.renderList = JSON.parse(JSON.stringify(this.list));
    // console.log(this.renderList);
  },
  watch: {
    list(newValue, oldValue) {
      this.renderList = JSON.parse(JSON.stringify(newValue));
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
        oldValue: JSON.parse(JSON.stringify(this.renderList)),
        newValue: JSON.parse(JSON.stringify(tp)),
        uniqueKeys,
        type: "move"
      });
      this.renderList = tp;
    },
    onClose(index) {
      let tp = JSON.parse(JSON.stringify(this.renderList));
      tp.splice(index, 1);
      let uniqueKeys = new Array();
      for (let p of tp) {
        uniqueKeys.push(p[this.unique]);
      }
      this.$emit("on-change", {
        oldValue: JSON.parse(JSON.stringify(this.renderList)),
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
}
.slot {
  font-size: 20px;
}
.list-move {
  transition: transform 1s;
}
</style>
