<template>
  <div
    class="bounce-change-wrapper"
    :class="{ dropped, outed }"
    @touchstart="beginHandler"
    @touchmove="_panHandler"
    @touchend="endHandler"
  >
    <slot></slot>
  </div>
</template>

<script>
import { debounce } from "throttle-debounce";
export default {
  props: {
    minDistance: {
      type: Number,
      default: 20,
    },
    borderDistance: {
      type: Number,
      default: 70,
    },
    outDistance: {
      type: Number,
      default: 500,
    },
    allowLeft: {
      type: Boolean,
      default: true,
    },
    allowRight: {
      type: Boolean,
      default: true,
    },
    droppedTransition: {
      type: Boolean,
      default: true,
    },
    outedTransition: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["outed"],
  data() {
    return {
      triggered: false,
      startX: 0,
      x: 0,
      dropped: false,
      outed: false,
    };
  },
  computed: {
    panHandler() {
      return debounce(20, this._panHandler.bind(this), { atBegin: true });
    },
  },
  methods: {
    beginHandler(e) {
      this.startX = parseInt(e.touches[0].clientX);
      this.dropped = false;
      this.outed = false;
    },
    _panHandler(e) {
      let clientX = parseInt(e.touches[0].clientX);
      let x = clientX - this.startX;
      if (!this.triggered) {
        if (Math.abs(x) < this.minDistance) return;
        this.startX = clientX;
        this.triggered = true;
        return;
      }
      this.x = clientX - this.startX;
    },
    endHandler() {
      this.startX = 0;
      this.triggered = false;
      if (Math.abs(this.x) < this.borderDistance) {
        this.dropped = true;
        this.x = 0;
      } else {
        this.outed = true;
        let flag = this.x < 0 ? -1 : 1;
        if (
          (flag === -1 && !this.allowLeft) ||
          (flag === 1 && !this.allowRight)
        ) {
          this.x = 0;
          return;
        }
        this.x = flag * this.outDistance;
        this.$emit("outed", {
          flag,
          reset: this.reset.bind(this),
        });
      }
      return;
    },
    reset() {
      this.x = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.bounce-change-wrapper {
  height: 100%;
  width: 100%;
  transform: v-bind("`translateX(${x}px)`");
}
.dropped {
  transition: transform 0.3s ease;
}
.outed {
  transition: transform 0.3s ease;
}
</style>