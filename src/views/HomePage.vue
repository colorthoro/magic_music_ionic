<template>
  <ion-page>
    <ion-menu content-id="main-content">
      <ion-header>
        <div class="head"></div>
      </ion-header>

      <ion-content class="side-content">
        <BindAli></BindAli>
      </ion-content>
    </ion-menu>

    <ion-page id="main-content">
      <ion-header>
        <div class="head">
          <IonMenuButton class="icon"></IonMenuButton>
        </div>
      </ion-header>
      <ion-content class="main-content" :scroll-y="false">
        <UnderlineNav
          :titles="allLists"
          :titleDecorator="isInnerList"
          v-model:activeTitle="nowList"
        ></UnderlineNav>
        <SongList :activeListName="nowList"></SongList>
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
import {
  IonMenu,
  IonPage,
  IonContent,
  IonHeader,
  IonMenuButton,
} from "@ionic/vue";
import useSongListsStore from "@/store/songLists";
import { mapState } from "pinia";
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
  },
  data() {
    return {
      nowList: "allSongs",
    };
  },
  computed: {
    ...mapState(useSongListsStore, ["allLists", "isInnerList"]),
  },
};
</script>

<style lang="scss" scoped>
.head {
  .icon-wrap {
    .icon {
      color: black;
    }
  }
}
</style>