<template>
  <IonPage>
    <IonInput placeholder="请输入用户名" v-model="name"> </IonInput>
    <IonButton @click="clickHandler">开始绑定</IonButton>
    {{ statusDescription }}
    <div v-if="loginImgUrl"><IonImg :src="loginImgUrl"></IonImg></div>
  </IonPage>
</template>

<script>
import { mapState, mapActions } from "pinia";
import useUserStore from "../store/user";
import { IonPage, IonInput, IonButton, IonImg } from "@ionic/vue";

export default {
  data: () => ({
    name: "",
  }),
  components: {
    IonPage,
    IonInput,
    IonButton,
    IonImg,
  },
  computed: {
    ...mapState(useUserStore, ["loginImgUrl", "statusDescription"]),
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

<style>
</style>