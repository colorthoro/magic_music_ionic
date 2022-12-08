<template>
  <ion-page>
    <ion-header mode="ios" fade>
      <div class="head" v-if="!fullscreen">
        <div class="icon-wrap" @click="$router.back()">
          <font-awesome-icon class="icon" icon="fa-solid fa-chevron-down" />
        </div>
        <div class="title">{{ recent?.name }}</div>
      </div>
    </ion-header>
    <ion-content :scroll-y="false">
      <transition
        enter-active-class="animate__animated animate__fadeInDown animate__faster"
        leave-active-class="animate__animated animate__fadeOutUp animate__faster"
      >
        <div class="disc" v-if="disc">
          <div class="play-bar-support" />
          <img
            :class="{ playing }"
            class="play-bar"
            src="@/assets/play-bar.png"
          />
          <div class="img-outer-border" ref="disc">
            <div class="img-outer" ref="discRotate">
              <div
                class="img-wrap"
                :class="{ paused: !playing }"
                @click="fullscreen = !fullscreen"
              ></div>
            </div>
          </div>
        </div>
      </transition>
      <LyricFall class="lrc"></LyricFall>
      <transition
        enter-active-class="animate__animated animate__fadeIn animate__faster"
        leave-active-class="animate__animated animate__fadeOut animate__faster"
      >
        <font-awesome-icon
          v-if="fullscreen"
          icon="fa-solid fa-down-left-and-up-right-to-center"
          slot="fixed"
          class="red-hover"
          style="height: 1.5rem; color: #ffffff80; padding: 1rem"
          @click="fullscreen = !fullscreen"
        />
      </transition>
      <transition
        enter-active-class="animate__animated animate__slideInUp animate__faster"
        leave-active-class="animate__animated animate__slideOutDown animate__faster"
      >
        <div style="width: 100%" v-if="!fullscreen">
          <div class="mode">
            <div class="left">
              <font-awesome-icon
                icon="fa-solid fa-heart"
                class="red-hover"
                style="height: 1.5rem"
                :style="{ color: isLiked ? 'red' : '' }"
                @click="
                  () =>
                    isLiked
                      ? delFromList([recent], 'liked')
                      : putIntoList([recent], 'liked')
                "
              />
              <font-awesome-icon
                v-if="existed"
                icon="fa-solid fa-circle-check"
                class="red-hover"
                style="height: 1.5rem"
              />
              <font-awesome-icon
                v-else
                icon="fa-solid fa-cloud-arrow-down"
                class="red-hover"
                style="height: 1.5rem"
                @click="fetchAndUpdate"
              />
            </div>
            <span class="time" @click="disc = !disc">
              <span class="now">{{ formalTime(currentTime) }}</span
              >|<span class="all">{{ formalTime(duration) }}</span>
            </span>
            <div class="right">
              <font-awesome-icon
                icon="fa-solid fa-ellipsis-vertical"
                class="red-hover"
                style="height: 1.5rem"
              />
              <font-awesome-icon
                icon="fa-solid fa-up-right-and-down-left-from-center"
                class="red-hover"
                style="height: 1.5rem"
                @click="fullscreen = !fullscreen"
              />
            </div>
          </div>
          <PlayBar height="6rem"></PlayBar>
        </div>
      </transition>
    </ion-content>
  </ion-page>
</template>

