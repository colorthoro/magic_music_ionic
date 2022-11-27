import cfg from './config';

class GetDownloadUrlRequest {
    /**
   * 过期时间
   * 默认值 : 900
   * 最小值 : 0
   * 最大值 : 14400
   */
    constructor({
        file_id = '',
        file_name = '',
        expire_sec = 14400,
        drive_id = ''
    } = {}) {
        return { file_id, file_name, expire_sec, drive_id };
    }
}

class GetDownloadUrlResponse {
    constructor(obj) {
        if (!(obj instanceof Object)) return this;
        for (const key of Object.keys(obj)) {
            this[key] = obj[key];
        }
    }
    expiration = '';
    method = '';
    size = 0;
    url = '';
    cdn_url = '';
    internal_url = '';
    crc64_hash = '';
    content_hash = '';
    content_hash_name = '';
}

async function getDownloadUrl(requestBody, authOkPromise = this.authOkPromise) {
    let { request, userConfig } = await authOkPromise;
    requestBody.drive_id = requestBody.drive_id || userConfig.defaultDriveId;
    let res;
    try {
        res = await request({
            url: cfg.API_HOST + cfg.V2_FILE_GET_DOWNLOAD_URL,
            method: 'post',
            data: requestBody
        });
    } catch (e) {
        console.error(e);
    }
    // console.log(res);
    return new GetDownloadUrlResponse(res.data);
}

// (async function test() {
//     let ali = new Auth('test').ok();
//     let urlRes = await getDownloadUrl(new GetDownloadUrlRequest({
//         file_id: '636fb03a8f4c953e71f4473c89e89e2def6fb1a4',
//     }), ali);

//     let url = urlRes.url;
//     console.log(url);
//     let res = await axios({
//         url,
//         method: 'GET',
//         headers: {
//             'Range': 'bytes=' + 0 + '-' + 1000,
//         },
//         reseponseType: 'arraybuffer',
//     })
//     console.log(res);

//     // await download(url, ali);
// })();

export { getDownloadUrl, GetDownloadUrlRequest, GetDownloadUrlResponse }


// async function download(url, authOkPromise) {  // bug
//     let { request } = await authOkPromise;
//     let begin = '0', end = '';
//     let res = await request({  // superagent 下载有问题
//         url,
//         method: 'get',
//         headers: {
//             'Range': 'bytes=' + begin + '-' + end,
//             'Referer': 'https://www.aliyundrive.com/',
//         }
//     });
//     console.log(res);
//     fs.writeFileSync('./test.mp3', res.data);
// }
