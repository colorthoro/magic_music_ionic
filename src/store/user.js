import { defineStore } from 'pinia';
import Aligo from '@/tools/aligojs/aligo';

const useUserStore = defineStore('user', {
    state: () => ({
        name: '',
        /**@type {Aligo} */
        aligo: null,
        loginImgUrl: '',
        statusDescription: '',
    }),
    getters: {

    },
    actions: {
        init(name) {
            this.name = name;
            this.aligo && this.aligo.quit();
            this.aligo = null;
            let aligo = new Aligo(this.name);
            aligo.addStatusListener('waiting', () => {
                this.statusDescription = '等待';
            });
            aligo.addStatusListener('waitingScan', ({ info: url }) => {
                this.loginImgUrl = url;
                this.statusDescription = '等待扫描';
            });
            aligo.addStatusListener('loggedIn', () => {
                this.loginImgUrl = '';
                this.statusDescription = '绑定成功';
                this.aligo = aligo;
            });
            aligo.addStatusListener('error', ({ info: e }) => {
                this.loginImgUrl = '';
                this.statusDescription = '绑定失败' + e.toString();
            });
        },
    }
});
export default useUserStore;