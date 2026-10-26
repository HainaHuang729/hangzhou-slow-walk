import { places } from './map-data.js';
import { expandedPlaces } from './expanded-places.js';

export const regions = {
  all:'全部片区', westlake:'西湖湖岸', tea:'灵隐与茶山', canal:'运河', oldtown:'老城',
  westcity:'城西·西溪', zhijiang:'之江', qianjiang:'钱江新城', liangzhu:'良渚', xianghu:'湘湖', tangqi:'塘栖'
};
const original = [
  ['wl-duanqiao','断桥','scenery'], ['wl-gushan','孤山','scenery'],
  ['wl-quyuan','曲院风荷','scenery'], ['te-longjing','龙井村','scenery'],
  ['ca-gongchen','拱宸桥','streets'], ['ca-xiaohe','小河直街','streets'],
  ['te-museum','茶博·双峰','culture'], ['food-hefang','河坊街','food']
].map(([id,label,group]) => ({...places.find(p=>p.id===id),label,group}));
export const guidePlaces = [...original, ...expandedPlaces];
