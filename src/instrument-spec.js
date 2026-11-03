export const INSTRUMENT_VARIANTS=Object.freeze({
 main:Object.freeze({title:'FUTURE SPECIES',subtitle:'FUTURE PLAN / REMOTE UNIT 01',model:'12 CHANNEL INSTALLATION CONTROLLER',ports:Object.freeze(['MAIN OUT','AIR / 01','MARINE / 02','REMOTE','POWER']),columns:4,selected:3,readout:'04  CENTER / FLOWER'}),
 air:Object.freeze({title:'AIR SPECIES',subtitle:'FUTURE PLAN / AIR UNIT 01',model:'SP–01 / DUAL FIELD CONTROLLER',ports:Object.freeze(['AIR OUT','FLIGHT','MORPH','REMOTE','POWER']),columns:4,selected:0,readout:'4 / 4 PLAYING'}),
 marine:Object.freeze({title:'MARINE SPECIES',subtitle:'FUTURE PLAN / MARINE UNIT 02',model:'SP–02 / ECHO CONTROLLER',ports:Object.freeze(['MARINE OUT','ECHO','SPECIMEN','REMOTE','POWER']),columns:4,selected:0,readout:'MARINE LIFE ONLINE'}),
});
export const CONSOLE_GRID=Object.freeze({rows:3,columns:4,startX:-1.38,startZ:.08,stepX:.20,stepZ:.18});

export function syncInstrumentHeader(root){
 const spec=INSTRUMENT_VARIANTS[root?.dataset.instrument];if(!spec)return;
 const ports=root.querySelector('.console-ports'),brand=root.querySelector('.console-brand');
 if(ports)ports.innerHTML=spec.ports.map(label=>`<span>${label}</span>`).join('');
 if(brand){brand.querySelector('h1').textContent=spec.title;brand.querySelector('p').textContent=spec.subtitle;brand.querySelector('small').textContent=spec.model;}
 root.querySelectorAll('.screen-grid').forEach(grid=>{grid.style.gridTemplateColumns=`repeat(${spec.columns},1fr)`;});
}
