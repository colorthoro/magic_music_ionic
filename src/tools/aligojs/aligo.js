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