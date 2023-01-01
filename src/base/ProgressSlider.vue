<template>
  <div class="progress-wrapper">
    <div class="progress-bar-wrapper">
      <div
        class="progress-bar"
        ref="progressBar"
        @click="this.setX($event.clientX)"
      >
        <div class="bar-inner">
          <div class="progress" ref="progress">
            <div class="progress-btn-pos">
              <transition
                enter-active-class="animate__animated animate__zoomIn"
                leave-active-class="animate__animated animate__zoomOut"
              >
                <div
                  class="progress-btn"
                  :class="{ dragging }"
                  v-show="!disabled"
                  @touchstart="dragSet($event)"
                  @touchmove="dragSet($event)"
                  @touchend="dragSet($event)"
                ></div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { throttle } from "throttle-debounce";
export default {
  data() {
    return {
      remainPlayState: undefined,
      dragging: false,
    };
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 1,
      isValid(v) {
        return v > 0;
      },
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    beforeDrag: {
      type: Function,
      defalut: null,
    },
    onDrag: {
      type: Function,
      defalut: null,
    },
    afterDrag: {
      type: Function,
      defalut: null,
    },
    afterClick: {
      type: Function,
      default: null,
    },
  },
  computed: {
    cursor() {
      return this.disabled ? "default" : "pointer";
    },
    safeOnDrag(...args) {
      return throttle(1000, () => this.onDrag(...args), { noTrailing: true });
    },
    percent: {
      get() {
        return this.modelValue / this.max;
      },
      set(val) {
        let update = val * this.max;
        if (update !== this.modelValue) this.$emit("update:modelValue", update);
      },
    },
  },
  methods: {
    setX(x) {
      if (this.disabled) return;
      let rect = this.$refs.progressBar.getBoundingClientRect();
      this.percent = Math.min(1, Math.max(0, (x - rect.x) / rect.width));
      if (this.afterClick) this.afterClick();
    },
    dragSet(e) {
      if (this.disabled) return;
      e.preventDefault();
      if (e.type === "touchstart") {
        console.log("touchstart");
        if (this.beforeDrag) this.remainPlayState = this.beforeDrag();
        this.dragging = true;
      } else if (e.type === "touchend") {
        console.log("touchend");
        if (this.afterDrag) this.afterDrag(this.remainPlayState);
        this.dragging = false;
      } else if (e.type === "touchmove") {
        console.log("touchmove");
        if (this.onDrag) this.safeOnDrag();
        this.setX(e.touches[0].clientX);
      }
    },
  },
  beforeUnmount() {
    this.safeOnDrag.cancel();
  },
};
</script>

<style lang="scss" scoped>
.progress-wrapper {
  width: 100%;
  align-items: center;
  .progress-bar-wrapper {
    .progress-bar {
      height: 15px;
      cursor: v-bind(cursor);
      .bar-inner {
        position: relative;
        top: 50%;
        height: 2px;
        transform: translate(0, -50%);
        background: rgba(0, 0, 0, 0.05);
        .progress {
          position: absolute;
          height: 100%;
          width: 100%;
          background-color: red;
          transform-origin: left;
          transform: v-bind("`scaleX(${percent})`");
          transition: transform 0.2s ease;
        }
        .progress-btn-pos {
          position: absolute;
          top: 50%;
          left: 0v-bind(" percent * 100 + '%' ");
          transform: translate(-50%, -50%);
          .progress-btn {
            width: 16px;
            height: 16px;
            border: 2px solid white;
            border-radius: 50%;
            background: red;
            transition: transform 0.2s ease;
            transform: scale(0.8);
          }
          .dragging {
            transform: scale(1.2);
          }
        }
      }
    }
  }
}
</style>