import { Map as GLMap, Marker, Popup, LngLatBounds, AttributionControl, ScaleControl, setWorkerUrl } from './vendor/maplibre-gl.mjs';
import { guidePlaces, regions } from './guide-places.js';
import { hangzhouStyle } from './map-style.js';
import { compareLandmarks, selectMapPlaces } from './marker-selection.js';

const $ = selector => document.querySelector(selector);
const storageKey = 'hangzhou-slow-journey-v1';
const themeKey = 'hangzhou-map-theme';
const byId = new Map(guidePlaces.map(p => [p.id, p]));
const groups = [
  { id: 'all', label: '全部', icon: 'layers' },
  { id: 'scenery', label: '湖山', icon: 'mountain' },
  { id: 'streets', label: '街巷', icon: 'street' },
  { id: 'culture', label: '文化', icon: 'museum' },
  { id: 'food', label: '吃喝', icon: 'cup' }
];
const paths = {
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon:'<path d="M20.5 14A8.6 8.6 0 0 1 10 3.5 8.6 8.6 0 1 0 20.5 14Z"/>',
  locate:'<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>',
  layers:'<path d="m3 8 9-5 9 5-9 5Zm0 4 9 5 9-5M3 16l9 5 9-5"/>',
  mountain:'<path d="m2 19 7-13 5 8 3-5 5 10ZM6 12l3 1 2-1"/>',
  street:'<path d="M3 21V8l5-3v16m0-11 8-3v14m0-10 5-3v13M2 21h20M5 10v1m0 4v1m7-4v1m0 4v1m7-4v1"/>',
  museum:'<path d="m2 8 10-5 10 5ZM4 10v9m5-9v9m6-9v9m5-9v9M2 21h20"/>',
  cup:'<path d="M5 8h12v6a6 6 0 0 1-12 0Zm12 1h2a3 3 0 0 1 0 6h-2M4 22h14M8 2v2m5-2v2"/>',
  bookmark:'<path d="M6 3h12v18l-6-4-6 4Z"/>',
  saved:'<path fill="currentColor" d="M6 3h12v18l-6-4-6 4Z"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.locate}</svg>`;
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groupIcon = p => groups.find(g => g.id === p.group).icon;
const motion = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 380;
let saved = [];
let theme = 'light';
try {
  const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(value)) saved = [...new Set(value.filter(id => typeof id === 'string'))];
  if (localStorage.getItem(themeKey) === 'dark') theme = 'dark';
} catch {}
const state = { group: 'all', area: 'all', selected: null, searchMode: 'all' };
const markers = new Map();
let map, popup, toastTimer, loadTimer;
let hasGeometry = false;

