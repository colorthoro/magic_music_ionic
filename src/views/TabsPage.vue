<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <transition
        enter-active-class="animate__animated animate__slideInUp animate__faster"
        leave-active-class="animate__animated animate__slideOutDown animate__faster"
      >
        <MPlayBar></MPlayBar>
      </transition>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon :icon="triangle" />
          <ion-label>歌单</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon :icon="ellipse" />
          <ion-label>Tab 2</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon :icon="square" />
          <ion-label>Tab 3</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script >
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { ellipse, square, triangle } from "ionicons/icons";
import MPlayBar from "@/components/MPlayBar.vue";

export default {
  name: "TabsPage",
  components: {
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage,
    IonRouterOutlet,
    MPlayBar,
  },
  setup() {
    return {
      ellipse,
      square,
      triangle,
    };
  },
};
</script>
