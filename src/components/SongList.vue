<template>
  <VirtualListHead style="height: 2em" v-model:checkStatus="checkStatus">
    <SongItemAddons
      :config="{
        trashUp: {
          need: activeListName === 'binSongs',
          func: () => putIntoList($refs.vlist.popCheckedItems(), 'allSongs'),
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
        },
        cloudDown: {
          need: true,
          func: () => cloudDownFunc(),
        },
      }"
    />
  </VirtualListHead>
  <div style="height: calc(100% - 2em); overflow: auto">
    <el-auto-resizer>
      <template #default="{ height }">
        <VirtualList
          :height="height"
          :list="nowListSongs"
          id_field="file_id"
          v-model:checkStatus="checkStatus"
          ref="vlist"
          class="ion-content-scroll-host"
        >
          <template #default="{ item: song }">
            <SongItem
              :song="song"
              :del="(song) => delFromList([song], activeListName)"
              :restorable="activeListName === 'binSongs'"
            />
          </template>
        </VirtualList>
      </template>
    </el-auto-resizer>
  </div>
  <ion-button
    slot="fixed"
    style="bottom: 0"
    v-if="activeListName === 'allSongs'"
    @click="getAllSongsFromCloud"
  >
    扫描云端
  </ion-button>
  <ion-button
    slot="fixed"
    style="bottom: 0; right: 0"
    @click="play(nowListSongs)"
    >播放当前歌单全部</ion-button
  >
  <div class="main"></div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import useSongListsStore from "../store/songLists";
import usePlayingQStore from "../store/playingQ";
import SongItem from "../base/SongItem.vue";
import SongItemAddons from "../base/SongItemAddons.vue";
import VirtualList from "../base/VirtualList.vue";
import VirtualListHead from "../base/VirtualListHead.vue";
import { IonButton } from "@ionic/vue";

export default {
  name: "SongList",
  components: {
    SongItem,
    SongItemAddons,
    VirtualList,
    VirtualListHead,
    IonButton,
  },
  props: {
    activeListName: {
      type: String,
      default: "allSongs",
    },
  },
  data() {
    return {
      checkStatus: "noChecked",
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
      for (let song of this.$refs.vlist.popCheckedItems()) {
        if ((await song.fetch()) instanceof Blob) console.log(++k);
      }
      return k;
    }, // TODO
  },
  mounted() {},
};
</script>

<style scoped>
.songlists {
  height: 100%;
  width: 100%;
}
.songlists :deep(.el-tabs__header) {
  margin-bottom: 1px;
}
</style>