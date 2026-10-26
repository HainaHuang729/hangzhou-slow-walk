import { scenes, sources as legacySources } from './data.js';
import { coordinates } from './geo-data.js';

export const categories = { all:'全部', scenery:'景点', culture:'人文', food:'吃喝', stay:'住宿' };
export const regions = { all:'全城', westlake:'西湖', canal:'运河', tea:'茶山', oldtown:'老城', city:'城区' };
export const mapConfig = { tiles:'https://tile.openstreetmap.org/{z}/{x}/{y}.png', center:[30.261,120.135], zoom:13 };
export const photos = [
  {id:'westlake',file:'./assets/photos/westlake.jpg',title:'西湖 · 远眺雷峰塔',caption:'从水面看湖山与塔影。照片拍摄于 2009 年 5 月 20 日。',author:'Louisa Salazar',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',source:'https://commons.wikimedia.org/wiki/File:West_Lake_-_Hangzhou,_China.jpg',place:'wl-leifeng'},
  {id:'canal',file:'./assets/photos/canal.jpg',title:'运河 · 拱宸桥',caption:'从南侧看三孔石桥。照片拍摄于 2013 年 7 月 20 日。',author:'猫猫的日记本',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',source:'https://commons.wikimedia.org/wiki/File:Gongchen_Bridge_01_2013-07.JPG',place:'ca-gongchen'},
  {id:'tea',file:'./assets/photos/tea.jpg',title:'龙井 · 茶园与村落',caption:'沿山坡展开的茶田。照片拍摄于 2017 年 10 月 20 日。',author:'Niklas Dougherty',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',source:'https://commons.wikimedia.org/wiki/File:Longjing_tea_district_Hangzhou.jpg',place:'te-longjing'}
];
const foodSource='https://jrsh.hangzhou.com.cn/content/2026-02/25/content_9182200_0.html';
const teaSource='https://z.hangzhou.com.cn/2020/rwwhql/content/content_7750635.htm';
const oldTownSource='https://hznews.hangzhou.com.cn/chengshi/content/2023-11/18/content_8645078.htm';
export const sources=[...legacySources,
  {name:'杭州网 · 杭城小吃与大马弄早市',url:foodSource},
  {name:'杭州网 · 后市街与老城烟火',url:oldTownSource},
  {name:'中国茶叶博物馆 · 寻味满觉陇',url:teaSource},
  {name:'杭州网 · 片儿川里的杭州味',url:'https://hznews.hangzhou.com.cn/wghz/content/2024-10/11/content_8798872.htm'},
  {name:'OpenStreetMap · 地图与地点数据（ODbL）',url:'https://www.openstreetmap.org/copyright'}
];
const visitTips={
 'wl-duanqiao':'从北山街一侧走到桥上，再沿白堤向孤山方向散步。桥上人多时，先走到开阔处再停下拍照。',
 'wl-gushan':'把白堤和孤山放在一起逛，不必绕完整个西湖。沿湖走一段，再转进树荫和园林，节奏会更轻松。',
 'wl-quyuan':'沿临水小径与亭廊慢行。夏日可看荷景；其他季节也适合看湖岸、园林和远山，荷花并非全年盛开。',
 'wl-sudi':'选择一段堤岸行走即可，不必把全程当作任务。到桥上换个方向看看，两侧的水面和山形并不一样。',
 'ca-dadou':'从临河一侧开始，留意旧仓库、寺塔与民居。转入巷道时放轻声音，给仍在这里生活的人留出空间。',
 'ca-xiaohe':'沿街看屋檐，再到河边看房屋的另一面。适合和大兜路、桥西分段串联，跨河路径交给导航确认。',
 'ca-qiaoxi':'先看沿河民居，再去找旧厂房和仓库留下的结构。展馆有各自的开放安排，进入前查看现场公告。',
 'ca-gongchen':'走上桥看运河，再到两岸看桥体。石阶较多，带婴儿车或行动不便时，先确认附近适合的跨河方式。',
 'te-museum':'确认前往龙井路 88 号的双峰馆区，先读茶文化展，再看周围茶园。双峰和翁家山的龙井馆区是两个地方，预约与开放以馆方为准。',
 'te-longjing':'沿村路与公共步道看茶田，选一家茶席坐坐。点茶前询问茶品、计价方式与续水；尊重茶园边界，不自行进田采摘。',
 'te-streams':'和龙井村、九溪烟树选一段串联，穿适合步行的鞋。溪边与山路状况会随天气变化，按当天情况决定是否继续。',
 'te-jiuxi':'把这里作为溪谷散步的停留点。先在岸边看水和树影，再决定向龙井村方向走多远，不必涉水。'
};
const sceneFood={westlake:'吃饭可以放到东岸或老城街巷。想尝本地味道，可搜索片儿川、葱包桧与定胜糕；先看菜单，再按食量点。',canal:'把用餐安排在街区中途，留一点时间坐在临河的位置。老街上有日常餐馆与茶饮店，具体营业与菜单以商家当天为准。',tea:'喝茶是这段旅行的一部分。先问清一杯、一壶或一位如何计价；若买茶，先了解产地、等级和包装，按自己喜欢的味道选。'};
const sceneStay={westlake:'第一次来、希望方便往返城市与湖边，可先比较湖滨片区。想要安静时，查看房间朝向与周边街道，再确认到景点的实际路线。',canal:'若行程以运河老街为主，可比较运河沿岸房源；若还要兼顾西湖和城市交通，可先看看武林广场周边。',tea:'偏爱山居与茶园，可以看看满觉陇一带。先向住宿方确认车辆是否能到门口、是否需要走坡道，以及晚间返程方式。'};
export const places = scenes.flatMap(scene=>scene.stops.map(stop=>({
 ...stop, region:scene.id, category:scene.id==='canal'||['wl-gushan','te-museum'].includes(stop.id)?'culture':'scenery',
 categories:stop.id==='te-longjing'?['scenery','food']:undefined,
 subtitle:stop.kicker,tags:scene.tags.slice(0,2),visit:visitTips[stop.id],culture:stop.detail,eat:sceneFood[scene.id],stay:sceneStay[scene.id],
 photo:stop.id==='ca-gongchen'?'canal':stop.id==='te-longjing'?'tea':null,
 ...coordinates[stop.id]
})));
places.push(
 {id:'wl-leifeng',name:'雷峰塔',subtitle:'湖山之间，一座塔的故事',category:'scenery',region:'westlake',tags:['西湖地标','湖山远眺'],blurb:'在南岸看塔影，认识西湖的另一面。',visit:'与西湖南岸散步一起安排。入园、登塔和票务以景区公告为准；若只想看塔影，也可以从湖岸选择合适的公共观景位置。',culture:scenes[0].extension.detail,eat:sceneFood.westlake,stay:sceneStay.westlake,mapQuery:'杭州 雷峰塔景区',photo:'westlake',sourceName:scenes[0].extension.sourceName,sourceUrl:scenes[0].extension.sourceUrl,...coordinates['wl-leifeng']},
 {id:'old-yujie',name:'南宋御街',subtitle:'从老街读一座城',category:'culture',region:'oldtown',tags:['街巷漫步','老城生活'],blurb:'从中山中路走进老城，再转向河坊街。',visit:'先沿中山中路步行，再把河坊街、后市街按兴趣串起来。地图以御街遗址附近作代表点，沿线展馆与店铺各有开放时间。',culture:'老城的街巷保存着关于南宋临安的记忆。比起只找一座建筑，可以留意街道、院落和日常买卖怎样相邻，看看古老地名如何留在今天的生活里。',eat:'附近可以按自己的口味找片儿川、葱包桧或糕点。老城不只有旅游街，也有早市和居民日常光顾的小店。',stay:'想把老城和西湖放在同一次行程，可比较湖滨及老城周边住宿。先核对具体地址、出入交通与房间朝向。',mapQuery:'杭州 南宋御街',sourceName:'杭州网 · 老城街巷',sourceUrl:oldTownSource,...coordinates['old-yujie']},
 {id:'food-hefang',name:'河坊街 · 杭味小吃',subtitle:'边逛街，边尝一口杭州',category:'food',region:'oldtown',tags:['定胜糕','葱包桧','片儿川'],blurb:'从一份糕点开始，留一点胃口给老城。',visit:'把河坊街和南宋御街连着逛。小吃适合少量分着尝，用餐先看标价；这里标的是街区，不是一家指定商户。',culture:'定胜糕、葱包桧等小吃，把米面和日常手艺变成了杭州的街头滋味。糕点摊的蒸汽、铁板上的声音，也是认识本地生活的一种方式。',eat:'想吃甜口，可以看看定胜糕；偏爱咸香，可找葱包桧；想坐下吃一餐，再搜一碗片儿川。具体售卖以当日店铺为准。',stay:sceneStay.westlake,mapQuery:'杭州 河坊街 小吃',sourceName:'杭州网 · 杭城小吃',sourceUrl:foodSource,...coordinates['food-hefang']},
 {id:'food-damanong',name:'大马弄 · 早市烟火',subtitle:'去看杭州人的日常采购',category:'food',region:'oldtown',tags:['早市','葱包桧','市井生活'],blurb:'一条弄堂里的蔬菜、早点和人情味。',visit:'把它当作仍在运转的生活街巷，边走边看，给买菜、送货的人让路。摊位与营业情况会变化，按当天所见慢慢逛。',culture:'大马弄的早市与街头小吃，是老城日常生活的一部分。来这里的趣味，在于看人们怎样买菜、吃早点和打招呼，而不仅是拍一张照片。',eat:'可留意现场现做的葱包桧和其他早点。问清甜酱、辣酱与馅料，按自己的口味选择。',stay:'若以老城与西湖为主要活动范围，可先比较湖滨及定安路一带的实际房源；这里不标注具体酒店。',mapQuery:'杭州 大马弄',sourceName:'杭州网 · 大马弄早市',sourceUrl:foodSource,...coordinates['food-damanong']},
 {id:'stay-hubin',name:'湖滨 · 住在湖与城之间',subtitle:'住宿片区建议',category:'stay',region:'westlake',tags:['初次来杭','兼顾湖景与城市'],blurb:'适合希望兼顾西湖与城市生活的游客。',visit:'先选想游览的湖岸，再比较具体住宿地址。地图用湖滨街道代表位置标注，标注不代表酒店地址或片区边界。',culture:'西湖东侧把城市街道与湖岸相接。住在这里的取舍，是更靠近热闹街区，还是更偏向湖边的散步体验。',eat:'可在湖滨和老城之间按行程安排吃饭，尝试片儿川等本地味道，不必每餐都追求湖景座位。',stay:'适合第一次来杭州、以西湖与老城为主的行程。订房前比较到目的地的实际路线、街道噪声、房间朝向和取消规则。房价与空房以预订平台为准。',mapQuery:'杭州 湖滨 酒店',sourceName:'OpenStreetMap · 湖滨街道',sourceUrl:coordinates['stay-hubin'].source,...coordinates['stay-hubin']},
 {id:'stay-wulin',name:'武林 · 城市出行作据点',subtitle:'住宿片区建议',category:'stay',region:'city',tags:['城市行程','多片区游览'],blurb:'把西湖、运河和城市行程分开安排。',visit:'地图以武林广场作片区参考点。选房时确认酒店与地铁出入口的位置，而不只看“武林”这个商圈名。',culture:'武林是理解杭州城市生活的另一个入口。可以把湖边漫步与城市街道分开安排，一天留给水岸，一天留给街区。',eat:'在住宿附近先找一家适合早餐的小店，再按当日游览片区安排午晚餐。口味与距离比榜单名次更适合作为选择依据。',stay:'适合准备走多个片区、希望以城市作为据点的行程。具体交通、到站距离、房型与价格逐一核对，不用片区名代替地址。',mapQuery:'杭州 武林广场 酒店',sourceName:'OpenStreetMap · 武林广场',sourceUrl:coordinates['stay-wulin'].source,...coordinates['stay-wulin']},
 {id:'stay-manjuelong',name:'满觉陇 · 留一晚在山里',subtitle:'住宿片区建议',category:'stay',categories:['stay','food'],region:'tea',tags:['山居','茶席','桂花记忆'],blurb:'在村落、茶舍与山间步道之间慢下来。',visit:'以满觉陇村落为片区参考，结合自己的体力选择散步路段。桂花的花期受季节与天气影响，并非全年有花。',culture:'满觉陇的茶与桂花相伴，赏桂、坐茶席和村落生活共同形成了这里的地方气质。了解一处山村，也可以从一杯茶开始。',eat:'可以在茶舍坐坐，留意桂花相关点心与茶饮。点单前询问计价、配料与是否有最低消费，按自己的口味选。',stay:'适合偏爱山居、愿意把行程放慢的人。订房前确认车辆是否能到门口、是否需要爬坡、晚间返程，以及房间的隔音与潮湿情况。',mapQuery:'杭州 满觉陇 民宿',sourceName:'中国茶叶博物馆 · 寻味满觉陇',sourceUrl:teaSource,...coordinates['stay-manjuelong']}
);
export const routes = [
 {id:'westlake',title:'初见西湖，沿湖慢慢走',subtitle:'适合第一次来杭州',description:'从断桥走向白堤与孤山，转到曲院风荷，再选一段苏堤。湖山很大，不必一次走完。',photo:'westlake',pace:'沿湖漫步 · 可分段',stops:['wl-duanqiao','wl-gushan','wl-quyuan','wl-sudi'],note:'虚线只表示游览顺序。全线较长，可在喜欢的一段停下；实际步行道路请用导航确认。'},
 {id:'canal',title:'沿着运河，走进日常',subtitle:'看老街、石桥与水岸生活',description:'从大兜路出发，经小河直街到桥西，再去看拱宸桥。沿河建筑记录着不同年代的生活。',photo:'canal',pace:'街巷访旧 · 可分段',stops:['ca-dadou','ca-xiaohe','ca-qiaoxi','ca-gongchen'],note:'地点分布在不同河岸，虚线不代表跨河通道。桥梁、展馆开放与实际行走路线以地图和现场为准。'},
 {id:'tea',title:'从一叶茶，走进山里',subtitle:'茶文化、村落与溪谷',description:'先在双峰馆区认识茶，再去龙井村；按天气与体力决定是否继续向九溪走。',photo:'tea',pace:'茶山步行 · 量力分段',stops:['te-museum','te-longjing','te-streams','te-jiuxi'],note:'编辑串联的主题游线，含山路与溪涧路段，并非官方完整线路。建议白天游览，按路况决定是否继续。'},
 {id:'oldtown',title:'老城逛吃，寻一口杭味',subtitle:'街巷人情与本地小吃',description:'从御街走到河坊街，再留一点时间给大马弄。看一段街巷，尝一份小吃，给自己一点空白。',photo:null,pace:'老城步行 · 随心停留',stops:['old-yujie','food-hefang','food-damanong'],note:'早市和街区店铺营业时段不同。这是一组可组合的停留点，不保证到访时每家店铺都在营业。'}
];
