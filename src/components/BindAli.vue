<template>
  <IonPage>
    <div class="container">
      <img class="avatar" :src="avatarUrl || defaultPicUrl" />
      <IonItem>
        <IonLabel position="floating">用户名</IonLabel>
        <IonInput placeholder="请输入用户名" v-model="name"> </IonInput>
        <ion-note slot="helper">{{ statusDescription }}</ion-note>
      </IonItem>
      <IonButton @click="clickHandler" class="ion-padding">开始绑定</IonButton>

      <div v-if="loginImgUrl"><IonImg :src="loginImgUrl"></IonImg></div>
    </div>
  </IonPage>
</template>

<script>
import { mapState, mapActions } from "pinia";
import useUserStore from "../store/user";
import usePicsStore from "../store/pics";
import {
  IonPage,
  IonInput,
  IonImg,
  IonLabel,
  IonItem,
  IonButton,
  IonNote,
} from "@ionic/vue";

export default {
  data: () => ({
    name: "",
  }),
  components: {
    IonPage,
    IonInput,
    IonButton,
    IonImg,
    IonLabel,
    IonItem,
    IonNote,
  },
  computed: {
    ...mapState(useUserStore, [
      "loginImgUrl",
      "statusDescription",
      "avatarUrl",
    ]),
    ...mapState(usePicsStore, ["defaultPicUrl"]),
  },
  methods: {
    ...mapActions(useUserStore, ["init"]),
    clickHandler() {
      if (this.name.length === 0) return;
      this.init(this.name);
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.container {
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .avatar {
    height: 5rem;
    width: 5rem;
    border-radius: 50%;
  }
}
</style>