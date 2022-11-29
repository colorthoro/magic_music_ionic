import axios from 'axios';
import useUserStore from '@/store/user';

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

export function aligoJsDownload(file_id) {
    return useUserStore().aligo.download(file_id);
}

export function aligoJsUrl(file_id) {
    return useUserStore().aligo.getDownloadUrl(file_id);
}

export function aligoJsLrc(name) {
    return useUserStore().aligo.getLrc(name);
}

export function aligoJsScanMusic() {
    return useUserStore().aligo.scanMusic();
}