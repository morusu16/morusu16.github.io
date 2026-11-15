const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function element(){return{children:[],dataset:{},style:{},classList:{contains(){return false;}},append(...children){this.children.push(...children)},replaceChildren(){this.children=[]},setAttribute(){}};}
const nodes={},context={window:{LAB_PROFILE:{}},document:{body:element(),querySelector:s=>nodes[s]??=element(),createElement:element},URL};
vm.createContext(context);
for(const script of ['layout','profile-runtime','inventory-model']){
  vm.runInContext(fs.readFileSync('observatory/'+script+'.js','utf8'),context);
  for(const name of ['LabLayout','LabProfile','LabInventory'])if(context.window[name])context[name]=context.window[name];
}
const source=context.LabProfile.normalize({links:Array.from({length:13},(_,i)=>({id:'id-'+i,label:'物 '+i,url:'https://example.com/'+i,object:i%2?'specimen':'notebook'}))});
assert.equal(source.links.filter(l=>l.surface==='desk').length,13,'Items were automatically hidden from the desk');
const original=JSON.stringify(source),originalPosition=JSON.stringify(source.links[2].position);
let archived=context.LabInventory.transfer(source,'id-2','shelf');
assert.equal(JSON.stringify(source),original,'Moving an item mutated the source before save');
assert.equal(archived.links.find(l=>l.id==='id-2').surface,'shelf');
assert.equal(JSON.stringify(archived.links.find(l=>l.id==='id-2').deskPosition),originalPosition);
assert.equal(archived.links.length,source.links.length);
assert.equal(archived.links.filter(l=>l.surface==='desk').length,12);
for(const originalLink of source.links.filter(l=>l.id!=='id-2')){
  assert.equal(JSON.stringify(archived.links.find(l=>l.id===originalLink.id)),JSON.stringify(originalLink),'An unrelated item changed');
}
archived=context.LabProfile.normalize(JSON.parse(JSON.stringify(archived)));
const returned=context.LabInventory.transfer(archived,'id-2','desk');
assert.equal(JSON.stringify(returned.links.find(l=>l.id==='id-2').position),originalPosition,'Returning did not restore the desk position');
context.LabProfile.render(returned);assert.equal(nodes['[data-lab-links]'].children.length,13);
let all=source;
for(const link of source.links)all=context.LabInventory.transfer(all,link.id,'shelf');
assert.equal(all.links.filter(l=>l.surface==='desk').length,0);
assert.equal(all.links.filter(l=>l.page===0).length,6);
assert.equal(all.links.filter(l=>l.page===1).length,6);
assert.equal(all.links.filter(l=>l.page===2).length,1);
context.LabProfile.render(all);assert.equal(nodes['[data-drawer-links]'].children.length,13);
const owner=fs.readFileSync('observatory/owner.html','utf8'),publicPage=fs.readFileSync('observatory/index.html','utf8');
assert(owner.includes('data-desk-inventory')&&owner.includes('data-storage-inventory'));
assert(!publicPage.includes('inventory-model.js')&&!publicPage.includes('data-desk-inventory'));
console.log('PASS: 13 items stay on desk until explicitly stored; one-click archive/return keeps links and original coordinates; overflow goes to another drawer; management stays off public page.');
