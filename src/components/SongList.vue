<template>
  <div class="container">
    <div
      :style="{ height: headHeight, overflow: 'hidden', position: 'relative' }"
    >
      <transition
        enter-active-class="animate__animated animate__fadeInDown animate__faster"
        leave-active-class="animate__animated animate__fadeOutUp animate__faster"
      >
        <div
          v-if="!showVlistHead"
          class="head"
          :style="{
            height: headHeight,
            position: 'absolute',
            left: '0',
            width: '100%',
          }"
        >
          <div class="icon-wrapper ion-activatable">
            <font-awesome-icon
              @click="play(nowListSongs)"
              icon="fa-solid fa-circle-play"
              class="head-icon label-icon"
              style="color: red; background-color: white; border-radius: 50%"
            />
            <div @click="play(nowListSongs)">播放全部</div>
            <ion-ripple-effect></ion-ripple-effect>
          </div>
          <div class="icon-list">
            <font-awesome-icon
              icon="fa-solid fa-list-check"
              @click="showVlistHead = !showVlistHead"
              class="head-icon red-hover"
            />
          </div>
        </div>
      </transition>
      <transition
        enter-active-class="animate__animated animate__fadeInDown animate__faster"
        leave-active-class="animate__animated animate__fadeOutUp animate__faster"
      >
        <VirtualListHead
          v-if="showVlistHead"
          :style="{
            height: headHeight,
            position: 'absolute',
            left: '0',
            width: '100%',
          }"
          v-model:checkStatus="checkStatus"
        >
          <SongItemAddons
            :config="{
              trashUp: {
                need: activeListName === 'binSongs',
                func: () =>
                  putIntoList($refs.vlist.popCheckedItems(), 'allSongs'),
              },
              del: {
                need: true,
                func: () =>
                  delFromList($refs.vlist.popCheckedItems(), activeListName),
              },
              plus: {
                need: true,
                func: () => callModifyDialog($refs.vlist.popCheckedItems()),
              },
              more: {
                need: true,
                func: () => moreFunc($refs.vlist.popCheckedItems()),
              },
              cloudDown: {
                need: true,
                func: () => cloudDownFunc(),
              },
            }"
          />
          <font-awesome-icon
            class="addons red-hover"
            icon="fa-solid fa-check"
            @click="showVlistHead = !showVlistHead"
          />
        </VirtualListHead>
      </transition>
    </div>
    <div :style="{ height: `calc(100% - ${headHeight})` }">
      <el-auto-resizer>
        <template #default="{ height }">
          <div
            v-if="nowListSongs.length === 0"
            class="empty-bg"
            @click="activeListName === 'allSongs' && getAllSongsFromCloud()"
          >
            <div
              v-if="activeListName === 'allSongs'"
              style="
                position: absolute;
                bottom: -10px;
                transform: translateY(100%);
                color: gray;
              "
            >
              点击扫描云端歌曲
            </div>
          </div>
          <VirtualList
            :height="height"
            :itemHeight="50"
            :showLine="false"
            :list="nowListSongs"
            :needCheck="showVlistHead"
            id_field="file_id"
            v-model:checkStatus="checkStatus"
            ref="vlist"
            class="ion-content-scroll-host"
          >
            <template #default="{ item: song }">
              <SongItem
                :song="song"
                :del="(song) => delFromList([song], activeListName)"
                :delAble="showVlistHead"
                :modiAble="showVlistHead"
                :moreAble="!showVlistHead"
                :moreFunc="moreFunc"
                :restorable="activeListName === 'binSongs'"
              />
            </template>
          </VirtualList>
        </template>
      </el-auto-resizer>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import useSongListsStore from "../store/songLists";
import usePlayingQStore from "../store/playingQ";
import SongItem from "../base/SongItem.vue";
import SongItemAddons from "../base/SongItemAddons.vue";
import VirtualList from "../base/VirtualList.vue";
import VirtualListHead from "../base/VirtualListHead.vue";
import { IonRippleEffect, actionSheetController } from "@ionic/vue";

export default {
  name: "SongList",
  components: {
    SongItem,
    SongItemAddons,
    VirtualList,
    VirtualListHead,
    IonRippleEffect,
  },
  props: {
    activeListName: {
      type: String,
      default: "allSongs",
    },
    headHeight: {
      type: String,
      default: "3rem",
    },
  },
  data() {
    return {
      checkStatus: "noChecked",
      showVlistHead: false,
    };
  },
  computed: {
    ...mapState(useSongListsStore, ["allLists", "targetList", "isInnerList"]),
    nowList() {
      return this.targetList(this.activeListName);
    },
    nowListSongs() {
      return [...this.nowList.values()];
    },
  },
  methods: {
    ...mapActions(useSongListsStore, [
      "putIntoList",
      "delFromList",
      "clearList", // TODO
      "getAllSongsFromCloud",
      "addNewList",
      "delList",
      "callModifyDialog",
    ]),
    ...mapActions(usePlayingQStore, ["play", "addNextPlay", "addQueuePlay"]), // TODO
    async cloudDownFunc() {
      let k = 0;
      this.$message({ message: "开始下载", offset: 50 });
      for (let song of this.$refs.vlist.popCheckedItems()) {
        if ((await song.fetch()) instanceof Blob) {
          console.log(++k);
          this.$message({
            message: song.name + " 下载成功",
            offset: 50,
            type: "success",
          });
        }
      }
      return k;
    }, // TODO
    async moreFunc(songOrSongs) {
      let name = "未知歌曲";
      let songs = [];
      if (songOrSongs instanceof Array) {
        name = songOrSongs[0]?.name + " 等";
        songs = songOrSongs;
      } else {
        name = songOrSongs.name;
        songs = [songOrSongs];
      }
      const actionSheet = await actionSheetController.create({
        header: name,
        subHeader: "请选择操作",
        buttons: [
          {
            text: "删除",
            role: "destructive",
            handler: () => this.delFromList(songs, this.activeListName),
          },
          {
            text: "下一首播放",
            handler: () => this.addNextPlay(songOrSongs),
          },
          {
            text: "添加到队列播放",
            handler: () => this.addQueuePlay(songOrSongs),
          },
          {
            text: "播放",
            handler: () => this.play(songOrSongs),
          },
          {
            text: "收藏到歌单",
            handler: () => this.callModifyDialog(songs),
          },
          {
            text: "取消",
            role: "cancel",
            data: {
              action: "cancel",
            },
          },
        ],
      });
      await actionSheet.present();
      await actionSheet.onDidDismiss();
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  position: relative;
  ion-button {
    position: absolute;
  }
  .head {
    justify-content: space-between;
    .icon-wrapper,
    .icon-list {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .head-icon {
      height: 1.5rem;
      margin-right: 0.5rem;
    }
    .label-icon {
      & + * {
        color: black;
        font-size: 1.2rem;
        font-weight: bolder;
      }
    }
  }
}
</style>