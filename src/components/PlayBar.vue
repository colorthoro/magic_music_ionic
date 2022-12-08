<template>
  <div class="container">
    <div class="mode">
      <div class="order" @click="nowOrder++">
        <font-awesome-layers>
          <font-awesome-icon
            v-if="playOrder === 'random'"
            icon="fa-solid fa-shuffle"
            style="height: 1.5rem"
            inverse
          />
          <font-awesome-icon
            v-else
            icon="fa-solid fa-repeat"
            style="height: 1.5rem"
            inverse
          />
          <font-awesome-icon
            v-if="playOrder === 'one'"
            icon="fa-solid fa-1"
            transform="shrink-10 right-3.9"
            inverse
          />
        </font-awesome-layers>
      </div>
    </div>
    <div class="controlls">
      <font-awesome-icon
        @click="last"
        icon="fa-solid fa-backward-step"
        class="red-hover"
        style="height: 1.5rem"
        inverse
      />
      <div style="position: relative">
        <font-awesome-icon
          v-if="!playing"
          @click="recent && onOff()"
          icon="fa-solid fa-circle-play"
          :class="{ loading }"
          class="red-hover"
          style="
            color: white;
            background-color: transparent;
            border-radius: 50%;
          "
        />
        <font-awesome-icon
          v-else
          @click="onOff"
          icon="fa-solid fa-circle-pause"
          :class="{ loading }"
          class="red-hover"
          style="
            color: white;
            background-color: transparent;
            border-radius: 50%;
          "
        />
        <loading-acc
          v-if="loading"
          stroke="red"
          style="
            display: block;
            margin: 0;
            height: 45px;
            width: 45px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        ></loading-acc>
      </div>
      <font-awesome-icon
        @click="next"
        icon="fa-solid fa-forward-step"
        class="red-hover"
        style="height: 1.5rem"
        inverse
      />
    </div>
    <div class="mode">
      <el-popover
        placement="top-start"
        width="90vw"
        trigger="click"
        :hide-after="0"
        transition="el-zoom-in-bottom"
        :persistent="true"
        @before-enter="mountList"
        @hide="unmountList"
      >
        <template #reference>
          <div>
            <font-awesome-icon
              icon="fa-solid fa-bars"
              class="red-hover"
              style="height: 1.5rem"
              inverse
            >
            </font-awesome-icon>
          </div>
        </template>
        <PlayList style="height: 65vh" v-if="callPlayList" />
      </el-popover>
    </div>
    <!-- 进度条 -->
    <ProgressSlider
      style="position: absolute; top: 0; transform: translate(0, -50%)"
      :disabled="!audio || loading"
      :max="duration - 1"
      :beforeDrag="() => !paused"
      :onDrag="() => onOff(0, false)"
      :afterDrag="(remain) => onOff(0, remain)"
      v-model="currentTimeControll"
    ></ProgressSlider>
  </div>
</template>

<script>
import { mapState, mapWritableState, mapActions } from "pinia";
import usePlayingQStore from "../store/playingQ";
import ProgressSlider from "../base/ProgressSlider.vue";
import PlayList from "./PlayList.vue";
import { debounce } from "throttle-debounce";

export default {
  name: "MPlayBar",
  components: {
    PlayList,
    ProgressSlider,
  },
  props: {
    height: {
      type: String,
      default: "55px",
    },
  },
  data() {
    return {
      callPlayList: false,
    };
  },
  computed: {
    ...mapState(usePlayingQStore, [
      "playOrder",
      "audio",
      "currentTime",
      "duration",
      "recent",
      "playing",
      "loading",
      "paused",
    ]),
    ...mapWritableState(usePlayingQStore, ["nowOrder"]),
    currentTimeControll: {
      get() {
        return this.currentTime;
      },
      set(val) {
        if (this.audio) this.audio.currentTime = val;
      },
    },
    unmountList() {
      return debounce(3000, () => (this.callPlayList = false));
    },
  },
  methods: {
    ...mapActions(usePlayingQStore, ["onOff", "next", "last"]),
    mountList() {
      this.unmountList.cancel({ upcomingOnly: true });
      this.callPlayList = true;
    },
  },
  beforeUnmount() {
    this.unmountList.cancel();
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  height: v-bind("height");
  z-index: 99;
  display: flex;
  justify-content: space-around;
  &:deep(.bar-inner) {
    background-color: #ffffff80 !important;
  }
}
.controlls {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.mode {
  flex: 0 0 25%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.fa-circle-play,
.fa-circle-pause {
  display: block;
  color: red;
  height: 40px;
  cursor: pointer;
}
.fa-bars {
  height: 1.2rem;
  vertical-align: bottom;
}
.loading {
  color: #ffffff80 !important;
  background-color: #ffffff80 !important;
}
</style>