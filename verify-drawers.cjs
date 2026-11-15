const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element{
  constructor(){this.children=[];this.dataset={};this.style={};this.attributes={};this.classes=new Set();this.classList={add:n=>this.classes.add(n),remove:n=>this.classes.delete(n),contains:n=>this.classes.has(n)};this.open=false;}
  append(...items){this.children.push(...items);}
  replaceChildren(){this.children=[];}
  setAttribute(name,value){this.attributes[name]=value;}
  addEventListener(){}
  removeEventListener(){}
  querySelectorAll(selector){return this.children.filter(c=>c.className==='lab-object');}
  focus(){this.focused=true;}
  showModal(){this.open=true;}
  close(){this.open=false;}
}
const selectors=['.laboratory','.desk-items','[data-underdesk]','[data-look-down]','[data-look-up]','[data-drawer-fronts]','#drawer-modal','[data-drawer-links]','[data-drawer-empty]','[data-drawer-title]','[data-cabinet-counter]','[data-previous-cabinet]','[data-next-cabinet]','[data-previous-drawer]','[data-next-drawer]','[data-close-drawer]','[data-lab-links]','[data-researcher-name]','[data-researcher-bio]','[data-profile-status]'];
const nodes=Object.fromEntries(selectors.map(s=>[s,new Element()]));
const context={window:{LAB_PROFILE:{links:Array.from({length:100},(_,i)=>({id:'item-'+i,label:'Link '+i,url:'https://example.com/'+i,object:i%2?'specimen':'notebook',surface:i<6?'desk':'shelf'}))}},document:{body:new Element(),querySelector:s=>nodes[s]||null,createElement:()=>new Element()},URL,matchMedia:()=>({matches:true}),setTimeout,clearTimeout};
vm.createContext(context);
for(const script of ['layout','profile-runtime','scene']){
  vm.runInContext(fs.readFileSync('observatory/'+script+'.js','utf8'),context);
  for(const name of ['LabLayout','LabProfile','LabScene'])if(context.window[name])context[name]=context.window[name];
}
const room=nodes['.laboratory'],under=nodes['[data-underdesk]'],desk=nodes['.desk-items'],tray=nodes['#drawer-modal'],cabinet=nodes['[data-drawer-fronts]'];
assert.equal(room.dataset.camera,'desk');assert.equal(under.inert,true);assert.equal(tray.open,false);
assert.equal(nodes['[data-lab-links]'].children.length,6);
assert.equal(nodes['[data-drawer-links]'].children.length,94);
nodes['[data-look-down]'].onclick();
assert.equal(room.dataset.camera,'under');assert.equal(desk.inert,true);assert.equal(under.inert,false);assert.equal(tray.open,false);
cabinet.children[0].onclick();
assert.equal(tray.open,true);assert.equal(nodes['[data-drawer-title]'].textContent,'引き出し 01');
assert.equal(nodes['[data-drawer-links]'].children.filter(c=>!c.hidden).length,6);
nodes['[data-next-drawer]'].onclick();assert.equal(nodes['[data-drawer-title]'].textContent,'引き出し 02');
nodes['[data-close-drawer]'].onclick();assert.equal(tray.open,false);assert.equal(room.dataset.camera,'under');
nodes['[data-look-up]'].onclick();assert.equal(room.dataset.camera,'desk');assert.equal(desk.inert,false);assert.equal(under.inert,true);
context.LabScene.show('shelf',15);
assert.equal(tray.open,true);assert.equal(nodes['[data-drawer-title]'].textContent,'引き出し 16');
assert.equal(nodes['[data-cabinet-counter]'].textContent,'収納台 3 / 3');
assert.equal(nodes['[data-drawer-links]'].children.filter(c=>!c.hidden).length,4);
context.LabScene.show('desk');assert.equal(tray.open,false);assert.equal(room.dataset.camera,'desk');
// With no links, the desk is empty except for the hand-written notebook,
// and empty physical drawers can still be opened.
context.LabProfile.render({links:[]});
nodes['[data-look-down]'].onclick();cabinet.children[0].onclick();
assert.equal(tray.open,true);assert.equal(nodes['[data-drawer-empty]'].hidden,false);
assert.equal(nodes['[data-lab-links]'].children.length,0);
console.log('PASS: look down/up; cabinet and drawer open/close; 100 physical objects reachable; no inaccessible off-camera controls; empty drawer state.');
context.LabProfile.render({drawerNames:{0:'論文の保管庫',9:'思いつき'},links:[]});
context.LabScene.show('shelf',0);
assert.equal(nodes['[data-drawer-title]'].textContent,'論文の保管庫');
assert.equal(cabinet.children[0].children[1].textContent,'論文の保管庫');
context.LabScene.show('shelf',9);
assert.equal(nodes['[data-drawer-title]'].textContent,'思いつき');
assert.equal(nodes['[data-cabinet-counter]'].textContent,'収納台 2 / 2');
console.log('PASS: renamed drawer fronts and tray headings; named empty drawers remain reachable.');
