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
<style lang="scss">
ion-content {
  --padding-top: 2rem;
}
ion-header + ion-content {
  --padding-top: 0;
}
ion-header {
  padding-top: 2rem;
  height: fit-content;
}
.head {
  height: 4.5em;
  display: flex;
  align-items: center;
  .icon-wrap {
    flex: 0 0 3rem;
    height: 3rem;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon {
      color: white;
      height: 1.5rem;
    }
  }
  .title {
    flex: 1;
    overflow: hidden;
    font-size: 1.5rem;
    color: white;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.empty-bg {
  height: 100px;
  width: 100px;
  background: url("@/assets/no-results.png") center/cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}
</style>