import axios from 'axios';
import { getPlatforms } from "@ionic/vue";
import { HTTP } from '@awesome-cordova-plugins/http';

let platforms = getPlatforms();
let baseURL = 'http://10.151.0.87:5000';
platforms.indexOf('mobile') === -1 &&
    platforms.indexOf('android') !== -1 &&
    (baseURL = 'http://10.0.2.2:5000');  // emulator，没有mobile但有android

function r(config) {
    config.responseType = config.responseType || 'json';
    return HTTP.sendRequest(baseURL + config.url, config);  // 超过50M的文件无法一次性下载
}

export function apiScanMusic() {
    return r({
        url: '/scanMusic',
        method: 'GET',
    });
}
export async function apiDownloadMusic(hash, url) {
    return r({
        url: "/dw",
        method: 'GET',
        params: { hash, url },
        responseType: "blob",
    });
}
export function apiGetFileInfo(file_id) {
    return r({
        method: 'get',
        url: '/getf',
        params: { file_id }
    });
}
export function apiSuggestSongsInfo(keywords) {
    return axios({
        method: 'get',
        url: 'https://netease-music-api.fe-mm.com/search/suggest',
        params: { keywords, limit: 50, offset: 0 },
    });
}
export function apiGetLyric(id) {
    return axios({
        method: 'get',
        url: 'https://netease-music-api.fe-mm.com/lyric',
        params: { id }
    });
}
export function apiGetDetail(id) {
    return axios({
        method: 'get',
        url: 'https://mu-api.yuk0.com/song/detail',
        params: {
            ids: id
        }
    });  // res.data.songs[0].al.picUrl 对应着专辑封面路径
}
export function apiGetPic(url, w, h) {
    return axios({
        method: 'get',
        url: url,
        params: w ? {
            param: w + 'y' + h ? h : w,
        } : null,
        responseType: 'blob',
    });
}
export function apiGetLyricFromYun(name) {
    return r({
        method: 'get',
        url: '/getLrc',
        params: { name }
    });
}
export function apiRegister(user_id, sp) {
    return r({
        url: '/register',
        method: 'post',
        data: { user_id, sp }
    });
}
export function apiLogin(user_id, sp) {
    return r({
        url: '/login',
        method: 'post',
        data: { user_id, sp }
    });
}
