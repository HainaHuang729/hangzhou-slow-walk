# 杭州慢游 · Hangzhou Slow Walk

一张适合游客慢慢探索的杭州地图，收录 **47 处地点**，覆盖西湖、灵隐与茶山、运河、老城、西溪、之江、良渚、湘湖和塘栖。

**在线访问：[杭州慢游](https://hainahuang729.github.io/hangzhou-slow-walk/)**

## 体验

- 杭州湖水青、米白与桂花金配色，支持浅色和深色地图。
- 缩小时，附近重叠地点优先显示更有代表性的一个；放大后逐步显示其他地点。显示顺序为编辑配置，并非客流排名。
- 按湖山、街巷、文化、吃喝和游览片区筛选，也可搜索全部地点。
- 提供短介绍、资料来源、浏览器内收藏和高德名称搜索。
- 保留[山水漫游](https://hainahuang729.github.io/hangzhou-slow-walk/slow/)：三幅艺术风景、昼夜晴雨、合成环境声、主题路线与明信片。

地图点位为代表位置，街道、村落、大景区和馆群的标记不等于实际入口。实际道路与参观安排请查看导航及官方公告。当前不提供实时票价、营业时间或活动排期。

## 本地运行

原生 HTML、CSS 和 JavaScript ES Modules，无需安装依赖或构建。

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory docs
```

打开 <http://127.0.0.1:8080/>。地图底图需要网络和浏览器图形加速。收藏保存在当前浏览器，不会上传到服务器。

## 文件结构

| 路径 | 内容 |
| --- | --- |
| `docs/index.html`、`app.js`、`style.css` | 地图界面、搜索、片区与地点交互 |
| `docs/marker-selection.js` | 地标显示优先级及屏幕距离避让 |
| `docs/map-style.js` | 浅色与深色矢量底图样式 |
| `docs/guide-places.js`、`expanded-places.js` | 地点组合、简介、坐标及来源 |
| `docs/map-data.js`、`geo-data.js`、`data.js` | 保留的地点、路线、照片与地理来源 |
| `docs/slow/` | 山水漫游界面 |
| `docs/vendor/` | 本地地图依赖及其许可证 |
| `NOTICE.md` | 地图、数据、照片与第三方软件来源 |

## GitHub Pages

发布来源为 `main` 分支的 `/docs` 目录，使用 GitHub Pages 的分支发布。推送网站修改后，GitHub 会自动重新发布，无需自定义构建工作流。

所有本地资源和模块均使用相对路径，支持 `/hangzhou-slow-walk/` 子目录部署。

## 开源许可

原创代码及原创内容使用 [MIT License](LICENSE)。第三方软件、地理数据与照片保留各自许可，详见 [NOTICE.md](NOTICE.md) 和 [地理数据说明](docs/GEO-DATA-LICENSE.txt)。

## 来源与验证

底图来自 OpenFreeMap / OpenMapTiles / OpenStreetMap。各地点保留内容来源、坐标来源与核对说明。点位核对日期为 2026-10-25 至 2026-10-26，城市阳台尚未核位，未加入。

已在电脑和手机尺寸检查缩放避让、47处搜索、分类与片区、收藏、地点链接、浅深色模式和布局。真实设备的 Safari / 微信浏览器仍需继续验证。
