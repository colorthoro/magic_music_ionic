import {
    apiGetLyric, apiGetDetail, apiGetPic
} from "../tools/api";
import { findAllResultSongs, splitSongName } from './songSuggest';
import Dexie from "dexie";
import useUserStore from "@/store/user";

export const db = new Dexie("magic_music");
db.version(2).stores({
    songs: "++id, &content_hash",
    pics: "++id, &song_hash",
    users: "++id, &user_name",
});

export class Song {
    constructor(originObject) {
        let valid = this.test(originObject, true);
        this.valid = valid;
        this.tags = originObject.tags || [];
        this.lost = originObject.lost || false;
        this.cnt = originObject.cnt || 0;
        this.netease_id = originObject.netease_id || '';
        this.lyric = originObject.lyric || '';
        this.picId = -1;
        this.oneWhileData = {};
    }
    test(originObject, inject = false) {
        let list = [
            'name', 'mime_extension', 'file_id',
            'parent_file_id', 'status', 'content_hash',
            'download_url', 'size', 'trashed'
        ];
        let valid = true;
        for (const key of list) {
            if (!originObject[key]) {
                console.info('原始对象缺失属性' + key);
                if (key in ['file_id', 'content_hash', 'download_url']) {
                    valid = false;
                    console.error('可能导致无法获取');
                }
            }
            if (inject) this[key] = originObject[key];
        }
        return valid;
    }
    oneWhileManager(funcName, ...args) {  // 避免异步方法短时间内被多次异步调用
        if (funcName === 'oneWhileManager') return;
        if (!this.oneWhileData[funcName]) {
            let justTransfer = okOrno => { delete this.oneWhileData[funcName]; return okOrno; }
            this.oneWhileData[funcName] = this[funcName](...args).then(justTransfer, justTransfer);
        } else console.info('等待前一个异步调用结果中，调用方法：', funcName);
        return this.oneWhileData[funcName];
    }
    sameWith(song) {
        return (song instanceof Song) && (this.content_hash === song.content_hash);
    }
    async fetch() {
        let hash = this.content_hash;
        let test = await db.songs.get({ content_hash: this.content_hash });
        if (test) {
            console.log('已从本地IndexedDB取得文件', hash, test);
            return test.file;
        }
        let res = await useUserStore().aligo.download(this.file_id);
        console.log('获取文件成功，准备存入IndexedDB', hash, res);
        db.songs.put({
            content_hash: this.content_hash,
            file: res,
        });
        return res;
    }
    async fetchUrl() {
        let urlRes = this.urlRes;
        if (urlRes) {
            let expireTime = new Date(urlRes.expiration).getTime();
            let expectTime = new Date();
            expectTime.setMinutes(expectTime.getMinutes() + 15);
            expectTime = expectTime.getTime();
            let outdated = !expireTime || expireTime < expectTime;
            if (!outdated) return urlRes.url;
        }
        urlRes = await useUserStore().aligo.getDownloadUrl(this.file_id);
        this.urlRes = urlRes;
        return urlRes.url;
    }
    async bindNeteaseId(refresh = false) {
        if (!refresh && this.netease_id) {
            console.log('bindNeteaseId 已存在', this.netease_id);
            return true
        }
        console.log('bindNeteaseId 正在查询网易云音乐对应歌曲id', this);
        let { best, resultSongs } = await findAllResultSongs(splitSongName(this.name));
        let bestMatch = resultSongs[best];
        if (bestMatch) {
            console.log("最终匹配：", bestMatch);
            this.netease_id = bestMatch.id;
            return true;
        }
        console.log('bindNeteaseId 查询网易云音乐对应歌曲id failed');
        return false;
    }
    fillLrc(lrc) {
        this.lyric = lrc;
    }
    async fetchLrc() {
        if (this.lyric) return this.lyric;
        console.log('在云盘查找歌词');
        let res = await useUserStore().aligo.getLrc(this.name);
        if (res.length && res !== 'not found') {
            this.lyric = res;
            return this.lyric;
        }
        console.log('云盘未找到歌词');
        if (! await this.oneWhileManager('bindNeteaseId')) return;
        console.log('在网易云查找歌词');
        let lrc = (await apiGetLyric(this.netease_id)).data.lrc.lyric;
        console.log("得到歌词：", lrc);
        this.lyric = lrc;
        return this.lyric;
    }
    async fetchPicture() {
        console.log('在 IndexedDB 查找歌曲对应封面');
        let pic = await db.pics.get({ song_hash: this.content_hash });
        if (pic) return pic.file;
        console.log('IndexedDB 中没有歌曲对应封面');
        if (! await this.oneWhileManager('bindNeteaseId')) return;
        console.log('在网易云查找歌曲对应封面');
        let url;
        try {
            url = (await apiGetDetail(this.netease_id)).data.songs[0].al.picUrl;
            let picFile = (await apiGetPic(url, 300)).data;
            db.pics.put({ song_hash: this.content_hash, file: picFile });
            return picFile;
        } catch (e) { console.error(e); return; }
    }
}

export function replacer(key, value) {
    // console.log(key, value);
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    }
    if (value instanceof Song && value.dataType !== 'SongIned') {
        value.dataType = 'SongIned';
    }
    return value;
}

export function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
        if (value.dataType === 'SongIned') {
            value.dataType = 'SongOuted';
            value = new Song(value);
            return value;
        }
    }
    return value;
}