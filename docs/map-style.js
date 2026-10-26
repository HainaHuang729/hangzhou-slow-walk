// Real geometry: OpenFreeMap/OpenMapTiles/OSM. Hangzhou lake, tea and osmanthus palette.
export function hangzhouStyle(mode='light') {
  const dark=mode==='dark';
  const c=dark?{land:'#26372f',wood:'#304634',park:'#344b38',water:'#31574f',building:'#45584b',buildingEdge:'#526555',road:'#75877a',edge:'#435c4b',path:'#697e6b'}:{land:'#f0f2e8',wood:'#dfe8d2',park:'#d2dfbd',water:'#bbd8cc',building:'#d6ded0',buildingEdge:'#cbd5c5',road:'#fffef6',edge:'#d7dfcf',path:'#fafbf1'};
  const source='openmaptiles';
  const lineFilter=['match',['geometry-type'],['LineString','MultiLineString'],true,false];
  const roadFilter=['all',lineFilter,['match',['get','class'],['motorway','trunk','primary','secondary','tertiary'],true,false]];
  const minorFilter=['all',lineFilter,['match',['get','class'],['minor','service','track'],true,false]];
  return {
    version:8,name:'Hangzhou lake palette '+mode,
    sources:{[source]:{type:'vector',url:'https://tiles.openfreemap.org/planet',attribution:'<a href="https://openfreemap.org/" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> · <a href="https://openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> · © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'}},
    layers:[
      {id:'land',type:'background',paint:{'background-color':c.land}},
      {id:'wood',type:'fill',source,'source-layer':'landcover',filter:['match',['get','class'],['wood','grass','scrub','farmland'],true,false],paint:{'fill-color':c.wood,'fill-opacity':.85}},
      {id:'park',type:'fill',source,'source-layer':'park',paint:{'fill-color':c.park,'fill-opacity':.7}},
      {id:'water',type:'fill',source,'source-layer':'water',filter:['!=',['get','brunnel'],'tunnel'],paint:{'fill-color':c.water}},
      {id:'waterway',type:'line',source,'source-layer':'waterway',filter:lineFilter,paint:{'line-color':c.water,'line-width':['interpolate',['linear'],['zoom'],11,1,16,5]}},
      {id:'building',type:'fill',source,'source-layer':'building',minzoom:12.5,paint:{'fill-color':c.building,'fill-outline-color':c.buildingEdge,'fill-opacity':['interpolate',['linear'],['zoom'],12.5,.3,14,1]}},
      {id:'minor-roads',type:'line',source,'source-layer':'transportation',minzoom:13,filter:minorFilter,layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':c.road,'line-opacity':.8,'line-width':['interpolate',['exponential',1.4],['zoom'],13,.7,18,6]}},
      {id:'road-edge',type:'line',source,'source-layer':'transportation',filter:roadFilter,layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':c.edge,'line-width':['interpolate',['exponential',1.3],['zoom'],10,1,13,3,18,15]}},
      {id:'roads',type:'line',source,'source-layer':'transportation',filter:roadFilter,layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':c.road,'line-width':['interpolate',['exponential',1.3],['zoom'],10,.5,13,2.1,18,12]}},
      {id:'walking-paths',type:'line',source,'source-layer':'transportation',minzoom:14,filter:['all',lineFilter,['==',['get','class'],'path']],layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':c.path,'line-opacity':.8,'line-width':['interpolate',['linear'],['zoom'],14,.6,18,2.5]}}
    ]
  };
}
