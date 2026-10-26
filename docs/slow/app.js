import { scenes, sources, weatherLabels } from '../data.js';
import { createAtmosphere, createSoundscape } from '../atmosphere.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name, cls = '') => '<svg class="icon ' + cls + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const hero = $('.hero');
const allStops = new Map(scenes.flatMap(scene => scene.stops.map(stop => [stop.id, { ...stop, sceneId:scene.id }])));
const params = new URLSearchParams(location.search);
const STORAGE_KEY = 'hangzhou-slow-journey-v1';
let saved = [];
let otherSavedPlaces = [];
try {
  const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (Array.isArray(value)) {
    saved = [...new Set(value.filter(id => allStops.has(id)))];
    otherSavedPlaces = value.filter(id => typeof id === 'string' && !allStops.has(id));
  }
} catch { /* Browsers without storage can still explore and collect this session. */ }
const requestedTime = Number(params.get('time'));
const state = {
  scene: scenes.some(s => s.id === params.get('scene')) ? params.get('scene') : 'westlake',
  time: params.has('time') && Number.isFinite(requestedTime) ? clamp(Math.round(requestedTime), 0, 1439) : 420,
  weather: Object.hasOwn(weatherLabels, params.get('weather')) ? params.get('weather') : 'sunny',
  motion: !matchMedia('(prefers-reduced-motion: reduce)').matches,
  saved,
};
let expandedPlace = null;
let toastTimer;
let cardVersion = 0;
let postcardReady = false;
let soundBusy = false;
const atmosphere = createAtmosphere($('#atmosphere'));
const sound = createSoundscape();
const currentScene = () => scenes.find(s => s.id === state.scene);
const timeLabel = () => String(Math.floor(state.time / 60)).padStart(2,'0') + ':' + String(state.time % 60).padStart(2,'0');
const period = () => state.time >= 300 && state.time < 600 ? 'dawn' : state.time >= 600 && state.time < 960 ? 'day' : state.time >= 960 && state.time < 1140 ? 'dusk' : 'night';
const amapURL = stop => 'https://uri.amap.com/search?keyword=' + encodeURIComponent(stop.mapQuery) + '&city=' + encodeURIComponent('杭州') + '&view=map&src=hangzhou-slow&callnative=0';

function showToast(message) {
  const el = $('#toast');
  const host = $('dialog[open]') || document.body;
  if (el.parentElement !== host) host.appendChild(el);
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3200);
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set([...state.saved, ...otherSavedPlaces])])); }
  catch { showToast('已加入本次行囊；当前浏览器无法长期保存。'); }
}

function updateSavedCount() {
  $('#saved-count').textContent = state.saved.length;
  $('.journey-button').setAttribute('aria-label', '我的行囊，已收藏 ' + state.saved.length + ' 个地点');
}

function renderRoutes() {
  $('#route-cards').innerHTML = scenes.map(scene =>
    '<article class="route-card">' +
      '<button class="route-image" data-explore="' + scene.id + '" aria-label="探索' + scene.title + '路线">' +
        '<img src="../assets/' + scene.id + '.png" alt="' + scene.title + '主题原创风景画" loading="lazy" decoding="async">' +
        '<span class="route-image-index">' + scene.index + '</span><span class="route-image-word">' + scene.title + '</span>' +
        '<span class="route-image-arrow">' + icon('ne') + '</span>' +
      '</button>' +
      '<div class="route-card-meta"><span>' + scene.en + '</span><small>' + scene.stops.length + ' 个停留点</small></div>' +
      '<h3>' + scene.subtitle + '</h3><p>' + scene.description + '</p>' +
      '<div class="route-card-bottom"><div class="route-tags">' + scene.tags.slice(0,2).map(tag => '<span>' + tag + '</span>').join('') + '</div>' +
      '<button data-explore="' + scene.id + '">展开路线 ' + icon('ne') + '</button></div>' +
    '</article>'
  ).join('');
}

