<template>
  <ion-page>
    <ion-content fullscreen :scroll-y="false">
      <div class="container">
        <div class="disc">
          <img class="play-bar-support" src="@/assets/play-bar-support.png" />
          <img
            :class="{ playing }"
            class="play-bar"
            src="@/assets/play-bar.png"
          />
          <div class="img-outer-border" ref="disc">
            <div class="img-outer" ref="discRotate">
              <div class="img-wrap">
                <img :class="{ paused: !playing }" :src="picUrlReciver.url" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { mapState, mapWritableState, mapActions } from "pinia";
import usePlayingQStore from "../store/playingQ";
import useLyricStore from "../store/lyric";
import usePicsStore from "../store/pics";
import { IonPage, IonContent } from "@ionic/vue";
export default {
  name: "PlayCenter",
  components: {
    IonPage,
    IonContent,
  },
  data() {
    return {
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
        this.picUrlReciver.url = require("@/assets/background.png");
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
.disc {
  position: relative;
  padding: 80px $img-left-padding 0 $img-left-padding;

  $support-d: 30px;
  $support-d-half: $support-d / 2;
  .play-bar-support {
    position: absolute;
    left: $img-left-padding + $img-outer-border-d / 2 - $support-d / 2;
    top: -$support-d-half;
    width: $support-d;
    height: $support-d;
    z-index: 2;
  }

  .play-bar {
    position: absolute;
    top: 0;
    left: $img-left-padding + $img-outer-border-d / 2 - 6px;
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
      background: linear-gradient(45deg, #333540, #070708, #333540);
      .img-wrap {
        width: 200px;
        height: 200px;
        flex-shrink: 0;
        img {
          box-shadow: 0 0 10px black;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: rotate 20s linear infinite;
          &.paused {
            animation-play-state: paused;
          }
        }
      }
    }
  }
}
.container {
  @include flex-center;
}
</style>