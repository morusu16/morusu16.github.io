(() => {
  const key='personal-lab-profile-draft-v1', published=LabProfile.normalize(window.LAB_PROFILE);
  let saved=published, hasDraft=false, editing, filling=false;
  const dialog=document.querySelector('#lab-editor'), form=dialog.querySelector('form'), list=dialog.querySelector('[data-editor-links]'),message=dialog.querySelector('[data-editor-message]'),template=document.querySelector('#link-fields-template');
  const drawerFields=dialog.querySelector('[data-drawer-label-fields]');
  function tell(text,error=false){message.textContent=text;message.classList.toggle('editor-error',error);}
  try { const raw=localStorage.getItem(key);if(raw){saved=LabProfile.normalize(JSON.parse(raw));hasDraft=true;} }catch{}
  LabProfile.render(saved,hasDraft);
  function renumber(){[...list.children].forEach((row,i)=>row.querySelector('legend').textContent=`置く物 ${i+1}`);dialog.querySelector('[data-empty-links]').hidden=!!list.children.length;if(!filling)updateInventory();}
  function readDrawerNames(){const names={};for(const input of drawerFields.querySelectorAll('[data-drawer-number]')){if(input.value.trim())names[input.dataset.drawerNumber]=input.value.trim().slice(0,40);}return names;}
  function drawerCount(){return Math.min(17,Math.max(6,...[...list.children].filter(row=>row.labSurface==='shelf').map(row=>row.labPage+1),...Object.keys(readDrawerNames()).map(key=>Number(key)+1)));}
  function addDrawerField(index,value=''){
    const label=document.createElement('label'),number=document.createElement('span'),input=document.createElement('input');label.className='drawer-label-field';number.textContent=String(index+1).padStart(2,'0');input.type='text';input.maxLength=40;input.dataset.drawerNumber=String(index);input.value=value;input.placeholder='引き出し '+String(index+1).padStart(2,'0');input.setAttribute('aria-label',`引き出し ${index+1} の名前`);label.append(number,input);drawerFields.append(label);
  }
  function ensureDrawerFields(){for(let index=drawerFields.children.length;index<drawerCount();index++)addDrawerField(index);}
  function fillDrawerFields(p){drawerFields.replaceChildren();const count=Math.max(6,...p.links.filter(l=>l.surface==='shelf').map(l=>l.page+1),...Object.keys(p.drawerNames).map(key=>Number(key)+1));for(let i=0;i<count;i++)addDrawerField(i,p.drawerNames[i]||'');}
  function updateInventory(){
    ensureDrawerFields();const drawerNames=readDrawerNames();
    const deskList=dialog.querySelector('[data-desk-inventory]'),storageList=dialog.querySelector('[data-storage-inventory]');
    deskList.replaceChildren();storageList.replaceChildren();let deskCount=0,storageCount=0;
    const objectNames={monitor:'モニター',notebook:'ノート',specimen:'標本瓶'};
    for(const row of list.children){
      const label=row.querySelector('[name=label]').value.trim(),url=row.querySelector('[name=url]').value.trim(),stored=row.labSurface==='shelf';
      const entry=document.createElement('li'),description=document.createElement('div'),name=document.createElement('strong'),detail=document.createElement('small'),button=document.createElement('button');
      entry.className='inventory-item';description.className='inventory-description';name.textContent=label||'新しいリンク（入力中）';
      detail.textContent=objectNames[row.querySelector('[name=object]').value]+(stored?` · ${LabProfile.drawerName({drawerNames},row.labPage)}`:' · 机上');
      button.type='button';button.className='inventory-transfer';button.dataset.inventoryId=row.dataset.linkId;
      button.textContent=stored?'机に戻す':'保管庫へ送る';
      let valid=false;try{valid=!!label&&['http:','https:'].includes(new URL(url).protocol);}catch{}
      button.disabled=!valid;button.onclick=()=>transfer(row.dataset.linkId,stored?'desk':'shelf');
      description.append(name,detail);entry.append(description,button);(stored?storageList:deskList).append(entry);
      if(stored)storageCount++;else deskCount++;
    }
    dialog.querySelector('[data-desk-count]').textContent=`${deskCount} 個`;
    dialog.querySelector('[data-storage-count]').textContent=`${storageCount} 個`;
    dialog.querySelector('[data-desk-empty]').hidden=!!deskCount;dialog.querySelector('[data-storage-empty]').hidden=!!storageCount;
  }
  function transfer(id,surface){
    const input=read();if(!input){tell('入力中の名前とURLを確認してください。',true);return;}
    const next=LabInventory.transfer(input,id,surface),link=next.links.find(item=>item.id===id);
    try{localStorage.setItem(key,JSON.stringify(next));}catch{tell('保存できなかったため、置き場所は変更していません。',true);return;}
    saved=next;editing=null;hasDraft=true;LabProfile.render(saved,true);fill(saved);
    tell(surface==='shelf'?`「${link.label}」を「${LabProfile.drawerName(next,link.page)}」へ送りました。この端末に保存済みです。`:`「${link.label}」を机に戻しました。この端末に保存済みです。`);
    [...dialog.querySelectorAll('[data-inventory-id]')].find(button=>button.dataset.inventoryId===id)?.focus({preventScroll:true});
  }
  function occupied(except){return [...list.children].filter(row=>row!==except).map(row=>({surface:row.labSurface,page:row.labPage,position:row.labPosition}));}
  function setPlace(row,requested){
    if(row.labSurface==='desk'&&requested.surface==='shelf')row.labDeskPosition={...row.labPosition};
    if(row.labSurface==='shelf'&&requested.surface==='desk'&&row.labDeskPosition)requested={...requested,position:row.labDeskPosition};
    const placement=LabLayout.allocate(occupied(row),requested);
    row.labPosition=placement.position;row.labSurface=placement.surface;row.labPage=placement.page;
    row.querySelector('[name=surface]').value=placement.surface;
    row.querySelector('[data-place-label]').textContent=placement.surface==='shelf'?LabProfile.drawerName({drawerNames:readDrawerNames()},placement.page):'作業机';
    return placement;
  }
  function addLink(link={id:crypto.randomUUID(),label:'',url:'',object:'monitor'}){
    if(list.children.length>=100){tell('リンクは100個まで置けます。',true);return;}
    const fragment=template.content.cloneNode(true),row=fragment.querySelector('fieldset');row.dataset.linkId=link.id;
    row.labDeskPosition=link.deskPosition?{...link.deskPosition}:null;
    setPlace(row,link);
    row.querySelector('[name=surface]').onchange=event=>{
      const requested=event.target.value,place=setPlace(row,{surface:requested});
      tell('置き場所を変更しました。保存すると下書きに反映します。');updateInventory();
    };
    for(const name of ['label','url','object'])row.querySelector(`[name=${name}]`).value=link[name];
    row.querySelector('[name=description]').value=link.description||'';
    row.querySelector('button').onclick=()=>{row.remove();renumber();tell('リンクを取り除きました。保存すると下書きに反映します。');};list.append(fragment);renumber();return row;
  }
  function fill(p){filling=true;form.elements.displayName.value=p.displayName;form.elements.biography.value=p.biography;fillDrawerFields(p);list.replaceChildren();p.links.forEach(addLink);filling=false;renumber();}
  function read(){
    const links=[];
    for(const row of list.children){
      const label=row.querySelector('[name=label]'),field=row.querySelector('[name=url]');
      label.setCustomValidity(label.value.trim()?'':'リンクの名前を入力してください。');if(!label.reportValidity())return null;
      field.setCustomValidity('');let url;try{url=new URL(field.value);}catch{field.setCustomValidity('https:// から始まるURLを入力してください。');}
      if(url&&!['https:','http:'].includes(url.protocol))field.setCustomValidity('http:// または https:// のURLを入力してください。');if(!field.reportValidity())return null;
      links.push({id:row.dataset.linkId,label:label.value.trim(),description:row.querySelector('[name=description]').value,url:url.href,object:row.querySelector('[name=object]').value,position:row.labPosition,surface:row.labSurface,page:row.labPage,...(row.labDeskPosition?{deskPosition:row.labDeskPosition}: {})});
    }
    return LabProfile.normalize({displayName:form.elements.displayName.value,biography:form.elements.biography.value,drawerNames:readDrawerNames(),links});
  }
  document.querySelector('[data-open-editor]').onclick=()=>{fill(editing||saved);tell('');LabBook.open(dialog);};
  document.addEventListener('lab:edit-object',event=>{
    function open(){fill(editing||saved);tell('テープの名前と説明を編集できます。保存すると下書きに反映します。');LabBook.open(dialog);const row=[...list.children].find(item=>item.dataset.linkId===event.detail.id);if(row){row.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});row.querySelector('[name=label]').focus({preventScroll:true});}}
    LabScene.withDrawerClosed(open);
  });
  function lowerBook(after){LabBook.close(dialog,after);}
  function close(){lowerBook(()=>{editing=null;LabProfile.render(saved,hasDraft);});}
  dialog.querySelector('[data-close-editor]').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.querySelector('[data-add-link]').onclick=()=>addLink()?.querySelector('input').focus();
  dialog.querySelector('[data-preview-profile]').onclick=()=>{const p=read();if(!p)return;editing=p;LabProfile.render(p,true);lowerBook(()=>LabScene.show('desk'));};
  form.onsubmit=e=>{e.preventDefault();const p=read();if(!p)return;try{localStorage.setItem(key,JSON.stringify(p));}catch{tell('このブラウザでは保存できません。「下書きの持ち出し」から書き出してください。',true);return;}saved=p;editing=null;hasDraft=true;LabProfile.render(saved,true);tell('この端末に下書きを保存しました。公開中の内容は変わりません。');};
  form.addEventListener('input',e=>{e.target.setCustomValidity?.('');if(list.contains(e.target)||drawerFields.contains(e.target))updateInventory();});
  document.addEventListener('lab:place-object',event=>{
    const data=LabProfile.getCurrent(),link=data.links.find(l=>l.id===event.detail.id);
    if(!link)return;
    link.position=LabLayout.snap(event.detail.position,link.surface);
    let success=false;
    try{localStorage.setItem(key,JSON.stringify(data));saved=data;editing=null;hasDraft=true;success=true;}catch{}
    if(success)LabProfile.render(saved,true);else LabProfile.render(editing||saved,hasDraft);
    document.dispatchEvent(new CustomEvent('lab:placement-result',{detail:{saved:success,message:success?'配置をこの端末の下書きに保存しました。':'配置を保存できませんでした。元の位置に戻しました。'}}));
  });
  dialog.querySelector('[data-show-published]').onclick=()=>{lowerBook(()=>{editing=null;LabProfile.render(published,false);});};
  dialog.querySelector('[data-export-profile]').onclick=()=>{const p=read();if(!p)return;const url=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)+'\n'],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='research-room-draft.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);tell('下書きを書き出しました。別の端末にも読み込めます。');};
  const fileInput=dialog.querySelector('[data-profile-file]');dialog.querySelector('[data-import-profile]').onclick=()=>fileInput.click();
  fileInput.onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>500000)throw Error();const data=JSON.parse(await file.text());if(!data||typeof data.displayName!=='string'||typeof data.biography!=='string'||!Array.isArray(data.links))throw Error();const p=LabProfile.normalize(data);if(p.links.length!==data.links.length)throw Error();fill(p);tell('読み込みました。内容を確認して保存してください。');}catch{tell('研究室で書き出した下書きファイルを選んでください。',true);}e.target.value='';};
  window.LabEditor={readDraft:read,saveDraft(profile){try{localStorage.setItem(key,JSON.stringify(profile));}catch{tell('このブラウザでは下書きを保存できません。書き出して保管してください。',true);return false;}saved=profile;editing=null;hasDraft=true;LabProfile.render(saved,true);return true;}};
})();
