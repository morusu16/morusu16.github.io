(() => {
  const area=document;
  let active=null, suppressClickUntil=0;
  function objectFrom(target){return target.closest?.('.lab-object') || null;}
  function announce(text,error=false){for(const note of document.querySelectorAll('[data-placement-message]')){note.textContent=text;note.classList.toggle('is-error',error);}}
  function emitMove(item, position){
    area.dispatchEvent(new CustomEvent('lab:place-object',{bubbles:true,detail:{id:item.dataset.objectId,position}}));
  }
  function currentLink(item){return LabProfile.getCurrent().links.find(l=>l.id===item.dataset.objectId);}
  function stop(cancel){
    if(!active)return;
    const state=active;active=null;
    state.item.classList.remove('is-dragging');
    if(state.item.hasPointerCapture(state.pointerId))state.item.releasePointerCapture(state.pointerId);
    if(cancel){LabLayout.apply(state.item,state.origin);return;}
    if(state.moved){suppressClickUntil=performance.now()+500;emitMove(state.item,LabLayout.snap(state.next,state.surface));}
  }
  area.addEventListener('pointerdown',event=>{
    if(active || event.button!==0 || event.isPrimary===false)return;
    const item=objectFrom(event.target);if(!item)return;
    const link=currentLink(item);if(!link)return;
    const rect=item.closest('[data-placement-area]').getBoundingClientRect();if(!rect.width||!rect.height)return;
    active={item,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,origin:link.position,next:link.position,surface:link.surface,rect,moved:false};
    item.focus({preventScroll:true});
  });
  area.addEventListener('pointermove',event=>{
    if(!active || event.pointerId!==active.pointerId)return;
    const dx=event.clientX-active.startX,dy=event.clientY-active.startY;
    if(!active.moved && Math.hypot(dx,dy)<5)return;
    if(!active.moved){active.item.setPointerCapture(event.pointerId);active.moved=true;}
    event.preventDefault();
    active.item.classList.add('is-dragging');
    active.next=LabLayout.drag(active.origin,dx,dy,active.rect.width,active.rect.height,active.item.offsetWidth);
    LabLayout.apply(active.item,active.next);
  });
  area.addEventListener('pointerup',event=>{if(active?.pointerId===event.pointerId)stop(false);});
  area.addEventListener('pointercancel',()=>stop(true));
  area.addEventListener('lostpointercapture',()=>stop(true));
  area.addEventListener('dragstart',event=>event.preventDefault());
  area.addEventListener('click',event=>{if(performance.now()<suppressClickUntil){event.preventDefault();event.stopPropagation();}},true);
  area.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&active){event.preventDefault();stop(true);return;}
    const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
    const item=objectFrom(event.target);if(!delta||!item)return;
    event.preventDefault();const link=currentLink(item);if(!link)return;
    const rect=item.closest('[data-placement-area]').getBoundingClientRect(),step=event.shiftKey?1:3;
    const next=LabLayout.drag(link.position,delta[0]*step*rect.width/100,delta[1]*step*rect.height/100,rect.width,rect.height,item.offsetWidth);
    emitMove(item,LabLayout.snap(next,link.surface));
    [...area.querySelectorAll('.lab-object')].find(a=>a.dataset.objectId===link.id)?.focus({preventScroll:true});
  });
  window.addEventListener('resize',()=>stop(true));
  window.addEventListener('blur',()=>stop(true));
  document.addEventListener('lab:placement-result',event=>announce(event.detail.message,!event.detail.saved));
})();