document.querySelectorAll('[data-icon]').forEach(el => el.outerHTML = icon(el.dataset.icon));
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('is-visible'), 2600);
}
function setTheme(value) {
  theme = value;
  document.body.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#26372f' : '#f0f2e8';
  const next = theme === 'dark' ? '浅' : '深';
  $('#theme-toggle').innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
  $('#theme-toggle').setAttribute('aria-label', `切换为${next}色地图`);
  $('#theme-toggle').title = `切换为${next}色地图`;
  document.querySelectorAll('[data-theme-choice]').forEach(b => b.setAttribute('aria-pressed', b.dataset.themeChoice === theme));
  try { localStorage.setItem(themeKey, theme); } catch {}
  if (map) map.setStyle(hangzhouStyle(theme));
}
function visiblePlaces() { return guidePlaces.filter(p => (state.group === 'all' || p.group === state.group) && (state.area === 'all' || p.region === state.area)); }
function syncURL() {
  const url = new URL(location.href);
  url.search = '';
  if (state.selected) url.searchParams.set('place', state.selected);
  history.replaceState(null, '', url);
}
function clearSelection() {
  state.selected = null;
  renderMarkers();
  syncURL();
}
function closePopup() {
  if (popup) { popup.remove(); popup = null; }
}
function renderGroups() {
  $('#category-dock').innerHTML = groups.map(g => `<button data-group="${g.id}" aria-pressed="${state.group === g.id}" class="${state.group === g.id ? 'is-active' : ''}">${icon(g.icon)}${g.label}</button>`).join('');
  $('#menu-layers').innerHTML = groups.map(g => `<button class="menu-item" data-group="${g.id}" aria-pressed="${state.group === g.id}">${icon(g.icon)}${g.label}<span class="layer-state" aria-hidden="true"></span></button>`).join('');
}
function renderMarkers() {
  if (!map) return;
  // Nearby landmarks share the available space by editorial prominence.
  // Zooming in separates them naturally; search still includes every place.
  const places = selectMapPlaces(visiblePlaces(), position => map.project(position), state.selected);
  const next = new Set();
  for (const p of places) {
    const selected = p.id === state.selected;
    const key = p.id;
    next.add(key);
    if (markers.has(key)) {
      markers.get(key).element.classList.toggle('is-selected', Boolean(selected));
      continue;
    }
    const element = document.createElement('button');
    element.type = 'button';
    element.className = `place-marker ${p.group}${selected ? ' is-selected' : ''}`;
    element.dataset.place = p.id;
    element.setAttribute('aria-label', `查看${p.name}`);
    element.innerHTML = `<span class="marker-symbol">${icon(groupIcon(p))}</span><span class="marker-label">${escape(p.label)}</span>`;
    element.addEventListener('click', e => { e.stopPropagation(); selectPlace(p.id); });
    const marker = new Marker({element, anchor:'center'}).setLngLat([p.lng,p.lat]).addTo(map);
    markers.set(key, {element,marker});
  }
  markers.forEach((entry,key) => {if(!next.has(key)){entry.marker.remove();markers.delete(key);}});
  requestAnimationFrame(placeLabels);
}
function placeLabels() {
  const entries = [...markers.values()].map(({element}) => element).sort((a,b) =>
    compareLandmarks(byId.get(a.dataset.place), byId.get(b.dataset.place)));
  const symbols = entries.map(el => el.querySelector('.marker-symbol').getBoundingClientRect());
  const occupied = [...document.querySelectorAll('.map-topbar,.theme-toggle,.map-controls,.category-dock,.city-caption,.maplibregl-ctrl-attrib')].map(el => el.getBoundingClientRect());
  const overlaps = (a, b) => a.left < b.right + 3 && a.right > b.left - 3 && a.top < b.bottom + 3 && a.bottom > b.top - 3;
  const positions = [
    ['50%', '37px', 'translateX(-50%)'],
    ['37px', '15px', 'none'],
    ['7px', '15px', 'translateX(-100%)'],
    ['50%', '-9px', 'translateX(-50%)']
  ];
  for (const element of entries) {
    if (element.classList.contains('is-selected')) continue;
    const label = element.querySelector('.marker-label');
    if (!label) continue;
    label.style.visibility = 'hidden';
    for (const [left, top, transform] of positions) {
      Object.assign(label.style, {left, top, transform});
      const box = label.getBoundingClientRect();
      if (box.left < 6 || box.right > innerWidth - 6 || box.top < 65 || box.bottom > innerHeight - 85) continue;
      if (symbols.some(symbol => overlaps(box, symbol)) || occupied.some(other => overlaps(box, other))) continue;
      label.style.visibility = 'visible';
      occupied.push(box);
      break;
    }
  }
}
function fitPlaces(list = visiblePlaces(), maxZoom = 14.1) {
  if (!map || !list.length) return;
  const bounds = new LngLatBounds();
  list.forEach(p => bounds.extend([p.lng, p.lat]));
  const narrow = innerWidth <= 640;
  map.fitBounds(bounds, {padding: narrow ? {top:115,bottom:170,left:40,right:58} : {top:125,bottom:145,left:150,right:150}, maxZoom, duration:motion()});
}
function setGroup(group) {
  state.group = group;
  closeSearch();
  clearSearchQuery();
  closePopup();
  renderGroups();
  renderMarkers();
  fitPlaces();
}
function selectPlace(id, {move = true} = {}) {
  const p = byId.get(id);
  if (!p || !map) return;
  closeSearch();
  clearSearchQuery();
  if (state.group !== 'all' && state.group !== p.group) state.group = 'all';
  if (state.area !== 'all' && state.area !== p.region) state.area = 'all';
  renderGroups();
  renderAreas();
  closePopup();
  state.selected = id;
  renderMarkers();
  const content = document.createElement('article');
  content.innerHTML = `<h2 class="place-title">${escape(p.name)}</h2><p class="place-region">${escape(regions[p.region])} · ${groups.find(g => g.id === p.group).label}</p><p class="place-summary">${escape(p.blurb)}</p><div class="place-actions"><button class="save-place" aria-pressed="${saved.includes(id)}">${icon(saved.includes(id) ? 'saved' : 'bookmark')}<span>${saved.includes(id) ? '已收藏' : '收藏'}</span></button><a href="https://uri.amap.com/search?keyword=${encodeURIComponent(p.mapQuery || '杭州 ' + p.name)}&city=杭州&view=map" target="_blank" rel="noopener noreferrer">高德地图${icon('arrow')}</a></div><a class="place-source" href="${escape(p.sourceUrl || p.source)}" target="_blank" rel="noopener noreferrer">资料：${escape(p.sourceName || 'OpenStreetMap')} ↗</a>`;
  content.querySelector('.save-place').addEventListener('click', e => {
    const button = e.currentTarget;
    const next = !saved.includes(id);
    saved = next ? [...saved, id] : saved.filter(value => value !== id);
    let persisted = true;
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { persisted = false; }
    button.setAttribute('aria-pressed', next);
    button.innerHTML = `${icon(next ? 'saved' : 'bookmark')}<span>${next ? '已收藏' : '收藏'}</span>`;
    toast(persisted ? (next ? '已收藏' : '已取消收藏') : '本次已记录，当前浏览器无法长期保存');
  });
  popup = new Popup({anchor:'bottom',offset:20,maxWidth:'252px',closeOnClick:true,focusAfterOpen:false})
    .setLngLat([p.lng,p.lat]).setDOMContent(content).addTo(map);
  popup.getElement().querySelector('.maplibregl-popup-close-button').setAttribute('aria-label', '关闭地点介绍');
  popup.on('close', clearSelection);
  if (move) map.easeTo({center:[p.lng,p.lat],zoom:Math.max(map.getZoom(),14),offset:[0,60],duration:motion()});
  syncURL();
}
function searchMatches() {
  const q = $('#search').value.trim().toLowerCase().replace(/\s/g, '');
  return guidePlaces.filter(p => (state.searchMode !== 'saved' || saved.includes(p.id)) && (!q || [p.name,p.label,p.subtitle,p.blurb,regions[p.region],...(p.tags || [])].join('').toLowerCase().replace(/\s/g,'').includes(q)));
}
function renderSearch() {
  const list = searchMatches();
  const q = $('#search').value.trim();
  $('#clear-search').hidden = !q;
  $('#search-status').textContent = state.searchMode === 'saved' ? `收藏的地点 · ${list.length}` : q ? `找到 ${list.length} 处地点` : `杭州地点 · ${guidePlaces.length}`;
  $('#search-results').innerHTML = list.length ? list.map(p => `<button class="search-row" data-search-place="${p.id}"><span class="search-row-symbol">${icon(groupIcon(p))}</span><span class="search-row-copy"><strong>${escape(p.name)}</strong><small>${escape(regions[p.region])} · ${escape(p.subtitle || p.label)}</small></span><span class="search-row-arrow" aria-hidden="true">›</span></button>`).join('') : `<p class="empty-search">${state.searchMode === 'saved' ? '还没有收藏的地点。<br>点开地图标记，收藏喜欢的地方。' : '暂时没有找到。<br>试试「西湖」「茶」或「小河」。'}</p>`;
}
function openSearch(mode = 'all') {
  state.searchMode = mode;
  $('#search-panel').hidden = false;
  $('#search').setAttribute('aria-expanded','true');
  renderSearch();
}
function closeSearch() {
  $('#search-panel').hidden = true;
  $('#search').setAttribute('aria-expanded','false');
  $('#search').blur();
}
function clearSearchQuery() { $('#search').value = ''; $('#clear-search').hidden = true; }
function resetMap() { state.group = 'all'; state.area = 'all'; closePopup(); closeSearch(); clearSearchQuery(); renderGroups(); renderAreas(); renderMarkers(); fitPlaces(); }
function showMapError(message) {
  $('#map-status').hidden = false;
  $('#map-status').textContent = message;
}
function bootMap() {
  setWorkerUrl(new URL('./vendor/maplibre-gl-worker.mjs', import.meta.url).href);
  try {
    map = new GLMap({container:'map',style:hangzhouStyle(theme),center:[120.145,30.267],zoom:12.4,minZoom:9,maxZoom:18,attributionControl:false,dragRotate:false,pitchWithRotate:false,renderWorldCopies:false});
    map.touchZoomRotate.disableRotation();
    map.addControl(new AttributionControl({compact:false}), 'bottom-right');
    map.addControl(new ScaleControl({maxWidth:75,unit:'metric'}), 'bottom-left');
    map.on('move', () => requestAnimationFrame(placeLabels));
    map.on('moveend', renderMarkers);
    map.on('resize', renderMarkers);
    map.getCanvas().setAttribute('aria-label','杭州地图，可拖动、缩放，或用方向键移动');
    map.on('sourcedata', e => {
      if (e.sourceId === 'openmaptiles' && e.sourceDataType === 'content') {
        hasGeometry = true; $('#map-status').hidden = true; clearTimeout(loadTimer);
      }
    });
    map.on('error', () => { if (!hasGeometry) showMapError('底图暂时未载入，可从搜索框浏览地点，或稍后刷新。'); });
    renderMarkers();
    fitPlaces(guidePlaces.filter(p => !['liangzhu','xianghu','tangqi','zhijiang'].includes(p.region)));
    const selected = new URLSearchParams(location.search).get('place');
    if (byId.has(selected)) selectPlace(selected);
    loadTimer = setTimeout(() => { if (!hasGeometry) showMapError('底图载入较慢，可先从搜索框浏览地点。'); }, 12000);
  } catch {
    showMapError('当前浏览器无法显示地图，请尝试更新浏览器或开启图形加速。');
  }
}

