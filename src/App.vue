<template>
  <ion-app>
    <ion-router-outlet />
    <AddTo></AddTo>
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import AddTo from "@/components/AddTo.vue";

export default {
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    AddTo,
  },
};
</script>