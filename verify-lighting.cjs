const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('observatory/lighting.js','utf8');
function boot(initial,blocked=false){
  const style={},root={style:{setProperty(name,value){style[name]=value;}},dataset:{}},nodes={},writes=[];
  const storage={getItem(key){assert.equal(key,'personal-lab-light-v1');if(blocked)throw Error();return initial??null;},setItem(key,value){assert.equal(key,'personal-lab-light-v1');if(blocked)throw Error();writes.push(value);}};
  const context={document:{documentElement:root,querySelector(selector){return nodes[selector]??={attributes:{},setAttribute(key,value){this.attributes[key]=value;}};}},localStorage:storage};
  vm.createContext(context);vm.runInContext(source,context);return{nodes,style,root,writes};
}
const first=boot(),toggle=first.nodes['[data-light-toggle]'],range=first.nodes['[data-light-level]'];
assert.equal(first.style['--lamp-level'],'0.7');
toggle.onclick();assert.equal(first.style['--lamp-level'],'0');assert.equal(toggle.attributes['aria-pressed'],'false');assert.equal(first.nodes['[data-light-output]'].textContent,'消灯');
toggle.onclick();assert.equal(first.style['--lamp-level'],'0.7');
range.value='26';range.oninput();assert.equal(first.style['--lamp-level'],'0.26');
toggle.onclick();assert.equal(first.style['--lamp-level'],'0');toggle.onclick();assert.equal(first.style['--lamp-level'],'0.26');
const reload=boot(first.writes.at(-1));assert.equal(reload.style['--lamp-level'],'0.26');
assert.equal(boot('{bad').style['--lamp-level'],'0.7');
assert.equal(boot(JSON.stringify({enabled:true,level:900})).style['--lamp-level'],'1');
assert.equal(boot(JSON.stringify({enabled:true,level:-12})).style['--lamp-level'],'0.05');
const blocked=boot(null,true);blocked.nodes['[data-light-toggle]'].onclick();assert.equal(blocked.style['--lamp-level'],'0');assert(blocked.nodes['[data-light-message]'].textContent.length>0);
const css=fs.readFileSync('observatory/lighting.css','utf8');assert(css.includes('.chemical-light'));assert(css.includes('.object-shape.specimen'));assert(css.includes('prefers-reduced-motion'));
console.log('PASS: dimmer, on/off restores previous brightness, per-device persistence, malformed settings and unavailable storage handled; no profile storage accessed.');