function renderAreas() {
  $('#area-filter').innerHTML = Object.entries(regions).filter(([id]) => id === 'all' || guidePlaces.some(p => p.region === id)).map(([id,label]) => `<option value="${id}"${id === state.area ? ' selected' : ''}>${label}</option>`).join('');
  $('#area-caption').textContent = state.area === 'all' ? '湖山与街巷' : regions[state.area];
}
$('#area-filter').addEventListener('change', e => {
  state.area = e.target.value;
  state.group = 'all';
  $('#menu-dialog').close();
  closePopup(); closeSearch(); clearSearchQuery(); renderGroups(); renderMarkers(); renderAreas(); fitPlaces();
});

$('#theme-toggle').addEventListener('click', () => setTheme(theme === 'light' ? 'dark' : 'light'));
document.querySelectorAll('[data-theme-choice]').forEach(b => b.addEventListener('click', () => setTheme(b.dataset.themeChoice)));
$('#open-menu').addEventListener('click', () => { closeSearch(); $('#menu-dialog').showModal(); });
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
});
document.addEventListener('click', e => {
  const groupButton = e.target.closest('[data-group]');
  if (groupButton) { if ($('#menu-dialog').open) $('#menu-dialog').close(); setGroup(groupButton.dataset.group); }
  const result = e.target.closest('[data-search-place]');
  if (result) selectPlace(result.dataset.searchPlace);
  if (!e.target.closest('.search-panel,.search-box,#show-saved')) closeSearch();
});
$('#show-saved').addEventListener('click', () => { $('#menu-dialog').close(); $('#search').value = ''; openSearch('saved'); });
$('#menu-reset').addEventListener('click', () => { $('#menu-dialog').close(); resetMap(); });
$('#reset-map').addEventListener('click', resetMap);
$('#zoom-in').addEventListener('click', () => map?.zoomIn({duration:motion()}));
$('#zoom-out').addEventListener('click', () => map?.zoomOut({duration:motion()}));
$('#open-about').addEventListener('click', () => { $('#menu-dialog').close(); $('#about-dialog').showModal(); });
$('#search').addEventListener('focus', () => openSearch());
$('#search').addEventListener('input', () => openSearch());
$('#search').addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); if(e.key === 'ArrowDown') { e.preventDefault(); $('.search-row')?.focus(); } });
$('#search-form').addEventListener('submit', e => { e.preventDefault(); const first = searchMatches()[0]; if (first) selectPlace(first.id); });
$('#clear-search').addEventListener('click', () => { $('#search').value = ''; $('#search').focus(); openSearch(); });
$('#close-search').addEventListener('click', closeSearch);
setTheme(theme);
renderGroups();
renderAreas();
const params = new URLSearchParams(location.search);
if (params.has('scene') && params.has('time') && !params.has('place')) location.replace('./slow/' + location.search);
else bootMap();
