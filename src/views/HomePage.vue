<template>
  <ion-page>
    <ion-menu content-id="main-content">
      <ion-header mode="ios" fade>
        <div class="head side">
          <div class="title">配置项</div>
        </div>
      </ion-header>

      <ion-content class="side-content">
        <BindAli></BindAli>
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
} from "@ionic/vue";
import useSongListsStore from "@/store/songLists";
import { mapState, mapActions } from "pinia";
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
  },
  data() {
    return {
      nowListIndex: 0,
      mainTranslateX: 0,
    };
  },
  computed: {
    ...mapState(useSongListsStore, ["allLists", "isInnerList"]),
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
    ...mapActions(useSongListsStore, ["delList", "addNewList"]),
    dbclickHandler(listName) {
      if (this.isInnerList(listName)) return;
      let confirm = window.confirm(`确认删除歌单 ${listName} 吗？`);
      if (confirm) {
        this.nowList = "allSongs";
        this.delList(listName, confirm);
      }
    },
    outedHandler({ flag, reset }) {
      setTimeout(reset, 1000);
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
    transition: transform 0.5s ease-in-out;
    .list-wrapper {
      width: 100%;
      display: inline-block;
      padding: 0 1rem;
    }
  }
}
</style>