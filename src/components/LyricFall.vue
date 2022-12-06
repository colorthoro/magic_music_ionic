<template>
  <div class="scroller" ref="scroller">
    <div class="plate">
      <div
        @mouseenter="playing = false"
        @mouseleave="playing = true"
        @touchstart="playing = false"
        @touchend="delayGo"
        v-for="(row, index) of lrcRows.rows"
        :class="rowClass(index)"
        @click="setIndex(index), delayGo()"
        :key="index"
        @transitionstart.stop="autoScroll($event)"
      >
        {{ row }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import useLyricStore from "../store/lyric";
import { debounce } from "throttle-debounce";

export default {
  name: "LyricFall",
  data() {
    return { playing: true, fillLrc: "" };
  },
  computed: {
    ...mapState(useLyricStore, ["lrcRows", "nowIndex"]),
    delayGo() {
      return debounce(2000, () => (this.playing = true));
    },
  },
  methods: {
    ...mapActions(useLyricStore, ["setIndex"]),
    rowClass(index) {
      return ["row", index == this.nowIndex ? "now" : ""];
    },
    autoScroll(e) {
      e.preventDefault();
      if (!this.playing) return;
      let now = e.target;
      this.$refs.scroller.scrollTo({
        left: 0,
        top:
          now.offsetTop -
          this.$refs.scroller.clientHeight / 2 +
          now.clientHeight / 2,
        behavior: "smooth",
      });
    },
  },
  beforeUnmount() {
    this.delayGo.cancel();
  },
};
</script>

<style scoped>
.scroller {
  position: relative;
  height: 100%;
  width: 100%;
  margin: 3rem 0;
  overflow: auto;
  font-family: system-ui;
  color: white;
  mask-image: linear-gradient(
    180deg,
    hsla(0, 0%, 100%, 0),
    hsla(0, 0%, 100%, 0.3) 15%,
    #fff 25%,
    #fff 75%,
    hsla(0, 0%, 100%, 0.3) 85%,
    hsla(0, 0%, 100%, 0)
  );
}

.scroller::-webkit-scrollbar {
  display: none;
}

.plate {
  margin: 50% 0;
}

.row {
  width: fit-content;
  margin: 0 auto;
  line-height: 2em;
  text-align: center;
  opacity: 0.5;
  transition: transform 0.2s;
}

.now {
  /* font-size: 1.2em; */
  transform: scale(1.2);
  opacity: 1;
}
</style>