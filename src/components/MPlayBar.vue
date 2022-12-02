<template>
  <div class="container">
    <div class="song">
      <div class="song-pic">
        <img :src="picUrlReciver.url" />
      </div>
      {{ nowIndex == 0 ? recent?.name : nowSentence }}
    </div>
    <div class="mode">
      <!-- <span class="time">
        {{ formalTime(currentTime) }}|{{ formalTime(duration) }}
      </span> -->
      <div style="position: relative">
        <font-awesome-icon
          @click="this.audio && onOff()"
          v-if="!this.audio || this.audio.paused"
          icon="fa-solid fa-circle-play"
          :style="{ color: loading ? '#cfa3a3' : 'red' }"
          style="background-color: white; border-radius: 50%"
        />
        <font-awesome-icon
          @click="onOff"
          v-else
          icon="fa-solid fa-circle-pause"
          :style="{ color: loading ? '#cfa3a3' : 'red' }"
          style="background-color: white; border-radius: 50%"
        />
        <loading-acc
          v-if="loading"
          stroke="red"
          style="
            display: block;
            margin: 0;
            height: 35px;
            width: 35px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        ></loading-acc>
      </div>
      <!-- <div class="volume">
        <div class="icon" @click="if (audio) audio.muted = !audio.muted;">
          <font-awesome-icon
            icon="fa-solid fa-volume-xmark"
            v-if="audio?.muted"
          />
          <font-awesome-icon
            icon="fa-solid fa-volume-high"
            v-else-if="volumeControll > 50"
          />
          <font-awesome-icon
            icon="fa-solid fa-volume-low"
            v-else-if="volumeControll > 0"
          />
          <font-awesome-icon
            icon="fa-solid fa-volume-off"
            v-else-if="volumeControll === 0"
          />
        </div>
        <div class="volume-percent">
          <ProgressSlider
            :disabled="!audio"
            :max="100"
            v-model="volumeControll"
          ></ProgressSlider>
        </div>
      </div> -->
      <!-- <div class="order" @click="nowOrder++">
        <font-awesome-layers>
          <font-awesome-icon
            v-if="playOrder === 'random'"
            icon="fa-solid fa-shuffle"
          />
          <font-awesome-icon v-else icon="fa-solid fa-repeat" />
          <font-awesome-icon
            v-if="playOrder === 'one'"
            icon="fa-solid fa-1"
            transform="shrink-10"
          />
        </font-awesome-layers>
      </div> -->
      <el-popover
        placement="top-start"
        width="90vw"
        trigger="click"
        :hide-after="0"
        transition="el-zoom-in-bottom"
        :persistent="false"
        :teleported="false"
        @before-enter="mountList"
        @hide="unmountList"
      >
        <template #reference>
          <div>
            <font-awesome-icon icon="fa-solid fa-bars"> </font-awesome-icon>
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
      :beforeDrag="() => !audio.paused"
      :onDrag="() => onOff(0, false)"
      :afterDrag="(remain) => onOff(0, remain)"
      v-model="currentTimeControll"
    ></ProgressSlider>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapState, mapWritableState, mapActions } from "pinia";
import usePlayingQStore from "../store/playingQ";
import useLyricStore from "../store/lyric";
import usePicsStore from "../store/pics";
import ProgressSlider from "../base/ProgressSlider.vue";
const PlayList = defineAsyncComponent(() => import("./PlayList.vue"));

export default {
  name: "MPlayBar",
  components: {
    PlayList,
    ProgressSlider,
  },
  props: {
    height: {
      type: String,
      default: "fit-content",
    },
  },
  data() {
    return {
      timeout: null,
      callPlayList: false,
      picUrlReciver: { id: 0, url: require("@/assets/background.png") },
    };
  },
  computed: {
    ...mapWritableState(usePlayingQStore, ["nowOrder"]),
    ...mapState(usePlayingQStore, [
      "playOrder",
      "audio",
      "currentTime",
      "duration",
      // "volume",
      "fetching",
      "waiting",
      "recent",
    ]),
    ...mapState(useLyricStore, ["nowSentence", "nowIndex"]),
    // volumeControll: {
    //   get() {
    //     return parseInt(this.volume * 100);
    //   },
    //   set(val) {
    //     if (this.audio) this.audio.volume = val / 100;
    //   },
    // },
    currentTimeControll: {
      get() {
        return this.currentTime;
      },
      set(val) {
        if (this.audio) this.audio.currentTime = val;
      },
    },
    loading() {
      return !!this.fetching || this.waiting;
    },
  },
  methods: {
    ...mapActions(usePlayingQStore, ["onOff", "next", "last"]),
    ...mapActions(usePicsStore, ["getPicUrl", "losePicUrl"]),
    unmountList() {
      this.timeout = setTimeout(() => (this.callPlayList = false), 3000);
    },
    mountList() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.callPlayList = true;
    },
  },
  watch: {
    recent: {
      immediate: true,
      handler() {
        this.losePicUrl(this.picUrlReciver.url);
        this.getPicUrl(this.recent, this.picUrlReciver);
      },
    },
  },
  beforeUnmount() {
    delete this.picUrlReciver.id;
    clearTimeout(this.timeout);
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  position: relative;
  justify-content: space-between;
  height: v-bind("height");
  width: 100%;
  height: 55px;
  z-index: 99;
}
.song {
  display: flex;
  flex: 1;
  color: gray;
  align-items: center;
  padding-left: 1rem;
  overflow: hidden;
  height: 100%;
  .song-pic {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 10px;
    margin-right: 20px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      &:hover {
        filter: blur(5px);
      }
    }
  }
}

.mode {
  display: flex;
  flex: 0 0 20%;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
}
.mode * + * {
  margin-left: 15px;
}

.fa-circle-play,
.fa-circle-pause {
  display: block;
  color: red;
  height: 30px;
  cursor: pointer;
}
.fa-bars {
  height: 1.2rem;
  vertical-align: bottom;
}
</style>