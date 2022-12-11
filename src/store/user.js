import { defineStore } from 'pinia';
import Aligo from '@/tools/aligojs/aligo';
import { alertController } from '@ionic/vue';

const useUserStore = defineStore('user', {
    persist: {
        paths: ['existedInfo']
    },
    state: () => ({
        existedInfo: new Map(),  // [{name:, pin:}] 
        name: '',
        /**@type {Aligo} */
        aligo: null,
        avatarUrl: null,
        loginImgUrl: '',
        statusDescription: '',
        ok: false,
        errHandler: null,
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
                await alert.onDidDismiss();
                this.errHandler();
            })();
        },
        existedName(state) {
            return [...state.existedInfo.keys()];
        }
    },
    actions: {
        init(name, pin) {
            this.cancel();
            if (this.existedInfo.has(name) && pin !== this.existedInfo.get(name)) {
                this.statusDescription = '本地密码错误';
                return;
            }
            this.name = name;
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
                this.avatarUrl = this.aligo.userConfig?.avatar;
                if (this.existedInfo.has(name)) return;
                this.existedInfo.set(name, pin);
            });
            this.aligo.addStatusListener('error', ({ info: e }) => {
                this.loginImgUrl = '';
                this.statusDescription = '绑定失败' + e.toString();
                this.ok = false;
            });
        },
        cancel() {
            this.aligo && this.aligo.quit();
            this.loginImgUrl = '';
            this.statusDescription = '';
            this.ok = false;
            this.avatarUrl = '';
        },
        del() {
            if (this.ok) {
                this.existedInfo.delete(this.name);
            }
        }
    }
});
export default useUserStore;