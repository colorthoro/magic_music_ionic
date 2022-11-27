import cfg from './config';
import QRcode from 'qrcode';
import base64js from 'base64-js';
import { snakeToCamelReviver, snakeToCamelObject } from './tools';
import { HTTP } from '@awesome-cordova-plugins/http';
import { db } from '@/tools/songsCache'


function Base64Decode(str, encoding = 'gb18030') {
    let bytes = base64js.toByteArray(str);
    return new TextDecoder(encoding).decode(bytes);
}
// console.log(Base64Decode(require('./1').bizExt));  // test


export default class Auth {
    constructor(name = 'test') {
        this.name = name;
        this.agent = HTTP;
    }
    async ok() {
        await this._init();
        await (await this.exist() ? this._lazyRefresh() : this._login())
        return { request: this.request.bind(this), userConfig: this.userConfig };
    }
    async _init() {
        let tryRes = await this.request({
            url: cfg.AUTH_HOST + cfg.V2_OAUTH_AUTHORIZE,
            params: {
                'login_type': 'custom',
                'response_type': 'code',
                'redirect_uri': 'https://www.aliyundrive.com/sign/callback',
                'client_id': cfg.CLIENT_ID,
                'state': '{"origin":"file://"}',
            },
            headers: cfg.UNI_HEADERS,
            responseType: 'text',
        })
        return tryRes;
    }
    async _login() {
        let res = await this._loginByQrcode();
        if (res.data?.content?.data?.loginResult !== 'success') {
            console.error('登录失败');
            return;
        }
        let secret = res.data.content.data.bizExt;
        let userConfig = JSON.parse(Base64Decode(secret, 'gb18030'), snakeToCamelReviver).pdsLoginResult;
        await this.saveUserConfig(userConfig);
        return userConfig;
    }
    async _loginByQrcode() {
        let qrcodeRes = await this.request({
            url: cfg.PASSPORT_HOST + cfg.NEWLOGIN_QRCODE_GENERATE_DO,
            params: cfg.UNI_PARAMS,
        });
        console.log('qrcodeRes\n', qrcodeRes.status, qrcodeRes.data, qrcodeRes.text);
        let data = qrcodeRes.data?.content?.data;
        let codeContent = data.codeContent;
        //TODO:
        QRcode.toDataURL(codeContent, (_, url) => {
            console.log(url);
        });
        // eslint-disable-next-line
        while (1) {
            let okRes = await this.request({
                url: cfg.PASSPORT_HOST + cfg.NEWLOGIN_QRCODE_QUERY_DO,
                method: 'post',
                sendType: 'urlencoded',
                data: { ...cfg.UNI_PARAMS, ...data },
            })
            console.log('查询请求\n', okRes.status, okRes.data, okRes.text);
            let qrCodeStatus = okRes.data?.content?.data?.qrCodeStatus;
            switch (qrCodeStatus) {
                case 'NEW': console.log('未扫描'); break;
                case 'SCANED': console.log('已扫描 等待确认'); break;
                case 'CONFIRMED': console.log('已确认 可关闭二维码窗口'); return okRes;
                default: console.log('未知错误 可能二维码已经过期'); return;
            }
            await new Promise(ok => setTimeout(ok, 3000));
        }
    }
    async _lazyRefresh(userConfig) {
        userConfig = userConfig || await this.getUserConfig();
        if (!userConfig) { console.error('no user config'); return; }
        let expireTime = new Date(userConfig.expireTime).getTime();
        let expectTime = new Date();
        expectTime.setHours(expectTime.getHours() + 1);
        expectTime = expectTime.getTime();
        let outdated = !expireTime || expireTime < expectTime;
        return outdated ?
            this._refresh(userConfig.refreshToken) :
            this.saveUserConfig(userConfig, false);
    }
    async _refresh(refreshToken) {
        refreshToken = refreshToken || (await this.getUserConfig()).refreshToken;
        if (!refreshToken) { console.error('no refresh token'); return; }
        let res = await this.request({
            url: cfg.API_HOST + cfg.V2_ACCOUNT_TOKEN,
            method: 'post',
            data: {
                'refresh_token': refreshToken,
                'grant_type': 'refresh_token'
            }
        });
        // console.log(res);
        if (res.status !== 200) {
            console.error('refresh failed:', res.status, res.data, res.text);
            return this._login();
        }
        let userConfig = res.data;
        await this.saveUserConfig(userConfig);
        return userConfig;
    }
    exist() {
        // judge if there is userConfig with this name
        return db.users.get({ user_name: this.name });
    }
    async saveUserConfig(userConfig, toFile = true) {
        userConfig = snakeToCamelObject(userConfig);

        this.Authorization = userConfig.accessToken;
        this.userConfig = userConfig;

        if (toFile) {
            db.users.put({
                user_name: this.name,
                config: this.userConfig,
            });
        }

        return true;
    }
    async getUserConfig() {
        let userConfig = this.userConfig;
        if (!userConfig) {
            userConfig = (await db.users.get({ user_name: this.name })).config;
        }
        return userConfig;
    }
    async request({
        url, method = 'get', headers = {},
        params = {}, data = {}, sendType = 'json', // 'urlencoded', 'json', 'utf8', ...
        responseType = 'json', // 'json', 'text', 'arraybuffer', 'blob'
        ignoreAuth = false
    } = {}) {
        if (!url) return;
        if (ignoreAuth) {
            delete headers.Authorization;
        } else if (this.Authorization && !headers.Authorization) {
            headers.Authorization = this.Authorization;
        }
        let res;
        for (let i = 0; i < 6; i++) {
            try {
                res = await this.agent.sendRequest(url, {
                    method, headers, params, data, serializer: sendType,
                    responseType
                });
            } catch (err) {
                console.error(err);
                return Promise.reject({ err, info: 'breaking error' });
            }
            if (res.status === 401) {
                if (res.text.indexOf('ShareLinkToken') === -1) {
                    await this._refresh();
                } else {
                    return Promise.reject({ err: res, info: '401 ShareLinkToken' });
                }
            } else if (res.status === 429 || res.status === 500) {
                let sleepSec = 5 ** (i % 4);
                console.warn('被限制了, 暂停 ' + sleepSec + ' 秒');
                await new Promise(ok => setTimeout(ok, sleepSec * 1000));
            }
            return res;
        }
        return Promise.reject({ err: res, info: '重试5次仍然请求失败' });
    }
}

// (async function test() {
//     // await new Auth('1').ok().then(({ request, userConfig }) => {
//     //     console.log(userConfig);
//     // });
//     await new Auth('2').ok().then(({ request, userConfig }) => {
//         console.log(userConfig);
//     });
//     await new Auth('test').ok().then(({ request, userConfig }) => {
//         console.log(userConfig);
//     })
// })();