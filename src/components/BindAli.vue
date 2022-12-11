<template>
  <div class="container">
    <img class="avatar" :src="avatarUrl || defaultPicUrl" />
    <el-autocomplete
      v-model="name"
      :fetch-suggestions="querySearch"
      clearable
      fit-input-width
      placeholder="aligoConfig1"
      class="input"
      @change="cancel"
    >
      <template #suffix>
        <el-icon class="el-input__icon"><Edit></Edit></el-icon>
      </template>
    </el-autocomplete>
    <el-input
      v-model="pin"
      type="password"
      show-password
      class="input"
      placeholder="本地密码"
    ></el-input>
    <ion-note style="margin: 1rem 0">{{
      statusDescription || "请输入配置 ID ，不存在则自动创建。"
    }}</ion-note>
    <IonButton @click="clickHandler">开始绑定</IonButton>
    <div v-if="loginImgUrl"><IonImg :src="loginImgUrl"></IonImg></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import useUserStore from "../store/user";
import usePicsStore from "../store/pics";
import {
  // IonInput,
  IonImg,
  // IonLabel,
  // IonItem,
  IonButton,
  IonNote,
} from "@ionic/vue";
import { Edit } from "@element-plus/icons-vue";

export default {
  data: () => ({
    name: "",
    pin: "",
  }),
  components: {
    // IonInput,
    IonButton,
    IonImg,
    // IonLabel,
    // IonItem,
    IonNote,
    Edit,
  },
  computed: {
    ...mapState(useUserStore, [
      "avatarUrl",
      "existedName",
      "loginImgUrl",
      "statusDescription",
    ]),
    ...mapState(usePicsStore, ["defaultPicUrl"]),
  },
  methods: {
    ...mapActions(useUserStore, ["init", "cancel"]),
    clickHandler() {
      if (this.name.length === 0) return;
      this.init(this.name, this.pin);
    },
    querySearch(input, callback) {
      if (!input.length) return [];
      let suggests = this.existedName.filter(
        (name) => name.indexOf(input) === 0
      );
      suggests = suggests.map((item) => ({ value: item }));
      callback(suggests);
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.container {
  width: 80%;
  padding: 5% 0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  .avatar {
    height: 5rem;
    width: 5rem;
    border-radius: 50%;
  }
  &:deep(.el-autocomplete),
  .input {
    width: 80%;
  }
}
</style>