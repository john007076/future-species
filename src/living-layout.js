export function fitLivingSize(width,height,aspect){const w=Math.max(1,Math.min(width,height*aspect));return [w,w/aspect];}

export function fitLivingViews(grid){
 const fit=()=>{
  const desktop=innerWidth>1000,available=Math.max(100,innerHeight-grid.getBoundingClientRect().top-50);
  for(const canvas of grid.querySelectorAll('canvas')){
   if(!desktop){canvas.style.removeProperty('width');canvas.style.removeProperty('height');continue;}
   const [w,h]=fitLivingSize(canvas.closest('figure').clientWidth,Math.max(100,innerHeight-canvas.closest('figure').getBoundingClientRect().top-50),canvas.width/canvas.height);
   canvas.style.width=w+'px';canvas.style.height=h+'px';
  }
 };
 const observer=new ResizeObserver(fit);for(const node of grid.parentElement.children)if(node!==grid)observer.observe(node);
 addEventListener('resize',fit);document.fonts.ready.then(fit);fit();
 return ()=>{observer.disconnect();removeEventListener('resize',fit);};
}
