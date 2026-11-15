import {createHash} from 'node:crypto';
export const REPOSITORY='morusu16/morusu16.github.io';
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
function record(value,name){if(!value||typeof value!=='object'||Array.isArray(value))throw Error(name+' must be an object');}
function text(value,max,name){if(typeof value!=='string'||value.length>max)throw Error(name+' is invalid');return value;}
function allowed(object,keys,name){for(const key of Object.keys(object))if(!keys.includes(key))throw Error(name+' contains an unsupported field');}
function position(value){record(value,'position');allowed(value,['x','y'],'position');for(const key of ['x','y'])if(!Number.isFinite(value[key])||value[key]<0||value[key]>100)throw Error('position is outside the desk');return{x:value.x,y:value.y};}
export function validateProfile(input){
  record(input,'profile');allowed(input,['displayName','biography','drawerNames','links'],'profile');
  const profile={displayName:text(input.displayName,60,'name'),biography:text(input.biography,1500,'biography'),drawerNames:{},links:[]};
  record(input.drawerNames,'drawer names');
  for(const [key,value]of Object.entries(input.drawerNames)){
    if(!/^(0|[1-9]|1[0-6])$/.test(key))throw Error('drawer number is invalid');
    const name=text(value,40,'drawer name').trim();if(name)profile.drawerNames[key]=name;
  }
  if(!Array.isArray(input.links)||input.links.length>100)throw Error('too many links');
  const ids=new Set(),drawers=new Map();
  for(const link of input.links){
    record(link,'link');allowed(link,['id','label','description','url','object','surface','page','position','deskPosition'],'link');
    const id=text(link.id,128,'link id');if(!id.trim()||ids.has(id))throw Error('link id is empty or duplicated');ids.add(id);
    const label=text(link.label,80,'tape name');if(!label.trim())throw Error('tape name is empty');
    const description=text(link.description??'',140,'description');
    const url=text(link.url,2048,'URL');let parsed;try{parsed=new URL(url);}catch{throw Error('URL is invalid');}
    if(!['https:','http:'].includes(parsed.protocol)||parsed.username||parsed.password)throw Error('URL is not a public web link');
    if(!['monitor','notebook','specimen'].includes(link.object))throw Error('unknown object');
    if(!['desk','shelf'].includes(link.surface)||!Number.isInteger(link.page)||link.page<0||link.page>16||(link.surface==='desk'&&link.page!==0))throw Error('unknown location');
    if(link.surface==='shelf'){const count=(drawers.get(link.page)||0)+1;drawers.set(link.page,count);if(count>6)throw Error('drawer is full');}
    const item={id,label,description,url:parsed.href,object:link.object,surface:link.surface,page:link.page,position:position(link.position)};
    if(own(link,'deskPosition'))item.deskPosition=position(link.deskPosition);
    profile.links.push(item);
  }
  return profile;
}
export function revision(profile){return createHash('sha256').update(JSON.stringify(validateProfile(profile))).digest('hex');}
export function validateUpdate(event,current,actor){
  if(event.repository?.full_name!==REPOSITORY||event.repository?.owner?.login!=='morusu16'||event.issue?.user?.login!=='morusu16'||event.sender?.login!=='morusu16'||actor!=='morusu16')throw Error('Only the repository owner may publish');
  if(!event.issue.title?.startsWith('[研究室の更新]'))throw Error('Not a publishing request');
  const body=event.issue.body||'';if(body.length>65000)throw Error('Publishing request is too large');
  const match=body.match(/<!-- lab-profile-update:v1 -->\s*```json\n([\s\S]*?)\n```\s*$/);if(!match)throw Error('Publishing data was not found');
  const envelope=JSON.parse(match[1]);record(envelope,'request');allowed(envelope,['schemaVersion','baseRevision','profile'],'request');
  if(envelope.schemaVersion!==1||envelope.baseRevision!==revision(current))throw Error('The public site has changed. Reload the public editing page before publishing again.');
  return validateProfile(envelope.profile);
}
