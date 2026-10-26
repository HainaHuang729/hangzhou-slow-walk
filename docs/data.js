// Hangzhou slow travel: original copy, verified place facts, illustrative map positions.
export const sources = [
  {
    "name": "UNESCO · 杭州西湖文化景观",
    "url": "https://whc.unesco.org/en/list/1334/"
  },
  {
    "name": "杭州网 · 西湖十景（西湖景区）",
    "url": "https://z.hangzhou.com.cn/2021/syjy/content/content_8115764.html"
  },
  {
    "name": "拱墅区大运河文化研究院 · 拱宸桥",
    "url": "https://www.gongshu.gov.cn/art/2024/4/30/art_1229789753_59080389.html"
  },
  {
    "name": "拱墅区大运河文化研究院 · 大兜路历史街区",
    "url": "https://www.gongshu.gov.cn/art/2024/4/30/art_1229789753_59080392.html"
  },
  {
    "name": "拱墅区大运河文化研究院 · 小河直街历史文化街区",
    "url": "https://www.gongshu.gov.cn/art/2024/4/30/art_1229789753_59080393.html"
  },
  {
    "name": "拱墅区大运河文化研究院 · 桥西历史街区",
    "url": "https://www.gongshu.gov.cn/art/2024/4/30/art_1229789753_59080391.html"
  },
  {
    "name": "杭州政协网 · 穿过横跨运河的Y",
    "url": "https://www.hzzx.gov.cn/cshz/content/2025-09/17/content_9084591.htm"
  },
  {
    "name": "中国茶叶博物馆 · 参观指南",
    "url": "https://www.teamuseum.cn/mobile/basicIntroduction.htm"
  },
  {
    "name": "杭州日报/杭州网 · 杭州首次发布10条茶非遗文旅线路",
    "url": "https://travel.hangzhou.com.cn/lyzx/content/2023-12/13/content_8658902.htm"
  },
  {
    "name": "杭州网记者实走 · 九溪—龙井村线",
    "url": "https://hwyst.hangzhou.com.cn/z/citywalk/content/content_8607414.html"
  }
];

