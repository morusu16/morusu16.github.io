(() => {
  const objects = {monitor:'モニター',notebook:'ノート',specimen:'標本瓶'};
  let current;
  function normalize(data = {}) {
    const seen = new Set(), links = [];
    for (const l of Array.isArray(data.links) ? data.links.slice(0,100) : []) {
      if (!l || typeof l.id !== 'string' || !l.id || seen.has(l.id) || typeof l.label !== 'string' || !l.label.trim()) continue;
      let url; try { url = new URL(l.url); } catch { continue; }
      if (!['https:','http:'].includes(url.protocol)) continue;
      const placement=LabLayout.allocate(links,l);
      const deskPosition=l.deskPosition&&Number.isFinite(l.deskPosition.x)&&Number.isFinite(l.deskPosition.y)?LabLayout.position(l.deskPosition):null;
      seen.add(l.id); links.push({id:l.id,label:l.label.slice(0,80),description:typeof l.description==='string'?l.description.slice(0,140):'',url:url.href,object:Object.hasOwn(objects,l.object)?l.object:'monitor',...placement,...(deskPosition?{deskPosition}: {})});
    }
    const drawerNames={};
    for(let i=0;i<17;i++){const name=data.drawerNames?.[i];if(typeof name==='string'&&name.trim())drawerNames[i]=name.trim().slice(0,40);}
    return {displayName:typeof data.displayName==='string'?data.displayName.slice(0,60):'',biography:typeof data.biography==='string'?data.biography.slice(0,1500):'',drawerNames,links};
  }
  function drawerName(profile,index){return profile.drawerNames?.[index]||'引き出し '+String(index+1).padStart(2,'0');}
  function render(data, draft=false) {
    const p=normalize(data), container=document.querySelector('[data-lab-links]'),drawers=document.querySelector('[data-drawer-links]');
    current=p;
    document.querySelector('[data-researcher-name]').textContent=p.displayName.trim()||'研究室';
    document.querySelector('[data-researcher-bio]').textContent=p.biography.trim();
    document.querySelector('[data-profile-status]').hidden=!draft;
    container.replaceChildren();
    drawers.replaceChildren();
    let descriptionIndex=0;
    for(const l of p.links){
      const a=document.createElement('a'),shape=document.createElement('span'),label=document.createElement('strong'),type=document.createElement('small');
      a.className='lab-object'; a.href=l.url; a.target='_blank';a.rel='noopener noreferrer';a.dataset.objectId=l.id;
      a.dataset.surface=l.surface;a.dataset.page=String(l.page);
      a.draggable=false;
      LabLayout.apply(a,l.position);
      if(document.body.classList.contains('owner-mode'))a.setAttribute('aria-description','ドラッグで配置。矢印キーでも移動できます。Shiftで微調整。テープを押すかF2で名前を編集できます。');
      shape.className='object-shape '+l.object;shape.setAttribute('aria-hidden','true');
      label.className='masking-tape';label.textContent=l.label;type.textContent=objects[l.object];
      if(document.body.classList.contains('owner-mode'))label.title='押すとテープの名前を編集できます';
      a.append(shape,label,type);
      if(l.description.trim()){
        const description=document.createElement('span');description.className='object-description';description.id='lab-description-'+(++descriptionIndex);description.textContent=l.description;description.setAttribute('role','tooltip');a.setAttribute('aria-describedby',description.id);a.append(description);
      }
      (l.surface==='shelf'?drawers:container).append(a);
    }
    window.LabScene?.refresh(p);
  }
  window.LabProfile={normalize,render,drawerName,getCurrent:()=>normalize(current)};render(window.LAB_PROFILE);
})();
