<template>
  <div class="progress-wrapper">
    <div class="progress-bar-wrapper">
      <div
        class="progress-bar"
        ref="progressBar"
        @mouseenter="onBar = true"
        @mouseleave="onBar = false"
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
                  v-show="!disabled && showProgressBtn"
                  @mousedown="dragSet($event)"
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
      onBar: false,
      dragEffect: false,
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
    showProgressBtn() {
      return this.isMobile() || this.onBar || this.dragEffect;
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
      if (e.type === "touchstart" || e.type === "mousedown") {
        console.log("touchstart");
        if (this.beforeDrag) this.remainPlayState = this.beforeDrag();
      } else if (e.type === "touchend") {
        console.log("touchend");
        if (this.afterDrag) this.afterDrag(this.remainPlayState);
      } else if (e.type === "touchmove") {
        console.log("touchmove");
        if (this.onDrag) this.safeOnDrag();
        this.setX(e.touches[0].clientX);
      }
    },
  },
  watch: {
    percent() {
      this.$refs.progress.style.width = this.percent * 100 + "%";
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
          background-color: red;
          transition: width 0.2s ease;
          .progress-btn-pos {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(50%, -50%);
            .progress-btn {
              box-sizing: border-box;
              width: 16px;
              height: 16px;
              border: 3px solid white;
              border-radius: 50%;
              background: red;
            }
          }
        }
      }
    }
  }
}
</style>