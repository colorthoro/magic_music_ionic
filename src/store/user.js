import { defineStore } from 'pinia';
import Aligo from '@/tools/aligojs/aligo';
import { alertController } from '@ionic/vue';

const useUserStore = defineStore('user', {
    state: () => ({
        existedInfo: new Map([[]]),  // [{name:, pin:}] 
        name: '',
        /**@type {Aligo} */
        aligo: null,
        avatarUrl: null,
        loginImgUrl: '',
        statusDescription: '',
        ok: false,
    }),
    getters: {
        ali(state) {
            if (state.ok) return state.aligo;
            console.error('aligojs 还未绑定成功, 请先绑定！');
            (async () => {
                const alert = await alertController.create({
                    header: 'aligojs 还未绑定成功！',
                    buttons: [
                        {
                            text: '绑定',
                            role: 'confirm',
                        },
                    ],
                });
                await alert.present();
            })();
        }
    },
    actions: {
        check(name, pin) {
            return this.existedInfo.has(name) && pin === this.existedInfo.get(name);
        },
        init(name, pin) {
            this.check(name, pin);
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
                this.existedInfo.set(name, '123456');
                this.avatarUrl = this.aligo.userConfig?.avatar;
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