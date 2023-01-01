<template>
  <ion-page>
    <ion-menu
      @ionWillOpen="sideOn = true"
      @ionDidClose="sideOn = false"
      ref="menu"
      content-id="main-content"
    >
      <ion-header mode="ios" fade>
        <div class="head side">
          <div class="title"></div>
        </div>
      </ion-header>

      <ion-content class="side-content">
        <BindAli class="login" v-if="sideOn"></BindAli>
        <div
          class="others"
          :style="{
            color: binded ? 'black' : 'gray',
          }"
        >
          <div class="item" @click="binded && getAllSongsFromCloud()">
            从云盘扫描
          </div>
          <div class="item" @click="binded && del()">删除当前配置</div>
        </div>
        <div class="others">
          <div class="item" @click="random">关于</div>
          <!-- <IonImg :src="require('@/assets/qrcode.png')"></IonImg> -->
        </div>
      </ion-content>
    </ion-menu>

    <ion-page id="main-content">
      <ion-header mode="ios" fade>
        <div class="head">
          <IonMenuButton class="icon"></IonMenuButton>
          <font-awesome-icon
            icon="fa-solid fa-circle-plus"
            class="red-hover icon"
            @click="addFunc"
          />
        </div>
      </ion-header>
      <ion-content class="main-content" :scroll-y="false">
        <UnderlineNav
          class="nav"
          :titles="allLists"
          :titleDecorator="isInnerList"
          :dbclickHandler="dbclickHandler"
          v-model:activeTitle="nowList"
        ></UnderlineNav>
        <div class="main" ref="main">
          <BounceChange
            class="list-wrapper"
            v-for="(list, index) in allLists"
            :key="list"
            @outed="outedHandler"
            :allowLeft="nowListIndex < allLists.length - 1"
            :allowRight="nowListIndex > 0"
          >
            <SongList
              v-if="nearIndex(index, nowListIndex)"
              :activeListName="list"
            ></SongList>
          </BounceChange>
        </div>
      </ion-content>
      <MPlayBar></MPlayBar>
    </ion-page>
  </ion-page>
</template>

<script>
import SongList from "@/components/SongList.vue";
import useUserStore from "@/store/user";
import BindAli from "@/components/BindAli.vue";
import MPlayBar from "@/components/MPlayBar.vue";
import UnderlineNav from "@/base/UnderlineNav.vue";
import BounceChange from "@/base/BounceChange.vue";
import {
  IonMenu,
  IonPage,
  IonContent,
  IonHeader,
  IonMenuButton,
  alertController,
  // IonImg,
} from "@ionic/vue";
import useSongListsStore from "@/store/songLists";
import { mapState, mapWritableState, mapActions } from "pinia";
export default {
  components: {
    SongList,
    BindAli,
    IonMenu,
    IonPage,
    IonContent,
    IonHeader,
    IonMenuButton,
    MPlayBar,
    UnderlineNav,
    BounceChange,
    // IonImg,
  },
  data() {
    return {
      nowListIndex: 0,
      mainTranslateX: 0,
      sideOn: false,
    };
  },
  computed: {
    ...mapState(useSongListsStore, ["allLists", "isInnerList"]),
    ...mapState(useUserStore, ["ok"]),
    ...mapWritableState(useUserStore, ["errHandler"]),
    binded() {
      return this.ok;
    },
    nowList: {
      get() {
        return this.allLists.length ? this.allLists[this.nowListIndex] : "";
      },
      set(val) {
        this.nowListIndex = this.allLists.indexOf(val);
      },
    },
  },
  methods: {
    ...mapActions(useSongListsStore, [
      "delList",
      "addNewList",
      "getAllSongsFromCloud",
    ]),
    ...mapActions(useUserStore, ["del"]),
    dbclickHandler(listName) {
      if (this.isInnerList(listName)) return;
      let confirm = window.confirm(`确认删除歌单 ${listName} 吗？`);
      if (confirm) {
        this.nowList = "allSongs";
        this.delList(listName, confirm);
      }
    },
    outedHandler({ flag, reset }) {
      setTimeout(reset, 300); // 保持与背景板移动时长相等
      let i = this.nowListIndex - flag;
      console.log(i, flag);
      if (i < 0 || i >= this.allLists.length) return;
      this.nowListIndex -= flag;
    },
    nearIndex(i, baseI) {
      return i > baseI - 2 && i < baseI + 2;
    },
    addFunc() {
      (async () => {
        const alert = await alertController.create({
          header: "新建歌单",
          buttons: ["OK"],
          inputs: [
            {
              placeholder: "歌单名",
              attributes: {
                minlength: 1,
              },
            },
          ],
        });
        await alert.present();
        let res = await alert.onDidDismiss();
        let name = res.data?.values[0];
        name.length && this.addNewList(name);
      })();
    },
    random() {
      this.$message({
        message: "our happiness +1 (๑•̀ㅂ•́)و✧",
        gouping: true,
        type: "success",
      });
    },
  },
  watch: {
    nowListIndex(newV, oldV) {
      console.log(newV, oldV);
      let i = oldV - newV;
      let m = this.$refs.main;
      let w = m.offsetWidth;
      this.mainTranslateX += w * i;
    },
  },
  mounted() {
    let menu = document.querySelector("ion-menu-button");
    this.errHandler = () => {
      !this.sideOn && menu.click();
    };
  },
};
</script>

<style lang="scss" scoped>
.head {
  justify-content: space-between;
  .icon {
    color: gray;
    height: 1.5rem;
    width: 3rem;
  }
  .title {
    color: black;
  }
}
.side {
  .title {
    display: flex;
    justify-content: center;
  }
}
.main-content {
  &::part(scroll) {
    display: flex;
    flex-direction: column;
  }
  .nav {
    flex: 0 0 2rem;
  }
  .main {
    flex: 1;
    height: 80%;
    white-space: nowrap;
    transform: v-bind("`translateX(${mainTranslateX}px)`");
    transition: transform 0.3s ease-in-out;
    .list-wrapper {
      width: 100%;
      display: inline-block;
      padding: 0 1rem;
    }
  }
}
.side-content {
  &::part(background) {
    background: rgb(245, 245, 245);
    $d: -130px;
    position: absolute;
    top: $d;
    right: $d;
    bottom: $d;
    left: $d;
  }
  &::part(scroll) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  & > div {
    background: white;
    width: 80%;
    border-radius: 20px;
  }
  .login {
    flex: 0 0 300px;
  }
  .others {
    flex: 0 0;
    padding: 0.5rem 2rem;
    text-align: center;
    font-size: 1.1rem;
    .item + .item {
      margin-top: 1rem;
    }
  }
}
.item {
  height: 2em;
  line-height: 2em;
}
</style>