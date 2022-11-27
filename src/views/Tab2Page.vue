<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-button @click="clickHandler">测试按钮</ion-button>
      <ExploreContainer name="Tab 2 page" />
    </ion-content>
  </ion-page>
</template>

<script >
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/vue";
import ExploreContainer from "@/components/ExploreContainer.vue";
import Aligo from "@/tools/aligojs/aligo";

export default defineComponent({
  name: "Tab2Page",
  components: {
    ExploreContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
  },
  data() {
    return {
      /**@type {Aligo} */
      ali: null,
    };
  },
  methods: {
    async clickHandler() {
      let music = await this.ali.searchFiles("刻在", "audio");
      let url = await this.ali.getDownloadUrl(music.items[0].file_id);
      console.log(url);
    },
  },
  mounted() {
    this.ali = new Aligo("test");
  },
  beforeUnmount() {
    console.log("test over");
  },
});
</script>
