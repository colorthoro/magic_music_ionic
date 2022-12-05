<template>
  <ion-page>
    <ion-content fullscreen :scroll-y="false">
      <div class="container">
        <div class="disc">
          <div class="play-bar-support" />
          <img
            :class="{ playing }"
            class="play-bar"
            src="@/assets/play-bar.png"
          />
          <div class="img-outer-border" ref="disc">
            <div class="img-outer" ref="discRotate">
              <div class="img-wrap" :class="{ paused: !playing }"></div>
            </div>
          </div>
        </div>
        <LyricFall class="lrc"></LyricFall>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { mapState, mapWritableState, mapActions } from "pinia";
import usePlayingQStore from "../store/playingQ";
import useLyricStore from "../store/lyric";
import usePicsStore from "../store/pics";
import LyricFall from "@/components/LyricFall.vue";
import { IonPage, IonContent } from "@ionic/vue";
export default {
  name: "PlayCenter",
  components: {
    IonPage,
    IonContent,
    LyricFall,
  },
  data() {
    return {
      picUrlReciver: { id: 0, url: require("@/assets/background_square.jpg") },
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
    ...mapState(useLyricStore, ["nowSentence", "nowIndex"]),
  },
  methods: {
    ...mapActions(usePlayingQStore, ["onOff", "next", "last"]),
    ...mapActions(usePicsStore, ["getPicUrl", "losePicUrl"]),
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
  mounted() {},
  beforeUnmount() {
    delete this.picUrlReciver.id;
  },
};
</script>

<style lang='scss' scoped>
ion-content::part(background) {
  $d: -60px;
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

.container {
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
    top: -$support-d-half;
    width: $support-d;
    height: $support-d;
    z-index: 2;
    border-radius: 50%;
    background: radial-gradient(#80808080 5px, #ffffff80 5px),
      linear-gradient(rgb(52, 52, 52), white);
  }

  .play-bar {
    position: absolute;
    top: 2px;
    left: $img-left-padding + $img-outer-border-d / 2 - 5px;
    width: 100px;
    z-index: 1;
    transform-origin: 0 0;
    transform: rotate(-30deg);
    transition: all 0.3s;

    &.playing {
      transform: rotate(3deg);
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