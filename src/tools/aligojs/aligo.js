import Auth from './login';
import {
    listFile as _listFile, getFile as _getFile,
    searchFiles as _searchFiles, queryMaker,
    GetFileListRequest, GetFileRequest, SearchFileRequest,
    GetFileListResponse, GetFileResponse
} from './scann';
import {
    getDownloadUrl as _getDownloadUrl,
    GetDownloadUrlRequest, GetDownloadUrlResponse
} from './download';


export default class Aligo extends Auth {
    constructor(name) {
        super(name);
        this.authOkPromise = super.ok();
        this.classes = {
            GetFileListRequest, GetFileRequest, SearchFileRequest,
            GetDownloadUrlRequest,
            GetFileListResponse, GetFileResponse, GetDownloadUrlResponse
        }
    }
    /**
     * @returns {Promise<GetFileListResponse>}
     */
    listFile(parent_file_id) {
        return _listFile.call(this, new GetFileListRequest({
            parent_file_id
        }));
    }
    /**
     * @returns {Promise<GetFileResponse>}
     */
    getFile(file_id) {
        return _getFile.call(this, new GetFileRequest({
            file_id
        }));
    }
    /**
     * @returns {Promise<GetFileListResponse>}
     */
    searchFiles(name, category, limit = 100) {
        return _searchFiles.call(this, new SearchFileRequest({
            query: queryMaker(name, category),
            limit
        }));
    }
    /**
     * @returns {Promise<GetDownloadUrlResponse>}
     */
    getDownloadUrl(file_id) {
        return _getDownloadUrl.call(this, new GetDownloadUrlRequest({
            file_id
        }));
    }
    _listFile = _listFile;
    _getFile = _getFile;
    _searchFiles = _searchFiles;
    _getDownloadUrl = _getDownloadUrl;
    queryMaker = queryMaker;
}

Aligo.prototype.scanMusic = async function () {
    let q = [], marker = '';
    do {
        if (marker === '') q.push(await this.searchFiles('.', 'audio'));
        else q.push(await this._searchFiles(new this.classes.SearchFileRequest({
            query: this.queryMaker('.', 'audio'),
            marker
        })));
        marker = q[q.length - 1].next_marker;
    } while (marker);
    // console.log(q);
    let res = [];
    q.forEach(response => {
        res = res.concat(response.items);
    })
    return res;
}
Aligo.prototype.download = async function (file_id) {
    let urlRes = await this.getDownloadUrl(file_id);
    console.log(urlRes);
    let targetEnd = urlRes.size - 1, nowEnd = -1;
    let q = [];
    while (nowEnd < targetEnd) {
        let st = nowEnd + 1, ed;
        ed = Math.min(targetEnd, st + 10485760);
        let res = await this.request({
            url: urlRes.url,
            method: 'get',
            headers: { 'Range': 'bytes=' + st + '-' + ed },
            responseType: 'blob',
        });
        if (res && res.data instanceof Blob) {
            q.push(res.data);
        }
        nowEnd = ed;
    }
    let blob = new Blob(q, { type: "application/oct-stream" });
    console.log(blob);
    return blob;
}
Aligo.prototype.getLrc = async function (name) {
    let fileList = await this.searchFiles(name.split('.')[0] + '.txt', '', 1);
    if (fileList.items.length) {
        let blob = await this.download(fileList.items[0].file_id);
        let lrc = await blob.text();
        console.log(lrc);
        return lrc;
    }
    return 'not found';
}

// (async function test() {
//     let ali = new Aligo('test');
//     let res = await ali.listFile();
//     console.log(res);
//     let res2 = await ali.listFile('60b7b3a6bfa47971afc44b4db8e4321d68d2a4cf');
//     console.log(res2);
//     let res3 = await ali.searchFiles('.', 'audio', 90);
//     console.log(res3);
//     let q = [res3];
//     while (q[q.length - 1].next_marker) {
//         let marker = q[q.length - 1].next_marker
//         let tempRes = await ali._searchFiles(
//             new ali.classes.SearchFileRequest({
//                 query: ali.queryMaker('.', 'audio'),
//                 marker,
//                 limit: 90,
//             })
//         );
//         q.push(tempRes);
//     }
//     let res7 = await ali.getDownloadUrl(
//         (await ali.searchFiles('刻在', 'video')).items[0].file_id
//     );
//     console.log(res7);
// })();