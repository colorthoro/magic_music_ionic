<template>
  <el-dialog
    ref="dialog"
    v-model="visible"
    title="添加到歌单"
    width="90%"
    align-center
    center
    append-to-body
  >
    <el-scrollbar max-height="40vh">
      <el-checkbox-group class="vertical-center-flex" v-model="checkedList">
        <el-checkbox
          v-for="list of addableLists"
          :label="list"
          :key="list"
          border
        >
          {{ isInnerList(list) || list }}
        </el-checkbox>
        <el-checkbox disabled border>
          <InputBtn text="点击新建歌单" @res="addNewList"></InputBtn>
        </el-checkbox>
      </el-checkbox-group>
    </el-scrollbar>
    <template #footer>
      <div>
        <el-scrollbar style="margin-bottom: 20px" max-height="20vh">
          <li
            class="sipName"
            v-for="song of modifyDialog.targetSongs"
            :key="song.file_id"
          >
            {{ song.name }}
          </li>
        </el-scrollbar>
        <el-button @click="visible = false">取消</el-button>
        <el-tooltip effect="customized" :disabled="singleSong">
          <template #content>
            <span class="info">
              注意，选中了多个歌曲后，只会将这些歌曲新增到选中的歌单，而不会依据此页面从歌单删除。
            </span>
          </template>
          <el-button type="primary" @click="confirm" :loading="moving">
            确定
          </el-button>
        </el-tooltip>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "pinia";
import useSongListsStore from "../store/songLists";
import InputBtn from "@/base/InputBtn.vue";
export default {
  components: {
    InputBtn,
  },
  data() {
    return {
      moving: false,
      checkedList: [],
    };
  },
  computed: {
    ...mapState(useSongListsStore, [
      "addableLists",
      "isInnerList",
      "modifyDialog",
      "addNewList",
    ]),
    visible: {
      get() {
        return this.modifyDialog.need;
      },
      set(val) {
        this.modifyDialog.need = val;
      },
    },
    singleSong() {
      return this.modifyDialog.targetSongs.length <= 1;
    },
  },
  methods: {
    ...mapActions(useSongListsStore, ["syncTags"]),
    async confirm() {
      this.moving = true;
      await this.syncTags(
        this.modifyDialog.targetSongs,
        this.checkedList,
        this.singleSong
      );
      this.moving = false;
      this.visible = false;
      this.modifyDialog.targetSongs.length = 0;
    },
  },
  watch: {
    visible() {
      if (this.visible) {
        if (this.modifyDialog.targetSongs.length === 1) {
          this.checkedList = [...this.modifyDialog.targetSongs[0].tags];
        } else this.checkedList = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  display: inline-block;
  max-width: 50vw;
}
.sipName {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.vertical-center-flex {
  display: flex;
  flex-direction: column;
  &:deep(.el-checkbox) {
    margin: 0;
  }
}
</style>