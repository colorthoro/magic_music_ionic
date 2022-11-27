import cfg from './config';
/* eslint-disable */

class GetFileListRequest {
    constructor({
        parent_file_id = 'root',
        drive_id = '',
        starred = null,
        all = false,
        category = null,
        fields = '*',
        image_thumbnail_process = 'image/resize;w_400/format;jpeg',
        image_url_process = 'image/resize;w_1920/format;jpeg',
        limit = 200,
        marker = '',
        order_by = 'updated_at',
        order_direction = 'DESC',
        status = '',
        type = null,
        url_expire_sec = 14400,
        video_thumbnail_process = 'video/snapshot;t_0;f_jpg;ar_auto;w_800'
    } = {}) {
        return {
            parent_file_id, drive_id, starred, all, category,
            fields, image_thumbnail_process, image_url_process,
            limit, marker, order_by, order_direction, status, type,
            url_expire_sec, video_thumbnail_process
        }
    }
}

class GetFileListResponse {
    constructor(obj) {
        if (!(obj instanceof Object)) return this;
        if (obj.items instanceof Array) {
            this.items = obj.items.map(file => new BaseFile(file));
        }
        if (obj.next_marker) this.next_marker = obj.next_marker;
        if (obj.punished_file_count) this.punished_file_count = obj.punished_file_count;
    }
    items = [new BaseFile()];
    next_marker = '';
    punished_file_count = 0;
}

class BaseFile {
    constructor(obj) {
        if (!(obj instanceof Object)) return this;
        for (const key of Object.keys(obj)) {
            this[key] = obj[key];
        }
    }
    drive_id = "";
    domain_id = "";
    file_id = "";
    parent_file_id = "";
    from_share_id = "";
    name = "";
    type = "";  // 'file' or 'folder'
    category = "";  // 'audio', 'video'
    mime_type = "";  // 'audio/mpeg'
    mime_extension = "";  // 'mp3'
    file_extension = "";  // 'mp3'
    download_url = "";
    size = 0;
    status = "";
    encrypt_mode = "";  // 'none'
    content_type = "";  // 'application/oct-stream'
    content_hash = "";
    content_hash_name = "";
}

class GetFileRequest {
    constructor({
        file_id = '',
        drive_id = '',
        url_expire_sec = 14400,
        fields = '*',
        image_thumbnail_process = 'image/resize,w_160/format,jpeg',
        image_url_process = 'image/resize,w_1920/format,jpeg',
        video_thumbnail_process = 'video/snapshot,t_0,f_jpg,ar_auto,w_800',
    } = {}) {
        return {
            file_id, drive_id, url_expire_sec,
            fields, image_thumbnail_process,
            image_url_process, video_thumbnail_process,
        }
    }
}

class GetFileResponse {
    constructor(obj) {
        return new BaseFile(obj);
    }
}

class SearchFileRequest {
    constructor({
        query = '',
        drive_id = '',
        limit = 100,
        image_thumbnail_process = 'image/resize,w_160/format,jpeg',
        image_url_process = 'image/resize,w_1920/format,jpeg',
        marker = '',
        order_by = '',
        url_expire_sec = 14400,
        video_thumbnail_process = 'video/snapshot,t_0,f_jpg,ar_auto,w_800',
    } = {}) {
        return {
            query, drive_id, limit,
            image_thumbnail_process, image_url_process, marker,
            order_by, url_expire_sec, video_thumbnail_process,
        }
    }
}

async function listFile(requestBody, authOkPromise = this.authOkPromise) {
    let { request, userConfig } = await authOkPromise;
    requestBody.drive_id = requestBody.drive_id || userConfig.defaultDriveId;
    let res;
    try {
        res = await request({
            url: cfg.API_HOST + cfg.ADRIVE_V3_FILE_LIST,
            method: 'post',
            data: requestBody
        });
    } catch (e) {
        console.error(e);
    }
    // console.log(res);
    return new GetFileListResponse(res.data);
}

// (async function test() {
//     let ali = new Auth('test').ok();
//     let rootList = await listFile(new GetFileListRequest(), ali);
//     console.log(rootList);
//     let filmFolder = rootList.items.find(f => f.name === '电影');
//     let filmList = await listFile(new GetFileListRequest({
//         parent_file_id: filmFolder.file_id,
//     }), ali);
//     console.log(filmList);
//     let theNameInYourHeart = filmList.items.find(
//         file => file.name.indexOf('刻在你心底的名字') !== -1
//     );
//     console.log(theNameInYourHeart);
//     let musicFolder = rootList.items.find(f => f.name === 'music');
//     let musicList = await listFile(new GetFileListRequest({
//         parent_file_id: musicFolder.file_id
//     }), ali);
//     console.log(musicList);
//     let theNameInYourHeartMusic = musicList.items.find(
//         file => file.name.indexOf('刻在') !== -1
//     );
//     console.log(theNameInYourHeartMusic);
// })();

async function getFile(requestBody, authOkPromise = this.authOkPromise) {
    let { request, userConfig } = await authOkPromise;
    requestBody.drive_id = requestBody.drive_id || userConfig.defaultDriveId;
    let res;
    try {
        res = await request({
            url: cfg.API_HOST + cfg.V2_FILE_GET,
            method: 'post',
            data: requestBody
        });
    } catch (e) {
        console.error(e);
    }
    // console.log(res);
    return new GetFileResponse(res.data);
}

// (async function test2() {
//     let ali = new Auth('test').ok();
//     let whoLoveFirst = await getFile(
//         new GetFileRequest({ file_id: '636fb03a8f4c953e71f4473c89e89e2def6fb1a4' }),
//         ali
//     );
//     console.log(whoLoveFirst);
//     let theNameInYourHeartMusic = await getFile(new GetFileRequest({
//         file_id: '61499924a8cbabde2c984c9ebb270588359966b7'
//     }), ali);
//     console.log(theNameInYourHeartMusic);
// })();


async function searchFiles(requestBody, authOkPromise = this.authOkPromise) {
    let { request, userConfig } = await authOkPromise;
    requestBody.drive_id = requestBody.drive_id || userConfig.defaultDriveId;
    let res;
    try {
        res = await request({
            url: cfg.API_HOST + cfg.V2_FILE_SEARCH,
            method: 'post',
            data: requestBody
        });
    } catch (e) {
        console.error(e);
    }
    // console.log(res);
    return new GetFileListResponse(res.data);
}

/**
 * 
 * @param {String} name 
 * @param {String} [category] - 'image', 'video', 'audio', 'app', 'doc', 'others'
 */
function queryMaker(name, category) {
    let s = `name match "${name}"`;
    if (category) s += `and category = "${category}"`;
    return s;
}

// (async function test3() {
//     let ali = new Auth('test').ok();
//     let res = await searchFiles(new SearchFileRequest({
//         query: queryMaker('刻在'),
//     }), ali);
//     console.log(res);
// })();


export {
    listFile, getFile, searchFiles, queryMaker,
    GetFileListRequest, GetFileRequest, SearchFileRequest,
    GetFileListResponse, GetFileResponse,
}