<template>
  <div class="play-list-container">
    <div class="head">
      <span
        :class="{ 'active-black': listOrHistory === 1 }"
        @click="listOrHistory = 1"
      >
        播放列表
      </span>
      <span style="color: var(--netease-number-color)"> | </span>
      <span
        :class="{ 'active-black': listOrHistory === 2 }"
        @click="listOrHistory = 2"
      >
        历史记录
      </span>
    </div>
    <div class="list" v-show="listOrHistory === 1">
      <el-auto-resizer>
        <template #default="{ height }">
          <VirtualList
            :height="height"
            :list="playingQ"
            id_field="file_id"
            :needCheck="false"
            ref="playing-vlist"
            :itemHeight="50"
            :showStripe="true"
            :showLine="false"
          >
            <template #default="{ item: song }">
              <SongItem
                :song="song"
                :del="del"
                :modiAble="false"
                :moreAble="false"
                :delAble="false"
              />
            </template>
          </VirtualList>
        </template>
      </el-auto-resizer>
      <font-awesome-icon
        class="pos red-hover"
        icon="fa-solid fa-crosshairs"
        @click="$refs['playing-vlist'].scrollTo(recent)"
      />
    </div>
    <div class="list" v-show="listOrHistory === 2">
      <el-auto-resizer>
        <template #default="{ height }">
          <VirtualList
            :height="height"
            :list="historyList"
            id_field="file_id"
            :needCheck="false"
            :itemHeight="30"
            :showStripe="true"
            :showLine="false"
          >
            <template #default="{ item: song }">
              <SongItem
                :song="song"
                :showCnt="true"
                :delAble="false"
                :modiAble="false"
                :moreAble="false"
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
import usePlayingQStore from "../store/playingQ";
import SongItem from "../base/SongItem.vue";
import VirtualList from "../base/VirtualList.vue";
export default {
  components: { SongItem, VirtualList },
  data() {
    return {
      listOrHistory: 1,
    };
  },
  computed: {
    ...mapState(usePlayingQStore, ["historyList", "playingQ", "recent"]),
  },
  methods: {
    ...mapActions(usePlayingQStore, ["del"]),
  },
};
</script>

<style lang="scss" scoped>
.play-list-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .head {
    flex: 0 0 10%;
    font-size: 1.2rem;
    span {
      margin-right: 10px;
    }
  }
  .list {
    border-top: 1px solid var(--el-border-color-light);
    width: 100%;
    height: 80%;
    flex: 1;
    cursor: pointer;
    position: relative;
    .pos {
      position: absolute;
      bottom: 20px;
      right: 20px;
      padding: 10px;
      font-size: 20px;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      border: 1px solid var(--el-border-color-light);
    }
  }
}
</style>