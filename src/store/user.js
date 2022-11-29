import { defineStore } from 'pinia';
import Aligo from '@/tools/aligojs/aligo';

const useUserStore = defineStore('user', {
    state: () => ({
        name: '',
        /**@type {Aligo} */
        aligo: null,
        loginImgUrl: '',
        statusDescription: '',
        ok: false,
    }),
    getters: {
        ali(state) {
            if (state.ok) return state.aligo;
            else console.error('aligojs 还未绑定成功, 请先绑定！');
        }
    },
    actions: {
        init(name) {
            this.name = name;
            this.aligo && this.aligo.quit();
            this.aligo = new Aligo(this.name);
            this.aligo.addStatusListener('waiting', () => {
                this.statusDescription = '等待';
            });
            this.aligo.addStatusListener('waitingScan', ({ info: url }) => {
                this.loginImgUrl = url;
                this.statusDescription = '等待扫描';
            });
            this.aligo.addStatusListener('loggedIn', () => {
                this.loginImgUrl = '';
                this.statusDescription = '绑定成功';
                this.ok = true;
            });
            this.aligo.addStatusListener('error', ({ info: e }) => {
                this.loginImgUrl = '';
                this.statusDescription = '绑定失败' + e.toString();
                this.ok = false;
            });
        },
    }
});
export default useUserStore;