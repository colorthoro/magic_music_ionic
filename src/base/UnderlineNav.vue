<template>
  <div class="nav">
    <!-- 标题列表 -->
    <div class="nav-list" ref="scroller" @scroll="update">
      <div
        v-for="(title, index) in titles"
        :key="index"
        :ref="'title' + index"
        :class="{ active: index === activeIndex }"
        @click="changeTitle(index)"
        @dblclick="dbclickHandler(title)"
      >
        {{ titleDecorated(title) }}
      </div>
    </div>
    <!-- 下划线 -->
    <div class="nav-line">
      <div
        :style="{
          transform: 'translateX(' + translateX + 'px) translateX(-50%)',
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import { debounce } from "throttle-debounce";
export default {
  props: {
    titles: {
      type: Array,
      default: () => ["全部", "最近播放"],
    },
    titleDecorator: {
      type: Function,
      default: null,
    },
    activeTitle: {
      type: String,
      default: "",
    },
    dbclickHandler: {
      type: Function,
      default: console.log,
    },
  },
  emits: ["update:activeTitle"],
  data() {
    return {
      translateX: 0,
    };
  },
  computed: {
    activeIndex: {
      get() {
        return this.activeTitle === ""
          ? 0
          : this.titles.indexOf(this.activeTitle);
      },
      set(index) {
        if (index === this.activeTitle) return;
        this.$emit("update:activeTitle", this.titles[index]);
      },
    },
    update() {
      return debounce(20, () => {
        this.setUnderLine(
          this.$refs["title" + this.activeIndex][0].getBoundingClientRect()
        );
      });
    },
  },
  methods: {
    changeTitle(index) {
      this.activeIndex = index;
    },
    setUnderLine({ left, width }) {
      let halfWidth = (width / 2).toFixed(2);
      this.translateX = Number(halfWidth) + Number(left);
    },
    titleDecorated(title) {
      let name;
      if (this.titleDecorator) {
        name = this.titleDecorator(title);
      }
      return name ? name : title;
    },
  },
  watch: {
    activeIndex() {
      let now = this.$refs["title" + this.activeIndex][0];
      let rect = now.getBoundingClientRect();
      if (rect.left < 0 || rect.right > innerWidth + 10) {
        this.$refs.scroller.scrollTo({
          top: 0,
          left:
            now.offsetLeft -
            this.$refs.scroller.clientWidth / 2 +
            now.clientWidth / 2,
          behavior: "smooth",
        });
      } else this.setUnderLine(rect);
    },
  },
  mounted() {
    setTimeout(() => {
      this.setUnderLine(
        this.$refs["title" + this.activeIndex][0].getBoundingClientRect()
      );
    }, 200);
  },
};
</script>

<style lang='scss' scoped>
.nav {
  position: relative;
  font-size: 1.2rem;
  .nav-list {
    width: 100%;
    overflow: auto;
    display: flex;
    align-items: center;
    height: 2em;
    font-weight: bold;
    white-space: nowrap;
    color: gray;
    &::-webkit-scrollbar {
      display: none;
    }
    & > div {
      padding: 0 1rem;
    }
    .active {
      transform: scale(1.2);
      color: black;
      transition: transform 0.3s ease;
    }
  }
  .nav-line {
    margin: 0 auto;
    & > div {
      width: 20px;
      height: 5px;
      position: relative;
      top: -5px;
      border-radius: 5px;
      background: red;
      transition: 0.3s ease;
    }
  }
}
</style>
