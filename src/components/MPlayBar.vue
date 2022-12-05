<template>
  <div class="container">
    <div ref="song" class="song">
      <div class="song-pic-wrap">
        <div class="song-pic">
          <img :class="{ paused: !playing }" :src="picUrlReciver.url" />
        </div>
      </div>
      <span>{{ nowIndex == 0 ? recent?.name : nowSentence }}</span>
    </div>
    <div class="mode">
      <!-- <span class="time">
        {{ formalTime(currentTime) }}|{{ formalTime(duration) }}
      </span> -->
      <div style="position: relative">
        <font-awesome-icon
          @click="recent && onOff()"
          v-if="!playing"
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
import { mapState, mapActions } from "pinia";
import usePlayingQStore from "../store/playingQ";
import useLyricStore from "../store/lyric";
import usePicsStore from "../store/pics";
import ProgressSlider from "../base/ProgressSlider.vue";
import PlayList from "./PlayList.vue";
import Hammer from "hammerjs";
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
      mc: null, // hammerjs manager
      callPlayList: false,
      picUrlReciver: { id: 0, url: require("@/assets/background_square.jpg") },
    };
  },
  computed: {
    ...mapState(usePlayingQStore, [
      "playOrder",
      "audio",
      "currentTime",
      "duration",
      // "volume",
      "recent",
      "playing",
      "loading",
      "paused",
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
    panHandler() {
      return debounce(
        500,
        (e) => {
          if (e.additionalEvent === "panleft") this.next();
          else if (e.additionalEvent === "panright") this.last();
        },
        { atBegin: true }
      );
    },
    unmountList() {
      return debounce(3000, () => (this.callPlayList = false));
    },
  },
  methods: {
    ...mapActions(usePlayingQStore, ["onOff", "next", "last"]),
    ...mapActions(usePicsStore, ["getPicUrl", "losePicUrl"]),
    mountList() {
      this.unmountList.cancel({ upcomingOnly: true });
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
  mounted() {
    // 左右滑动切歌
    this.mc = new Hammer.Manager(this.$refs.song);
    this.mc.add(
      new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 })
    );
    this.mc.on("pan", this.panHandler);
  },
  beforeUnmount() {
    delete this.picUrlReciver.id;
    this.mc?.destroy();
    this.panHandler.cancel();
    this.unmountList.cancel();
  },
};
</script>

<style lang="scss" scoped>
@mixin flex-center($direction: row) {
  display: flex;
  flex-direction: $direction;
  align-items: center;
  justify-content: center;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(1turn);
  }
}
.container {
  position: relative;
  width: 100%;
  height: v-bind("height");
  z-index: 99;
  display: flex;
  justify-content: space-between;
}
.song {
  flex: 1;
  height: 100%;
  padding: 0 1rem;
  overflow: hidden;
  color: gray;
  display: flex;
  align-items: center;
  // justify-content: space-around;
  .song-pic-wrap {
    flex-shrink: 0;
    width: 45px;
    height: 45px;
    margin-right: 10px;
    border-radius: 50%;
    background: linear-gradient(
      45deg,
      #090909c9 0,
      45%,
      #525252c9 50%,
      55%,
      #090909c9 100%
    );
    @include flex-center;
    .song-pic {
      width: 30px;
      height: 30px;
      overflow: hidden;
      border-radius: 50%;
      box-shadow: 0 0 10px black;
      @include flex-center;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        animation: rotate 20s linear infinite;
        &.paused {
          animation-play-state: paused;
        }
        &:hover {
          filter: blur(5px);
        }
      }
    }
  }
}

.mode {
  flex: 0 0 20%;
  padding-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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