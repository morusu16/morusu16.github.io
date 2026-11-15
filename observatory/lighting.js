(() => {
  const key='personal-lab-light-v1',toggle=document.querySelector('[data-light-toggle]'),range=document.querySelector('[data-light-level]'),output=document.querySelector('[data-light-output]'),message=document.querySelector('[data-light-message]');
  let state={enabled:true,level:70};
  try{const raw=JSON.parse(localStorage.getItem(key));if(raw&&typeof raw.enabled==='boolean'&&Number.isFinite(raw.level))state={enabled:raw.enabled,level:Math.max(5,Math.min(100,Math.round(raw.level)))};}catch{}
  function render(){
    document.documentElement.style.setProperty('--lamp-level',String(state.enabled?state.level/100:0));
    document.documentElement.dataset.light=state.enabled?'on':'off';
    toggle.setAttribute('aria-pressed',String(state.enabled));toggle.setAttribute('aria-label',state.enabled?'天井灯を消す':'天井灯をつける');
    range.value=state.level;range.setAttribute('aria-valuetext',state.enabled?state.level+'パーセント':'消灯中。調整すると点灯します');
    output.textContent=state.enabled?state.level+'%':'消灯';
  }
  function save(){try{localStorage.setItem(key,JSON.stringify(state));message.textContent='';}catch{message.textContent='この端末では明るさを記憶できません。調整はそのまま使えます。';}}
  toggle.onclick=()=>{state.enabled=!state.enabled;render();save();};
  range.oninput=()=>{const value=Number(range.value);if(!Number.isFinite(value))return;state.level=Math.max(5,Math.min(100,Math.round(value)));state.enabled=true;render();save();};
  render();
})();
