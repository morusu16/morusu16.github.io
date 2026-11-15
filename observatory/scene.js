(() => {
  const room=document.querySelector('.laboratory'),desk=document.querySelector('.desk-items');
  const under=document.querySelector('[data-underdesk]'),down=document.querySelector('[data-look-down]'),up=document.querySelector('[data-look-up]');
  const cabinet=document.querySelector('[data-drawer-fronts]'),dialog=document.querySelector('#drawer-modal');
  const drawerLinks=document.querySelector('[data-drawer-links]'),empty=document.querySelector('[data-drawer-empty]');
  const title=document.querySelector('[data-drawer-title]'),counter=document.querySelector('[data-cabinet-counter]');
  const previous=document.querySelector('[data-previous-cabinet]'),next=document.querySelector('[data-next-cabinet]');
  const previousDrawer=document.querySelector('[data-previous-drawer]'),nextDrawer=document.querySelector('[data-next-drawer]');
  let profile=LabProfile.getCurrent(),state={surface:'desk',page:0,cabinet:0};
  let returnTimer;
  function drawerCount(){return Math.max(6,...profile.links.filter(l=>l.surface==='shelf').map(l=>l.page+1),...Object.keys(profile.drawerNames).map(key=>Number(key)+1));}
  function cabinetCount(){return Math.ceil(drawerCount()/6);}
  function refresh(data=profile){
    profile=data;state.page=Math.min(state.page,drawerCount()-1);state.cabinet=Math.min(state.cabinet,cabinetCount()-1);
    room.dataset.camera=state.surface==='shelf'?'under':'desk';
    desk.inert=state.surface!=='desk';desk.setAttribute('aria-hidden',String(state.surface!=='desk'));
    under.inert=state.surface!=='shelf';under.setAttribute('aria-hidden',String(state.surface!=='shelf'));
    down.hidden=state.surface!=='desk';
    counter.textContent=`収納台 ${state.cabinet+1} / ${cabinetCount()}`;
    previous.disabled=state.cabinet===0;next.disabled=state.cabinet>=cabinetCount()-1;
    cabinet.replaceChildren();
    for(let index=state.cabinet*6;index<Math.min(drawerCount(),state.cabinet*6+6);index++){
      const button=document.createElement('button');button.type='button';button.className='drawer-front';
      const number=document.createElement('span'),name=document.createElement('span'),handle=document.createElement('span'),count=document.createElement('span');
      const total=profile.links.filter(l=>l.surface==='shelf'&&l.page===index).length;
      number.className='drawer-number';number.textContent='STORAGE / '+String(index+1).padStart(2,'0');
      name.className='drawer-nameplate';name.textContent=LabProfile.drawerName(profile,index);
      handle.className='drawer-handle';handle.setAttribute('aria-hidden','true');count.className='drawer-count';count.textContent=total+' 個';
      button.setAttribute('aria-label',`${LabProfile.drawerName(profile,index)}（引き出し ${index+1}）を開く。${total} 個の物`);button.setAttribute('aria-haspopup','dialog');
      button.append(number,name,handle,count);button.onclick=()=>openDrawer(index);cabinet.append(button);
    }
    let visible=0;
    for(const item of drawerLinks.querySelectorAll('.lab-object')){item.hidden=Number(item.dataset.page)!==state.page;if(!item.hidden)visible++;}
    title.textContent=LabProfile.drawerName(profile,state.page);empty.hidden=!!visible;
    previousDrawer.disabled=state.page===0;nextDrawer.disabled=state.page>=drawerCount()-1;
  }
  function closeDrawer(after){
    if(!dialog.open){after?.();return;}
    if(dialog.classList.contains('returning'))return;
    function finish(){clearTimeout(returnTimer);dialog.removeEventListener('animationend',ended);dialog.close();dialog.classList.remove('returning');cabinet.children[state.page%6]?.focus({preventScroll:true});after?.();}
    function ended(event){if(event.target===dialog&&event.animationName==='drawer-return')finish();}
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
    dialog.addEventListener('animationend',ended);dialog.classList.add('returning');returnTimer=setTimeout(finish,400);
  }
  function openDrawer(page){
    state.surface='shelf';state.page=Math.max(0,Math.min(page,drawerCount()-1));state.cabinet=Math.floor(state.page/6);refresh();
    dialog.classList.remove('returning');if(!dialog.open)dialog.showModal();
  }
  function show(surface,page=0){
    if(surface==='shelf'){openDrawer(page);return;}
    closeDrawer(()=>{state.surface='desk';refresh();down.focus({preventScroll:true});});
  }
  down.onclick=()=>{state.surface='shelf';refresh();up.focus({preventScroll:true});};
  up.onclick=()=>show('desk');
  previous.onclick=()=>{state.cabinet=Math.max(0,state.cabinet-1);refresh();};
  next.onclick=()=>{state.cabinet=Math.min(cabinetCount()-1,state.cabinet+1);refresh();};
  previousDrawer.onclick=()=>openDrawer(state.page-1);nextDrawer.onclick=()=>openDrawer(state.page+1);
  document.querySelector('[data-close-drawer]').onclick=()=>closeDrawer();
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeDrawer();});
  const editFromDrawer=document.querySelector('[data-edit-from-drawer]');
  if(editFromDrawer)editFromDrawer.onclick=()=>closeDrawer(()=>document.querySelector('[data-open-editor]').click());
  window.LabScene={refresh,show,withDrawerClosed:closeDrawer};refresh();
})();
