# 一个对接阿里云盘的音乐播放器

* ###### 主要涉及技术

  * Vue
  * Ionic
  * axios
* ###### 终端

  * Android
* ###### 功能

  * 绑定用户网盘，保存配置
  * 获取并缓存网盘音乐、歌词文件
  * 播放音乐
    * 推测网易云音乐歌曲信息
    * 获取网易云音乐封面、歌词
    * 歌词滚动
    * 进度拖动
    * 符合用户习惯的队列、随机、循环播放
  * 本地歌单管理
* ###### TODO

  * [ ] 优化

    * [ ] 调整代码结构
    * [ ] 去除不必要的第三方库
    * [ ] 封装全局消息、错误类
    * [ ] 路由时改变通知栏颜色
    * [ ] 路由底层再次返回退出
    * [ ] 歌词滚动触发延迟问题
    * [ ] 去除SongItemAddons组件
    * [ ] 长按菜单
  * [ ] 播放状态栏
  * [ ] 绑定用户网易云音乐账户
  * [ ] 云转存（直接从网易云下载并上传到阿里云盘）
  * [ ] 云歌单
  * [ ] 在线用户管理、评论、一起听
  * [ ] IOS终端
