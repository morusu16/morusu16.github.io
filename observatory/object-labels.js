(() => {
  let lastPointer='mouse',armed=null,timer;
  const owner=document.body.classList.contains('owner-mode');
  function clear(){armed?.classList.remove('show-description');armed=null;clearTimeout(timer);}
  document.addEventListener('pointerdown',event=>{
    lastPointer=event.pointerType||'mouse';
    if(armed&&!armed.contains(event.target))clear();
  },{passive:true});
  document.addEventListener('click',event=>{
    if(event.defaultPrevented)return;
    const object=event.target.closest?.('.lab-object');if(!object)return;
    if(owner&&event.target.closest('.masking-tape')){
      event.preventDefault();clear();document.dispatchEvent(new CustomEvent('lab:edit-object',{detail:{id:object.dataset.objectId}}));return;
    }
    if(event.detail===0||lastPointer!=='touch'||!object.querySelector('.object-description'))return;
    if(armed===object){clear();return;}
    event.preventDefault();clear();armed=object;armed.classList.add('show-description');timer=setTimeout(clear,6000);
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')clear();
    const object=event.target.closest?.('.lab-object');
    if(owner&&event.key==='F2'&&object){event.preventDefault();document.dispatchEvent(new CustomEvent('lab:edit-object',{detail:{id:object.dataset.objectId}}));}
  });
})();