<script>
import { mapState, mapWritableState, mapActions } from "pinia";
import usePlayingQStore from "../store/playingQ";
import useSongListsStore from "@/store/songLists";
import usePicsStore from "../store/pics";
import LyricFall from "@/components/LyricFall.vue";
import PlayBar from "@/components/PlayBar.vue";
import { IonPage, IonContent, IonHeader } from "@ionic/vue";
export default {
  name: "PlayCenter",
  components: {
    IonPage,
    IonContent,
    IonHeader,
    LyricFall,
    PlayBar,
  },
  data() {
    return {
      picUrlReciver: { id: 0, url: require("@/assets/background_square.jpg") },
      existed: false,
      fullscreen: false,
      disc: true,
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
      "recent",
      "playing",
    ]),
    ...mapState(useSongListsStore, ["targetList"]),
    isLiked() {
      return this.recent && this.targetList("liked").get(this.recent.file_id);
    },
  },
  methods: {
    ...mapActions(usePlayingQStore, ["onOff", "next", "last"]),
    ...mapActions(usePicsStore, ["getPicUrl", "losePicUrl"]),
    ...mapActions(useSongListsStore, ["delFromList", "putIntoList"]),
    async fetchAndUpdate() {
      if (!this.recent) return;
      await this.recent?.fetch();
      this.existed = !!(await this.recent?.existed());
    },
  },
  watch: {
    recent: {
      immediate: true,
      handler() {
        this.recent?.existed().then((res) => (this.existed = !!res));
        this.losePicUrl(this.picUrlReciver.url);
        this.getPicUrl(this.recent, this.picUrlReciver);
      },
    },
  },
  mounted() {},
  beforeUnmount() {
    delete this.picUrlReciver.id;
  },
};
</script>

<style lang='scss' scoped>
ion-content::part(background) {
  $d: -130px;
  position: absolute;
  top: $d;
  right: $d;
  bottom: $d;
  left: $d;
  background: v-bind("`url(${picUrlReciver.url})`") center/cover;
  filter: blur(30px);
  transition: all 0.8s;
}
ion-content::part(background)::before {
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.075);
}

ion-content::part(scroll) {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.lrc {
  flex: 1;
}
.mode {
  width: 100%;
  padding-bottom: 1.8rem;
  color: #ffffff80;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .left,
  .right {
    flex: 0 0 35%;
    display: flex;
    justify-content: space-around;
    * {
      width: 2rem;
    }
  }
  .time {
    flex: 1;
    display: flex;
    justify-content: space-around;
    .now,
    .all {
      flex: 0 0 3rem;
    }
  }
}
.disc {
  $img-left-padding: 36px;
  $img-outer-border-d: 312px;
  $img-outer-d: 300px;
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(1turn);
    }
  }
  @mixin round($d) {
    width: $d;
    height: $d;
    border-radius: 50%;
  }
  @mixin flex-center($direction: row) {
    display: flex;
    flex-direction: $direction;
    align-items: center;
    justify-content: center;
  }

  flex: 0 0 auto;
  padding: 80px $img-left-padding 0 $img-left-padding;
  position: relative;

  $support-d: 25px;
  $support-d-half: $support-d / 2;
  .play-bar-support {
    position: absolute;
    left: $img-left-padding + $img-outer-border-d / 2 - $support-d / 2;
    top: 0;
    width: $support-d;
    height: $support-d;
    z-index: 2;
    border-radius: 50%;
    background: radial-gradient(#80808080 5px, #ffffff80 5px),
      linear-gradient(rgb(52, 52, 52), white);
  }

  .play-bar {
    position: absolute;
    top: $support-d-half;
    left: $img-left-padding + $img-outer-border-d / 2 - 5px;
    width: 100px;
    z-index: 1;
    transform-origin: 0 0;
    transform: rotate(-30deg);
    transition: all 0.3s;

    &.playing {
      transform: rotate(-1deg);
    }
  }

  .img-outer-border {
    @include round($img-outer-border-d);
    @include flex-center;
    background: rgba(255, 255, 255, 0.05);

    .img-outer {
      @include round($img-outer-d);
      @include flex-center;
      background: #000;
      background: linear-gradient(
          45deg,
          #09090999 0,
          40%,
          #68686868 50%,
          60%,
          #09090999 100%
        ),
        repeating-radial-gradient(#090909 1px, #000000dd 3px, #090909 4px);
      .img-wrap {
        width: 200px;
        height: 200px;
        flex-shrink: 0;
        background: v-bind("`url(${picUrlReciver.url})`") center/cover;
        border: 3.9px solid #090909;
        border-radius: 50%;
        box-sizing: content-box;
        animation: rotate 20s linear infinite;
        &.paused {
          animation-play-state: paused;
        }
      }
    }
  }
}
</style>