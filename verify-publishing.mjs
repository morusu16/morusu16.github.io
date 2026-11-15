import assert from 'node:assert/strict';
import {validateProfile,validateUpdate,revision,REPOSITORY} from './scripts/profile-schema.mjs';
const current={displayName:'',biography:'',drawerNames:{},links:[]};
const next={displayName:'Researcher',biography:'My room',drawerNames:{0:'論文'},links:[{id:'one',label:'ノート',description:'<script>this stays text</script>',url:'https://example.com/',object:'notebook',surface:'desk',page:0,position:{x:40,y:50}}]};
function event(actor='morusu16',profile=next,base=revision(current)){
  return{repository:{full_name:REPOSITORY,owner:{login:'morusu16'}},issue:{number:1,title:'[研究室の更新] test',user:{login:actor},body:'<!-- lab-profile-update:v1 -->\n```json\n'+JSON.stringify({schemaVersion:1,baseRevision:base,profile})+'\n```\n'},sender:{login:actor}};
}
assert.equal(validateUpdate(event(),current,'morusu16').displayName,'Researcher');
assert.throws(()=>validateUpdate(event('visitor'),current,'visitor'),/owner/);
const modified=event();modified.sender.login='visitor';assert.throws(()=>validateUpdate(modified,current,'visitor'),/owner/);
assert.throws(()=>validateUpdate(event('morusu16',next,'stale'),current,'morusu16'),/changed/);
assert.throws(()=>validateProfile({...next,password:'secret'}),/unsupported/);
assert.throws(()=>validateProfile({...next,links:[{...next.links[0],url:'javascript:alert(1)'}]}),/public web/);
assert.throws(()=>validateProfile({...next,links:[{...next.links[0],url:'https://user:secret@example.com'}]}),/public web/);
assert.throws(()=>validateProfile({...next,links:[{...next.links[0],position:{x:Infinity,y:10}}]}),/outside/);
assert.throws(()=>validateProfile({...next,links:[next.links[0],next.links[0]]}),/duplicated/);
const roundTrip=validateProfile(JSON.parse(JSON.stringify(next)));assert.equal(revision(next),revision(roundTrip));
console.log('PASS: publishing requires the owner, rejects stale updates and unsafe data, preserves plain text; no browser credentials needed.');
