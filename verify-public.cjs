const fs=require('node:fs');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const root='observatory/';
const page=fs.readFileSync(root+'index.html','utf8');
const owner=fs.readFileSync(root+'owner.html','utf8');
assert(!/<(?:form|textarea|select)\b/.test(page));
// A viewer may adjust local lighting, but cannot edit the public profile.
assert([...page.matchAll(/<input\b[^>]*>/g)].every(match=>/type="range"/.test(match[0])&&/data-light-level/.test(match[0])));
assert(!page.includes('editor.js'));
assert(!page.includes('data-open-editor'));
assert(!page.includes('placement.js'));
assert(owner.includes('editor.js') && owner.includes('book.js'));
assert(page.includes('reader.js'));
const reader=fs.readFileSync(root+'reader.js','utf8');
assert(!/localStorage|fetch\s*\(|XMLHttpRequest/.test(reader));
for(const file of ['index.html','owner.html']){
  const text=fs.readFileSync(root+file,'utf8');
  for(const match of text.matchAll(/(?:src|href)="([^"#]+)"/g)){
    if(!match[1].includes(':'))assert(fs.existsSync(root+match[1]),'Missing asset: '+match[1]);
  }
}
const room=fs.readFileSync(root+'room.js','utf8');
for(const signal of ['pauseAnimations','prefers-reduced-motion','visibilitychange'])assert(room.includes(signal));
assert(fs.statSync(root+'assets/laboratory.png').size>10000);
// Execute the public scripts with storage access forbidden. A personal draft must
// never alter what this page shows, even in the owner's browser.
function element(){return{children:[],dataset:{},style:{},classList:{remove(){},contains(){return false;}},textContent:'',append(...children){this.children.push(...children)},replaceChildren(){this.children=[]},setAttribute(){},addEventListener(){}};}
const nodes={};
const context={window:{LAB_PROFILE:{displayName:'Public researcher',biography:'Public bio',links:[{id:'safe',label:'GitHub',url:'https://github.com/morusu16',object:'monitor'},{id:'unsafe',label:'bad',url:'javascript:alert(1)'}]}},document:{body:element(),querySelector(selector){return nodes[selector]??=element();},createElement:element},URL};
Object.defineProperty(context,'localStorage',{get(){throw Error('Public page read private draft storage');}});
vm.createContext(context);
vm.runInContext(fs.readFileSync(root+'layout.js','utf8'),context);
context.LabLayout=context.window.LabLayout;
vm.runInContext(fs.readFileSync(root+'profile-runtime.js','utf8'),context);
context.LabProfile=context.window.LabProfile;
vm.runInContext(reader,context);
assert.equal(nodes['[data-researcher-name]'].textContent,'Public researcher');
assert.equal(nodes['[data-reader-name]'].textContent,'Public researcher');
assert.equal(nodes['[data-lab-links]'].children.length,1);
assert.equal(nodes['[data-reader-links]'].children.length,1);
assert.equal(nodes['[data-reader-links]'].children[0].rel,'noopener noreferrer');
assert.equal(nodes['[data-profile-status]'].hidden,true);
const layout=context.LabLayout;
assert.equal(layout.drag({x:50,y:50},100,50,1000,200,100).x,60);
assert.equal(layout.drag({x:50,y:50},100,50,1000,200,100).y,75);
assert.equal(layout.drag({x:50,y:50},-99999,99999,1000,200,100).x,5);
assert.equal(layout.drag({x:50,y:50},-99999,99999,1000,200,100).y,100);
assert.equal(layout.position({x:NaN,y:Infinity}).x,58);
const example={displayName:'Example',links:[{id:'first',label:'one',url:'https://example.com',object:'specimen',position:{x:81,y:33}},{id:'second',label:'two',url:'https://example.org',object:'monitor',position:{x:42,y:72}}]};
const persisted=JSON.parse(JSON.stringify(context.LabProfile.normalize(example)));
persisted.links.reverse();persisted.links[0].label='renamed';
const restored=context.LabProfile.normalize(persisted);
assert.equal(restored.links.find(l=>l.id==='first').position.x,81);
assert.equal(restored.links.find(l=>l.id==='second').position.y,72);
context.LabProfile.render(restored);
assert.equal(nodes['[data-lab-links]'].children[0].style.left,'42%');
assert.equal(nodes['[data-lab-links]'].children[0].style.top,'72%');
const many=context.LabProfile.normalize({links:Array.from({length:100},(_,i)=>({id:'item-'+i,label:'Link '+i,url:'https://example.com/'+i,object:'monitor',surface:i<6?'desk':'shelf'}))});
assert.equal(many.links.length,100);
assert.equal(many.links.filter(l=>l.surface==='desk').length,6);
const groups=new Map();
for(const link of many.links){
  const key=link.surface+':'+link.page;
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(link);
}
for(const group of groups.values()){
  if(group[0].surface==='shelf')assert(group.length<=6,'A drawer is overcrowded');
  assert.equal(new Set(group.map(l=>`${l.position.x},${l.position.y}`)).size,group.length,'New objects overlap');
}
const back=context.LabProfile.normalize(JSON.parse(JSON.stringify(many)));
assert.equal(JSON.stringify(back),JSON.stringify(many),'Shelf assignment changed after saving');
const afterDelete=many.links.filter(l=>l.id!=='item-0');
const added=layout.allocate(afterDelete);
assert.equal(added.surface,'desk');
assert(!afterDelete.some(l=>l.surface==='desk'&&l.position.x===added.position.x&&l.position.y===added.position.y),'Reusing a free desk slot overlapped an object');
assert.equal(layout.snap({x:40,y:15},'shelf').y,15);
assert.equal(layout.snap({x:40,y:75},'shelf').y,75);
assert.equal(layout.snap({x:40,y:57},'desk').y,57);
console.log('PASS: public read-only; drag bounds and saved coordinates; 100 links retained; max 6 per drawer; free slots reused; stored positions stable after reload.');
