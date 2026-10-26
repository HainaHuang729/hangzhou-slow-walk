// Editorial display order for this guide, not a visitor-count ranking.
// Stable priorities keep nearby markers from swapping as the map is dragged.
export const landmarkOrder = [
  'hz-lingyin', 'wl-leifeng', 'wl-duanqiao', 'hz-xixi', 'wl-sudi',
  'hz-santan', 'hz-songcheng', 'hz-liangpark', 'hz-xianghu', 'te-longjing',
  'ca-gongchen', 'food-hefang', 'hz-zjm-zhijiang', 'hz-liangmuseum',
  'hz-tangqi', 'wl-quyuan', 'te-jiuxi', 'hz-faxi', 'wl-gushan',
  'hz-silk', 'hz-feilai', 'hz-yunqi', 'hz-taizi', 'hz-huagang',
  'hz-pinghu', 'hz-liulang', 'hz-jingci', 'stay-manjuelong',
  'te-museum', 'ca-xiaohe', 'old-yujie', 'hz-versions', 'hz-deshou',
  'hz-hzm', 'hz-zjam', 'hz-meijiawu', 'hz-baoshi', 'hz-tianmuli',
  'ca-qiaoxi', 'hz-crafts', 'hz-caam', 'hz-hubin', 'ca-dadou',
  'hz-xiaohepark', 'hz-wuliu', 'hz-mantou', 'hz-shuguang'
];
const priority = new Map(landmarkOrder.map((id, index) => [id, index]));

export function compareLandmarks(a, b) {
  return (priority.get(a.id) ?? Infinity) - (priority.get(b.id) ?? Infinity) || a.id.localeCompare(b.id);
}

export function selectMapPlaces(places, project, selectedId = null, minDistance = 64) {
  const ordered = places.slice().sort((a, b) =>
    Number(b.id === selectedId) - Number(a.id === selectedId) || compareLandmarks(a, b));
  const kept = [];
  for (const place of ordered) {
    const point = project([place.lng, place.lat]);
    if (kept.some(other => Math.hypot(point.x - other.point.x, point.y - other.point.y) < minDistance)) continue;
    kept.push({place, point});
  }
  return kept.map(entry => entry.place);
}