export const scenes = [
  {
    "id": "westlake",
    "index": "01",
    "title": "西湖",
    "en": "WEST LAKE",
    "eyebrow": "一湖山色",
    "subtitle": "把半日，交给湖山。",
    "description": "从断桥走向白堤与孤山，沿北岸遇见荷塘，再择一段苏堤慢行。每次转身，湖面都换一个角度。",
    "routeTitle": "湖山漫步",
    "routeNote": "主题线路，可分段体验。由东北岸向西，再沿苏堤向南；雷峰塔为南岸延伸。示意图不作导航。",
    "tags": [
      "沿湖漫步",
      "风与水声",
      "园林与诗"
    ],
    "moments": {
      "dawn": {
        "title": "天光初醒，山色还轻",
        "text": "让远山从淡淡的雾里浮出来。水面先接住天光，岸边的柳影慢一点再醒。"
      },
      "day": {
        "title": "湖上有风，心里有闲",
        "text": "看一片树影落到水上，再看它被风轻轻打散。今日的行程，可以只是一段长堤。"
      },
      "dusk": {
        "title": "把余晖，留在湖面",
        "text": "山的轮廓渐渐变深，水面还替天空收着最后一点暖色。停下来，让风景多待一会儿。"
      },
      "night": {
        "title": "一湖静水，半城灯影",
        "text": "夜色收起远山的细节，留下水、岸线和稀疏的光。把喜欢的这一刻，寄给远方。"
      }
    },
    "stops": [
      {
        "id": "wl-duanqiao",
        "name": "断桥",
        "kicker": "初见西湖",
        "blurb": "在白堤东端停一下，看长堤分开两片湖光。",
        "detail": "断桥位于白堤东端，连接西湖东北岸与堤上的步行空间。白堤将湖面分为南北两部分，从桥边转向不同方向，能看见城市岸线、开阔水面与远山彼此转换。",
        "observe": "先朝城市看，再朝湖心看；找出这两个方向最不同的一种颜色。",
        "mapQuery": "杭州 西湖 断桥残雪",
        "sourceUrl": "https://z.hangzhou.com.cn/2021/syjy/content/content_8115764.html",
        "sourceName": "杭州网 · 西湖十景（西湖景区）",
        "x": 78,
        "y": 24
      },
      {
        "id": "wl-gushan",
        "name": "白堤与孤山",
        "kicker": "树影之间",
        "blurb": "沿白堤向西，找一处树影，把湖面留在眼前。",
        "detail": "白堤东西连接孤山与西湖东北岸。孤山东南角、白堤西端的平湖秋月，是从北岸观赏湖面的一个位置。沿这段岸线走走，可以留意树木、院墙和湖水如何改变视野。",
        "observe": "找一处能同时看见树枝和水面的地方，试着用树枝给湖景取一个框。",
        "mapQuery": "杭州 孤山公园",
        "sourceUrl": "https://z.hangzhou.com.cn/2021/syjy/content/content_8115764.html",
        "sourceName": "杭州网 · 西湖十景（西湖景区）",
        "x": 48,
        "y": 23
      },
      {
        "id": "wl-quyuan",
        "name": "曲院风荷",
        "kicker": "临水看景",
        "blurb": "贴着水边走，看亭廊把湖景框成一幅画。",
        "detail": "曲院风荷位于苏堤北端西侧，以夏日荷景为观赏主题。这个景名与南宋酿酒作坊及荷塘的历史有关。漫步园中，除了花叶，也可以看看亭廊、曲折岸线和水面之间的关系。",
        "observe": "换两个位置看同一片水，找一找被亭柱遮住、又重新出现的景物。",
        "mapQuery": "杭州 曲院风荷",
        "sourceUrl": "https://z.hangzhou.com.cn/2021/syjy/content/content_8115764.html",
        "sourceName": "杭州网 · 西湖十景（西湖景区）",
        "x": 24,
        "y": 35
      },
      {
        "id": "wl-sudi",
        "name": "苏堤",
        "kicker": "长堤听风",
        "blurb": "走上长堤，看两侧水面与桥怎样连接湖山。",
        "detail": "苏堤由北宋苏轼治理西湖时疏浚出的淤泥构筑而成，南北连接湖岸。长堤与桥梁一起塑造了今天的西湖景观。可以选择其中一段行走，留意两侧湖面与远山的不同层次。",
        "observe": "在一座桥上停一下，把视线从近处水纹慢慢移到最远的一层山。",
        "mapQuery": "杭州 苏堤",
        "sourceUrl": "https://z.hangzhou.com.cn/2021/syjy/content/content_8115764.html",
        "sourceName": "杭州网 · 西湖十景（西湖景区）",
        "x": 32,
        "y": 70
      }
    ],
    "extension": {
      "name": "雷峰塔",
      "detail": "雷峰塔位于西湖南岸，今天的塔建于原塔遗址之上。可作为苏堤之后的南岸延伸，欣赏塔影与湖山的关系。",
      "mapQuery": "杭州 雷峰塔景区",
      "sourceUrl": "https://z.hangzhou.com.cn/2021/syjy/content/content_8115764.html",
      "sourceName": "杭州网 · 西湖十景（西湖景区）"
    }
  },
  {
    "id": "canal",
    "index": "02",
    "title": "运河",
    "en": "GRAND CANAL",
    "eyebrow": "枕水人家",
    "subtitle": "顺着水，走进日常。",
    "description": "从大兜路向北，经过小河直街，再到桥西与拱宸桥。沿河的仓库、街巷与民居，留下不同年代的生活。",
    "routeTitle": "沿河访旧",
    "routeNote": "主题线路，可分段体验。大兜路在运河东岸，小河与桥西在西侧；跨河与步行路径请查看地图。",
    "tags": [
      "街巷漫游",
      "桥与船影",
      "日常记忆"
    ],
    "moments": {
      "dawn": {
        "title": "河先醒来，街还安静",
        "text": "把目光放低，看水面轻轻摇动屋檐的倒影。一条街的一天，从这样的小变化开始。"
      },
      "day": {
        "title": "转进小巷，遇见日常",
        "text": "沿着墙根的光向前走，看看门窗、台阶和岸边的树。一条巷子，足够留住一个下午。"
      },
      "dusk": {
        "title": "灯火渐近，水路悠长",
        "text": "当屋檐的颜色慢慢变暖，河面把岸上的光拉成长线。桥这头与桥那头，又有了新的表情。"
      },
      "night": {
        "title": "一座桥，连着两岸的梦",
        "text": "夜色里，石桥与倒影彼此相望。让视线跟着水流向前，想象那些抵达与出发。"
      }
    },
    "stops": [
      {
        "id": "ca-dadou",
        "name": "大兜路",
        "kicker": "沿岸旧事",
        "blurb": "沿河找一找，寺塔、仓库与民居怎样相邻。",
        "detail": "大兜路位于运河大关桥至江涨桥一段东岸，保留着香积寺石塔、国家厂丝储备仓库和清末民初民居。这里曾与集市、贸易和仓储紧密相连，沿街建筑仍提示着不同的生活用途。",
        "observe": "观察一座旧建筑的门和窗，想一想它过去可能怎样迎接人或货物。",
        "mapQuery": "杭州 大兜路历史街区",
        "sourceUrl": "https://www.gongshu.gov.cn/art/2024/4/30/art_1229789753_59080392.html",
        "sourceName": "拱墅区大运河文化研究院 · 大兜路历史街区",
        "x": 60,
        "y": 85
      },
      {
        "id": "ca-xiaohe",
        "name": "小河直街",
        "kicker": "临水而居",
        "blurb": "放慢脚步，看临水房屋怎样面向街与河。",
        "detail": "小河直街位于京杭大运河、小河和余杭塘河交汇一带。沿河民居与航运设施保留了传统空间特征，街巷中仍能辨认出居住、商贸与水上交通彼此依存的痕迹。",
        "observe": "走到河边再回头看街面，比较一栋房子朝向水和朝向街的两面。",
        "mapQuery": "杭州 小河直街历史文化街区",
        "sourceUrl": "https://www.gongshu.gov.cn/art/2024/4/30/art_1229789753_59080393.html",
        "sourceName": "拱墅区大运河文化研究院 · 小河直街历史文化街区",
        "x": 38,
        "y": 62
      },
      {
        "id": "ca-qiaoxi",
        "name": "桥西历史街区",
        "kicker": "时间里弄",
        "blurb": "从里弄走到旧厂房，找不同年代留下的痕迹。",
        "detail": "桥西历史街区因位于拱宸桥西侧而得名，保存了厂房、仓库、商店、船埠与多种年代的民居。部分工业空间转为工艺与文化展示场所，让沿河生产生活的记忆有了新的表达。",
        "observe": "找两扇风格不同的门，看看材质、尺度与细节怎样透露它们的年代。",
        "mapQuery": "杭州 桥西历史文化街区",
        "sourceUrl": "https://www.gongshu.gov.cn/art/2024/4/30/art_1229789753_59080391.html",
        "sourceName": "拱墅区大运河文化研究院 · 桥西历史街区",
        "x": 44,
        "y": 32
      },
      {
        "id": "ca-gongchen",
        "name": "拱宸桥",
        "kicker": "水路相逢",
        "blurb": "走上石桥，看运河连接两岸与远方。",
        "detail": "拱宸桥横跨京杭大运河，始建于明代1631年，今天的桥体为1885年重修形成。它东连丽水路、台州路，西接桥弄街与小河路，是这段运河上的重要历史地标。",
        "observe": "从桥上看一次远处，再看一次脚下的水；把这两个尺度记在心里。",
        "mapQuery": "杭州 拱宸桥",
        "sourceUrl": "https://www.gongshu.gov.cn/art/2024/4/30/art_1229789753_59080389.html",
        "sourceName": "拱墅区大运河文化研究院 · 拱宸桥",
        "x": 64,
        "y": 22
      }
    ]
  },
  {
    "id": "tea",
    "index": "03",
    "title": "龙井",
    "en": "LONGJING TEA HILLS",
    "eyebrow": "茶山深处",
    "subtitle": "沿一叶茶，走进山里。",
    "description": "先在茶博认识杯中的茶，再向龙井村走去。有余力时，沿九溪十八涧到九溪烟树，让水声接过脚步。",
    "routeTitle": "茶山问路",
    "routeNote": "主题线路，可分段体验。由两条已发布游线衔接而成，非官方单一线路；包含山路与溪涧路段。",
    "tags": [
      "茶园山行",
      "溪涧与竹林",
      "一叶茶香"
    ],
    "moments": {
      "dawn": {
        "title": "山间有雾，叶上有光",
        "text": "茶垄从浅浅的山雾中一层层显露。让眼睛先适应这些绿，再沿着它们的曲线向前。"
      },
      "day": {
        "title": "把脚步，交给山路",
        "text": "树影与茶垄轮流铺开，水声从转弯处传来。选一个地方停下，看看山间最细小的变化。"
      },
      "dusk": {
        "title": "最后一束光，落在茶垄上",
        "text": "暖色掠过叶面，山谷的阴影渐渐加深。给这一片层叠的绿留一张明信片，记住今天。"
      },
      "night": {
        "title": "山影入夜，茶香入梦",
        "text": "夜色把茶垄收进山的轮廓里，只留下深浅不同的蓝。收藏这一刻，等清晨再展开它的绿。"
      }
    },
    "stops": [
      {
        "id": "te-museum",
        "name": "中国茶叶博物馆·双峰",
        "kicker": "一叶知茶",
        "blurb": "先看一只茶杯，再看它背后的工艺与山水。",
        "detail": "中国茶叶博物馆双峰馆区位于龙井路88号，设有中华茶文化、西湖龙井茶等专题展示。它与翁家山的龙井馆区是不同地点，可以先在这里认识茶，再走向茶生长的地方。",
        "observe": "选一件茶具，想想它的形状会怎样影响拿起、倒水与饮茶的动作。",
        "mapQuery": "杭州 中国茶叶博物馆 双峰馆区",
        "sourceUrl": "https://www.teamuseum.cn/mobile/basicIntroduction.htm",
        "sourceName": "中国茶叶博物馆 · 参观指南",
        "x": 70,
        "y": 20
      },
      {
        "id": "te-longjing",
        "name": "龙井村",
        "kicker": "茶垄之间",
        "blurb": "从村路望向茶垄，找山坡上不同层次的绿。",
        "detail": "龙井村是杭州已发布茶文化游线中的重要节点。由双峰馆区出发，可通过龙井八景古道与过溪亭方向串联村落，村中还有老龙井等茶文化景点，可按自己的节奏选择停留。",
        "observe": "沿公共道路观察茶垄的走向，看看它们怎样顺着山坡弯曲。",
        "mapQuery": "杭州 龙井村",
        "sourceUrl": "https://travel.hangzhou.com.cn/lyzx/content/2023-12/13/content_8658902.htm",
        "sourceName": "杭州日报/杭州网 · 杭州首次发布10条茶非遗文旅线路",
        "x": 30,
        "y": 38
      },
      {
        "id": "te-streams",
        "name": "九溪十八涧",
        "kicker": "听溪而行",
        "blurb": "听脚步与溪声交替，看茶山接入竹林。",
        "detail": "九溪十八涧是九溪烟树与龙井村之间步行线路的一部分。沿途可以见到溪流、竹林与茶山相接的景观。它适合独立作为一段山间漫步，也可与龙井村的茶文化探索衔接。",
        "observe": "停下来闭目听几秒，再睁开眼睛，寻找刚才听到的那一处水声。",
        "mapQuery": "杭州 九溪十八涧",
        "sourceUrl": "https://hwyst.hangzhou.com.cn/z/citywalk/content/content_8607414.html",
        "sourceName": "杭州网记者实走 · 九溪—龙井村线",
        "x": 42,
        "y": 64
      },
      {
        "id": "te-jiuxi",
        "name": "九溪烟树",
        "kicker": "山水停留",
        "blurb": "在水边停一会儿，把这段山路留给耳朵。",
        "detail": "九溪烟树位于九溪通往龙井村的步行线路上，向龙井村方向可经九溪十八涧串联。走到这里，可以让步行暂时告一段落，在岸边观察水面、树影和周围山林的层次。",
        "observe": "找一片落在水面的树影，看它怎样随着水纹慢慢改变轮廓。",
        "mapQuery": "杭州 九溪烟树",
        "sourceUrl": "https://hwyst.hangzhou.com.cn/z/citywalk/content/content_8607414.html",
        "sourceName": "杭州网记者实走 · 九溪—龙井村线",
        "x": 55,
        "y": 84
      }
    ]
  }
];

export const weatherLabels = { sunny: '晴', mist: '雾', rain: '雨' };
