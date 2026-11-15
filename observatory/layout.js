(() => {
  function position(value, fallback={x:58,y:50}) {
    return {
      x: Number.isFinite(value?.x) ? Math.max(0,Math.min(100,value.x)) : fallback.x,
      y: Number.isFinite(value?.y) ? Math.max(0,Math.min(100,value.y)) : fallback.y
    };
  }
  function defaultPosition(index) {
    const slots=[{x:44,y:24},{x:65,y:24},{x:86,y:24},{x:44,y:82},{x:65,y:82},{x:86,y:82},{x:44,y:53},{x:65,y:53},{x:86,y:53},{x:31,y:24},{x:31,y:53},{x:31,y:82}];
    const base=slots[index%slots.length],offset=Math.floor(index/slots.length)%4;
    return {x:base.x+offset*2,y:base.y+offset*2};
  }
  const capacity=6;
  function allocate(existing, requested={}) {
    let surface=requested.surface==='shelf'?'shelf':'desk';
    let page=surface==='shelf' && Number.isInteger(requested.page)?Math.max(0,Math.min(16,requested.page)):0;
    let group=existing.filter(l=>l.surface===surface&&l.page===page);
    let overflow=false;
    if(surface==='shelf'&&group.length>=capacity){
      surface='shelf';page=0;overflow=true;
      while(existing.filter(l=>l.surface===surface&&l.page===page).length>=capacity)page++;
      group=existing.filter(l=>l.surface===surface&&l.page===page);
    }
    const slots=Array.from({length:surface==='desk'?Math.max(12,group.length+1):capacity},(_,index)=>surface==='desk'?defaultPosition(index):{x:[15,50,85][index%3],y:index<3?24:82});
    const free=slots.find(p=>!group.some(l=>Math.abs(l.position.x-p.x)<13&&Math.abs(l.position.y-p.y)<24))||slots[group.length%capacity];
    return {surface,page,position:overflow?free:position(requested.position,free)};
  }
  function snap(value,surface){return position(value);}
  function drag(origin, dx, dy, width, height, objectWidth) {
    if(width<=0 || height<=0) return position(origin);
    const margin=Math.min(45,Math.max(3,objectWidth/2/width*100));
    const next=position({x:origin.x+dx/width*100,y:origin.y+dy/height*100});
    next.x=Math.max(margin,Math.min(100-margin,next.x));
    return {x:Math.round(next.x*100)/100,y:Math.round(next.y*100)/100};
  }
  function apply(element, value) {
    const p=position(value);
    element.style.left=p.x+'%';
    element.style.top=p.y+'%';
    element.style.zIndex=String(1+Math.round(p.y));
    element.dataset.edge=p.x<35?'left':p.x>65?'right':'center';
  }
  window.LabLayout={position,defaultPosition,drag,apply,allocate,snap,capacity};
})();
