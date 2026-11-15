const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function element(){return{children:[],dataset:{},style:{},attributes:{},classList:{contains(){return false;}},append(...children){this.children.push(...children)},replaceChildren(){this.children=[]},setAttribute(key,value){this.attributes[key]=value;}};}
const nodes={},context={window:{LAB_PROFILE:{}},document:{body:element(),querySelector:s=>nodes[s]??=element(),createElement:element},URL};
vm.createContext(context);
for(const script of ['layout','profile-runtime','inventory-model']){
  vm.runInContext(fs.readFileSync('observatory/'+script+'.js','utf8'),context);
  for(const key of ['LabLayout','LabProfile','LabInventory'])if(context.window[key])context[key]=context.window[key];
}
const name='長いマスキングテープの名前'.repeat(3),description='<img src=x onerror=alert(1)> ここには読んだ論文を置く。';
const p=context.LabProfile.normalize({drawerNames:{0:' 論文 ',1:'',16:'予備',99:'ignored'},links:[{id:'paper',label:name,description,url:'https://example.com',object:'notebook',position:{x:10,y:70}}]});
assert.equal(p.drawerNames[0],'論文');assert.equal(p.drawerNames[1],undefined);assert.equal(p.drawerNames[99],undefined);
assert.equal(context.LabProfile.drawerName(p,1),'引き出し 02');
context.LabProfile.render(p);
const link=nodes['[data-lab-links]'].children[0],tape=link.children[1],note=link.children[3];
assert.equal(tape.className,'masking-tape');assert.equal(tape.textContent,name);assert.equal(note.textContent,description);
assert.equal(note.attributes.role,'tooltip');assert.equal(link.attributes['aria-describedby'],note.id);
assert.equal(link.dataset.edge,'left');
const archived=context.LabInventory.transfer(p,'paper','shelf');
const reloaded=context.LabProfile.normalize(JSON.parse(JSON.stringify(archived)));
const returned=context.LabInventory.transfer(reloaded,'paper','desk');
assert.equal(returned.drawerNames[0],'論文');assert.equal(returned.links[0].description,description);assert.equal(returned.links[0].label,name);
assert.equal(returned.links[0].position.x,10);
const legacy=context.LabProfile.normalize({links:[{id:'legacy',label:'Old link',url:'https://example.org'}]});
assert.equal(legacy.links[0].description,'');assert.equal(Object.keys(legacy.drawerNames).length,0);
const css=fs.readFileSync('observatory/labels.css','utf8');assert(css.includes('width:max-content'));assert(css.includes('overflow-wrap:anywhere'));
console.log('PASS: long tape text retained, descriptions rendered as plain text, tooltip accessibility, renamed drawers and descriptions survive archive/export/reload/return, legacy drafts supported.');