function updateSceneVisuals() {
  const scene = currentScene();
  hero.dataset.scene = scene.id;
  $$('[data-scene-image]').forEach(img => {
    const active = img.dataset.sceneImage === scene.id;
    if (active && !img.getAttribute('src')) img.src = img.dataset.src;
    img.classList.toggle('is-active', active);
  });
  $$('[data-scene]').forEach(button => {
    const active = button.dataset.scene === scene.id;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const featured = scene.stops[scene.id === 'canal' ? 3 : 1];
  $('#featured-name').textContent = featured.name;
  $('#scene-place').dataset.place = featured.id;
  $('#scene-place').setAttribute('aria-label', '探索' + featured.name);
  updateAtmosphere();
}

function setScene(sceneId) {
  if (!scenes.some(s => s.id === sceneId)) return;
  state.scene = sceneId;
  updateSceneVisuals();
}

function updateAtmosphere() {
  const light = clamp((Math.sin(state.time / 1440 * Math.PI * 2 - Math.PI / 2) + .22) / .55);
  const warmth = Math.exp(-Math.pow((state.time - 1050) / 100, 2)) * .68 + Math.exp(-Math.pow((state.time - 370) / 80, 2)) * .2;
  hero.style.setProperty('--brightness', (.36 + light * .64).toFixed(3));
  hero.style.setProperty('--night', ((1 - light) * .64).toFixed(3));
  hero.style.setProperty('--warm', warmth.toFixed(3));
  hero.style.setProperty('--mist', state.weather === 'mist' ? '.62' : state.weather === 'rain' ? '.18' : '.045');
  hero.style.setProperty('--hero-wash', light > .4 ? '.9' : '.5');
  hero.classList.toggle('is-night', light < .38);
  hero.classList.toggle('is-rain', state.weather === 'rain');
  hero.classList.toggle('is-paused', !state.motion);
  const moment = currentScene().moments[period()];
  $('#moment-title').textContent = moment.title;
  $('#scene-place').title = moment.text;
  $('#time-display').textContent = timeLabel();
  $('#time-range').value = state.time;
  $('#time-range').setAttribute('aria-valuetext', timeLabel());
  const activePeriod = {dawn:'360',day:'720',dusk:'1050',night:'1260'}[period()];
  $$('[data-time]').forEach(button => button.classList.toggle('is-active', button.dataset.time === activePeriod));
  $$('[data-weather]').forEach(button => {
    const active = button.dataset.weather === state.weather;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const motionButton = $('[data-action="motion"]');
  motionButton.innerHTML = icon(state.motion ? 'pause' : 'play');
  motionButton.setAttribute('aria-label', state.motion ? '暂停动态效果' : '播放动态效果');
  motionButton.setAttribute('aria-pressed', String(!state.motion));
  atmosphere.setState({ ...state });
  sound.setState({ scene:state.scene, weather:state.weather });
}

function openDialog(id) {
  $$('dialog[open]').forEach(el => el.close());
  const dialog = $('#' + id);
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}

function openExplore(sceneId = state.scene, placeId = null) {
  setScene(sceneId);
  expandedPlace = placeId || currentScene().stops[0].id;
  renderDrawer();
  openDialog('explore-dialog');
  if (placeId) {
    requestAnimationFrame(() => {
      const target = $('[data-place-item="' + placeId + '"]');
      target?.scrollIntoView({block:'nearest',behavior:'smooth'});
    });
  } else $('#explore-dialog').scrollTop = 0;
}

function renderDrawer() {
  const scene = currentScene();
  $('#drawer-eyebrow').textContent = scene.en + ' / ' + scene.index;
  $('#drawer-title').textContent = scene.subtitle;
  $('#drawer-description').textContent = scene.description;
  $('#route-note').textContent = scene.routeNote;
  $('#drawer-tabs').innerHTML = scenes.map(s => '<button data-drawer-scene="' + s.id + '" class="' + (s.id === scene.id ? 'is-active' : '') + '" aria-pressed="' + (s.id === scene.id) + '">' + s.title + '</button>').join('');
  const collected = scene.stops.every(stop => state.saved.includes(stop.id));
  $('#save-route-button').innerHTML = icon(collected ? 'check' : 'plus') + '<span>' + (collected ? '已在行囊中' : '收藏整条路线') + '</span>';
  $('#save-route-button').setAttribute('aria-pressed', String(collected));
  $('#place-list').innerHTML = scene.stops.map((stop, index) => {
    const isSaved = state.saved.includes(stop.id);
    const isExpanded = expandedPlace === stop.id;
    return '<article class="place-item ' + (isExpanded ? 'is-open' : '') + '" data-place-item="' + stop.id + '">' +
      '<div class="place-heading"><span class="place-number">0' + (index + 1) + '</span><h3>' + stop.name + '</h3>' +
      '<span class="place-kicker">' + stop.kicker + '</span><button class="place-save ' + (isSaved ? 'is-saved' : '') + '" data-save="' + stop.id + '" aria-label="' + (isSaved ? '取消收藏' : '收藏') + stop.name + '" aria-pressed="' + isSaved + '">' + icon(isSaved ? 'check' : 'plus') + '</button></div>' +
      '<button class="place-toggle" data-expand="' + stop.id + '" aria-expanded="' + isExpanded + '" aria-controls="details-' + stop.id + '"><p>' + stop.blurb + '</p>' + icon('arrow') + '</button>' +
      '<div class="place-details" id="details-' + stop.id + '"><p>' + stop.detail + '</p><div class="observation"><small>试着这样看</small>' + stop.observe + '</div>' +
      '<div class="place-links"><a target="_blank" rel="noopener noreferrer" href="' + amapURL(stop) + '">在地图中查看 ' + icon('ne') + '</a>' +
      '<a target="_blank" rel="noopener noreferrer" title="' + stop.sourceName + '" href="' + stop.sourceUrl + '">资料来源 ' + icon('ne') + '</a></div></div></article>';
  }).join('');
  if (scene.extension) {
    const extension = scene.extension;
    $('#place-list').insertAdjacentHTML('beforeend', '<div class="route-practical"><span class="tiny-seal">续</span><p>还想往前走？可延伸至 <a class="text-button" target="_blank" rel="noopener noreferrer" href="' + amapURL(extension) + '">' + extension.name + ' ' + icon('ne') + '</a></p></div>');
  }
  renderMap();
}

function renderMap() {
  const scene = currentScene();
  let geography = '';
  if (scene.id === 'westlake') {
    geography = '<path d="M80 43C108 28 172 32 214 40S282 76 272 118 227 166 170 163 81 150 68 115 49 60 80 43Z" fill="#bfd0c5"/>' +
      '<path d="M50 39Q105 18 166 30M36 59Q37 112 69 146M84 164Q185 183 254 155" fill="none" stroke="#c4ceba" stroke-width="1.5"/>' +
      '<path d="M87 57 102 140M152 47 238 46" stroke="#e5eadf" stroke-width="5"/>' +
      '<path d="M87 57 102 140M152 47 238 46" stroke="#a6b89e" stroke-width="1"/>' +
      '<text x="174" y="115" fill="#8aa998" font-size="22" letter-spacing="10" font-family="serif">西湖</text>';
  } else if (scene.id === 'canal') {
    geography = '<path d="M200-10C235 38 148 74 170 105S230 160 180 195" fill="none" stroke="#bfd0c5" stroke-width="25"/>' +
      '<path d="M100 90Q160 106 170 105" fill="none" stroke="#bfd0c5" stroke-width="12"/>' +
      '<path d="M200-10C235 38 148 74 170 105S230 160 180 195" fill="none" stroke="#aac2b1" stroke-width="1"/>' +
      '<path d="M110 25h40v16h-40Zm-5 26h34v22h-34Zm110 37h35v18h-35Zm9 30h22v15h-22Zm-104-1h23v28h-23Z" fill="#d6decb" stroke="#cbd5c0"/>' +
      '<text x="245" y="75" fill="#8aa998" font-size="15" font-family="serif" letter-spacing="3">运河</text>';
  } else {
    geography = '<path d="M0 96Q55 4 113 74T215 42 320 86M0 116Q64 31 114 91T220 61 320 107M0 140Q62 54 125 114T227 82 320 130" fill="none" stroke="#c3d2b6" stroke-width="9"/>' +
      '<path d="M146 47Q112 100 162 150T160 190" fill="none" stroke="#abc7bd" stroke-width="5"/>' +
      '<text x="221" y="142" fill="#9aaa8a" font-size="18" letter-spacing="5" font-family="serif">茶山</text>';
  }
  const points = scene.stops.map(stop => [20 + stop.x * 2.8, 8 + stop.y * 1.6]);
  const path = points.map((point, i) => (i ? 'L' : 'M') + point.join(' ')).join(' ');
  const pins = scene.stops.map((stop, i) => {
    const [x,y] = points[i];
    let label = stop.name === '中国茶叶博物馆·双峰' ? '茶博·双峰' : stop.name === '桥西历史街区' ? '桥西街区' : stop.name;
    const labelY = y < 53 ? y - 12 : y + 19;
    return '<g role="button" tabindex="0" class="map-pin ' + (stop.id === expandedPlace ? 'is-selected' : '') + '" data-map-place="' + stop.id + '" aria-label="查看' + stop.name + '">' +
      '<circle cx="' + x + '" cy="' + y + '" r="6" fill="' + (stop.id === expandedPlace ? '#a75440' : '#53785b') + '" stroke="#f4f4e6" stroke-width="2.5"/>' +
      '<text x="' + x + '" y="' + labelY + '" text-anchor="middle">' + label + '</text></g>';
  }).join('');
  $('#route-map').innerHTML = '<rect width="320" height="180" fill="#e5eadf"/>' + geography +
    '<path d="' + path + '" fill="none" stroke="#a98e61" stroke-width="1.5" stroke-dasharray="3 5" stroke-linecap="round"/>' + pins;
}

function expandPlace(id, scroll = false) {
  if (!currentScene().stops.some(stop => stop.id === id)) return;
  expandedPlace = expandedPlace === id && !scroll ? null : id;
  $$('[data-place-item]').forEach(item => {
    const open = item.dataset.placeItem === expandedPlace;
    item.classList.toggle('is-open', open);
    $('.place-toggle', item).setAttribute('aria-expanded', String(open));
  });
  renderMap();
  if (scroll) $('[data-place-item="' + id + '"]').scrollIntoView({block:'nearest',behavior:state.motion ? 'smooth' : 'instant'});
}

function toggleSave(id) {
  if (!allStops.has(id)) return;
  const exists = state.saved.includes(id);
  state.saved = exists ? state.saved.filter(item => item !== id) : [...state.saved, id];
  saveState();
  updateSavedCount();
  if ($('#explore-dialog').open) {
    const button = $('[data-save="' + id + '"]');
    if (button) {
      button.classList.toggle('is-saved', !exists);
      button.innerHTML = icon(exists ? 'plus' : 'check');
      button.setAttribute('aria-pressed', String(!exists));
      button.setAttribute('aria-label', (exists ? '收藏' : '取消收藏') + allStops.get(id).name);
    }
    const complete = currentScene().stops.every(stop => state.saved.includes(stop.id));
    $('#save-route-button').innerHTML = icon(complete ? 'check' : 'plus') + '<span>' + (complete ? '已在行囊中' : '收藏整条路线') + '</span>';
    $('#save-route-button').setAttribute('aria-pressed', String(complete));
  }
  if ($('#saved-dialog').open) renderSaved();
  showToast(exists ? '已从行囊中移除' : '已收藏「' + allStops.get(id).name + '」');
}

function saveRoute() {
  const scene = currentScene();
  const fresh = scene.stops.map(stop => stop.id).filter(id => !state.saved.includes(id));
  if (!fresh.length) { showToast('这条路线的地点都在你的行囊里了'); return; }
  state.saved.push(...fresh);
  saveState();
  updateSavedCount();
  renderDrawer();
  showToast('已收藏' + scene.title + '的 ' + scene.stops.length + ' 个停留点');
}

function renderSaved() {
  const holder = $('#saved-list');
  $('#copy-itinerary').hidden = state.saved.length === 0;
  if (!state.saved.length) {
    holder.innerHTML = '<div class="saved-empty">' + icon('bookmark') + '<h3>行囊里，留一点期待。</h3><p>在漫游路线中点一下「＋」，<br>把喜欢的地方装进行囊。</p><button class="small-button" data-explore="' + state.scene + '">去发现一个地方 ' + icon('arrow') + '</button></div>';
    return;
  }
  holder.innerHTML = scenes.map(scene => {
    const stops = scene.stops.filter(stop => state.saved.includes(stop.id));
    if (!stops.length) return '';
    return '<section class="saved-group"><h3>' + scene.title + '<span>' + stops.length + ' 个停留点</span></h3>' +
      stops.map(stop => '<div class="saved-row"><div class="saved-row-info"><strong>' + stop.name + '</strong><p>' + stop.kicker + ' · ' + scene.routeTitle + '</p></div>' +
        '<a target="_blank" rel="noopener noreferrer" href="' + amapURL(stop) + '">地图 ' + icon('ne') + '</a><button class="icon-button" data-save="' + stop.id + '" aria-label="从行囊移除' + stop.name + '">' + icon('close') + '</button></div>').join('') + '</section>';
  }).join('');
}

async function toggleSound() {
  if (soundBusy) return;
  soundBusy = true;
  try {
    const enabled = await sound.toggle();
    hero.classList.toggle('sound-on', enabled);
    $$('[data-action="sound"]').forEach(button => button.setAttribute('aria-pressed', String(enabled)));
    $('.listen-label').textContent = enabled ? '正在听，此刻杭州' : '听一听，此刻杭州';
    if (enabled) showToast('声音已开启 · 放轻音量，慢慢听');
  } catch {
    showToast('当前浏览器暂时无法播放声音，仍可继续漫游。');
  } finally { soundBusy = false; }
}

async function copyText(text, successMessage) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
  } catch {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';
    ($('dialog[open]') || document.body).appendChild(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    if (!copied) { showToast('复制未完成，请在浏览器允许剪贴板访问后重试。'); return false; }
  }
  showToast(successMessage);
  return true;
}

function sceneURL() {
  const url = new URL(location.href);
  url.search = new URLSearchParams({scene:state.scene,time:String(state.time),weather:state.weather}).toString();
  url.hash = '';
  return url.href;
}

function drawCover(ctx, image, x, y, w, h) {
  const scale = Math.max(w/image.naturalWidth, h/image.naturalHeight);
  const sw = w/scale, sh = h/scale;
  ctx.drawImage(image, (image.naturalWidth-sw)/2, (image.naturalHeight-sh)/2, sw, sh, x, y, w, h);
}

function textLines(ctx, value, x, y, maxWidth, lineHeight, maxLines = 2) {
  const lines = [];
  let current = '';
  for (const char of value) {
    if (current && ctx.measureText(current + char).width > maxWidth) { lines.push(current); current = char; }
    else current += char;
  }
  if (current) lines.push(current);
  lines.slice(0,maxLines).forEach((line, i) => ctx.fillText(line, x, y + i*lineHeight));
}

async function drawPostcard() {
  postcardReady = false;
  const version = ++cardVersion;
  const button = $('#download-postcard');
  button.disabled = true;
  const canvas = $('#postcard-canvas');
  const ctx = canvas.getContext('2d');
  const scene = currentScene();
  const image = $('[data-scene-image="' + scene.id + '"]');
  try { await image.decode(); } catch {
    showToast('风景还没载入完成，请稍后再试。');
    return;
  }
  if (version !== cardVersion) return;
  const light = clamp((Math.sin(state.time / 1440*Math.PI*2 - Math.PI/2)+.22)/.55);
  ctx.fillStyle = '#f5f2e8';
  ctx.fillRect(0,0,1440,1080);
  ctx.save();
  ctx.filter = 'brightness(' + (.36+light*.64) + ') saturate(.85)';
  drawCover(ctx,image,32,32,1376,728);
  ctx.filter = 'none';
  if (light < .7) {
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(20,45,72,' + ((1-light)*.6) + ')';
    ctx.fillRect(32,32,1376,728);
    ctx.globalCompositeOperation = 'source-over';
  }
  if (state.weather === 'mist') {
    const fog = ctx.createLinearGradient(0,150,0,760);
    fog.addColorStop(0,'rgba(232,239,226,.03)');
    fog.addColorStop(.6,'rgba(232,239,226,.32)');
    fog.addColorStop(1,'rgba(232,239,226,.07)');
    ctx.fillStyle=fog;ctx.fillRect(32,32,1376,728);
  }
  if (state.weather === 'rain') {
    ctx.strokeStyle = 'rgba(223,236,231,.3)';ctx.lineWidth=1;
    for(let i=0;i<70;i++){const x=40+(i*137.3)%1350,y=40+(i*71.2)%680;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-5,y+19);ctx.stroke();}
  }
  const shade=ctx.createLinearGradient(0,540,0,760);shade.addColorStop(0,'transparent');shade.addColorStop(1,'rgba(9,37,29,.35)');
  ctx.fillStyle=shade;ctx.fillRect(32,520,1376,240);
  ctx.fillStyle='#f6f5e9';ctx.font='28px Georgia, serif';ctx.fillText('HANGZHOU',78,700);
  ctx.font='22px sans-serif';ctx.textAlign='right';ctx.fillText(scene.title+' / '+timeLabel()+' / '+weatherLabels[state.weather],1360,700);ctx.textAlign='left';
  ctx.restore();
  ctx.fillStyle='#294739';ctx.font='45px "Noto Serif CJK SC","Songti SC",serif';ctx.fillText('在杭州，走慢一点。',70,842);
  const message = $('#postcard-message').value.trim() || '山水有时，生活慢慢。';
  ctx.fillStyle='#6b7a63';ctx.font='28px "Noto Serif CJK SC","Songti SC",serif';
  textLines(ctx,message,73,904,1160,41,2);
  ctx.fillStyle='#a75440';ctx.fillRect(1290,798,66,83);
  ctx.strokeStyle='#f3e9d5';ctx.lineWidth=1;ctx.strokeRect(1296,804,54,71);
  ctx.fillStyle='#f3e9d5';ctx.font='36px "Noto Serif CJK SC","Songti SC",serif';ctx.textAlign='center';ctx.fillText('杭',1323,854);ctx.textAlign='left';
  ctx.strokeStyle='#cdd3c3';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(72,992);ctx.lineTo(1365,992);ctx.stroke();
  ctx.fillStyle='#8d9a81';ctx.font='16px sans-serif';ctx.fillText('杭州慢游  /  '+scene.en,74,1035);
  const localNames=scene.stops.filter(stop=>state.saved.includes(stop.id)).map(stop=>stop.name);
  let footer=localNames.length ? '我的行囊 · '+localNames.join(' / ') : '沿一湖、一道水、一片茶山';
  while(ctx.measureText(footer).width>780)footer=footer.slice(0,-2)+'…';
  ctx.textAlign='right';ctx.fillText(footer,1362,1035);ctx.textAlign='left';
  postcardReady = true;
  button.disabled = false;
}

function openPostcard() {
  $('#message-length').textContent = $('#postcard-message').value.length + ' / 32';
  openDialog('postcard-dialog');
  drawPostcard();
}

function downloadPostcard() {
  if (!postcardReady) return;
  const filename = '杭州慢游-' + currentScene().title + '-' + timeLabel().replace(':','') + '.png';
  $('#postcard-canvas').toBlob(blob => {
    if (!blob) { showToast('图片生成失败，请重试。'); return; }
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download=filename;
    $('#postcard-dialog').appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
    showToast('明信片已准备好，请查看浏览器下载');
  },'image/png');
}

document.addEventListener('click', event => {
  const target = event.target.closest('button,a,[data-map-place]');
  if (!target) return;
  if (target.matches('[data-scene]')) setScene(target.dataset.scene);
  if (target.matches('[data-explore]')) openExplore(target.dataset.explore);
  if (target.matches('[data-drawer-scene]')) {
    setScene(target.dataset.drawerScene);
    expandedPlace=currentScene().stops[0].id;
    renderDrawer();$('#explore-dialog').scrollTop=0;
  }
  if (target.matches('[data-save]')) toggleSave(target.dataset.save);
  if (target.matches('[data-expand]')) expandPlace(target.dataset.expand);
  if (target.matches('[data-map-place]')) expandPlace(target.dataset.mapPlace,true);
  if (target.matches('[data-time]')) { state.time=Number(target.dataset.time);updateAtmosphere(); }
  if (target.matches('[data-weather]')) { state.weather=target.dataset.weather;updateAtmosphere(); }
  if (target.matches('[data-close]')) target.closest('dialog').close();
  switch(target.dataset.action) {
    case 'explore': openExplore();break;
    case 'featured': openExplore(state.scene,target.dataset.place);break;
    case 'saved': renderSaved();openDialog('saved-dialog');break;
    case 'about': openDialog('about-dialog');break;
    case 'postcard': openPostcard();break;
    case 'sound': toggleSound();break;
    case 'motion': state.motion=!state.motion;updateAtmosphere();showToast(state.motion?'风景继续流动':'已暂停动态，可以静静看一会儿');break;
  }
});
document.addEventListener('keydown', event => {
  const pin=event.target.closest('[data-map-place]');
  if(pin && ['Enter',' '].includes(event.key)){event.preventDefault();expandPlace(pin.dataset.mapPlace,true);}
});
$('#time-range').addEventListener('input',event=>{state.time=Number(event.target.value);updateAtmosphere();});
$('#save-route-button').addEventListener('click',saveRoute);
$('#download-postcard').addEventListener('click',downloadPostcard);
$('#copy-scene').addEventListener('click',()=>copyText(sceneURL(),'已复制此刻链接，保留了时间与天气'));
$('#copy-itinerary').addEventListener('click',()=>{
  const lines=['我的杭州慢游行囊',''];
  scenes.forEach(scene=>{
    const items=scene.stops.filter(stop=>state.saved.includes(stop.id));
    if(items.length){lines.push('【'+scene.title+'】');items.forEach((stop,i)=>lines.push((i+1)+'. '+stop.name+'\n'+amapURL(stop)));lines.push('');}
  });
  lines.push('主题路线，可分段探索。实际出行请以地图和目的地信息为准。');
  copyText(lines.join('\n'),'地点清单与地图链接已复制');
});
$('#postcard-message').addEventListener('input',()=>{
  $('#message-length').textContent=$('#postcard-message').value.length+' / 32';
  drawPostcard();
});
$$('dialog').forEach(dialog=>{
  dialog.addEventListener('close',()=>{if(!$('dialog[open]'))document.body.style.overflow='';});
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const rect=dialog.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();
  });
});
hero.addEventListener('pointerdown',event=>{
  if(event.target.closest('a,button,input,dialog')||!state.motion)return;
  const rect=hero.getBoundingClientRect();
  atmosphere.rippleAt(event.clientX-rect.left,event.clientY-rect.top);
});
$('#source-list').innerHTML=sources.map(source=>'<a href="'+source.url+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(source.name)+icon('ne')+'</a>').join('');
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.target.id==='journeys')$$('.top-nav a').forEach(a=>a.classList.toggle('is-current',entry.isIntersecting?a.hash==='#journeys':a.hash==='#wander'));
  });
},{threshold:.1});
observer.observe($('#journeys'));
window.addEventListener('pagehide',event=>{
  if (event.persisted) return;
  atmosphere.destroy();sound.destroy();observer.disconnect();
});
renderRoutes();
updateSavedCount();
updateSceneVisuals();
