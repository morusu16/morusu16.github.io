(() => {
  const button=document.querySelector('[data-publish-profile]'),message=document.querySelector('[data-publish-message]'),fallback=document.querySelector('[data-publish-fallback]'),bodyField=document.querySelector('[data-publish-body]'),openLink=document.querySelector('[data-publish-link]');
  const endpoint='https://github.com/morusu16/morusu16.github.io/issues/new';
  button.onclick=()=>{
    const profile=LabEditor.readDraft();if(!profile)return;
    if(!LabEditor.saveDraft(profile))return;
    if(!window.LAB_REVISION){message.textContent='公開版の手帳で下書きを読み込んでから、公開に反映できます。';fallback.hidden=false;bodyField.hidden=true;openLink.href='https://morusu16.github.io/owner.html';openLink.textContent='公開版の手帳を開く';return;}
    const envelope={schemaVersion:1,baseRevision:window.LAB_REVISION,profile};
    const body='研究室の公開内容を、下の設定に更新します。\n\n<!-- lab-profile-update:v1 -->\n```json\n'+JSON.stringify(envelope,null,2)+'\n```\n';
    if(body.length>64000){message.textContent='公開するデータが大きすぎます。URLや説明を短くしてから、もう一度お試しください。';return;}
    const base=new URL(endpoint);base.searchParams.set('title','[研究室の更新] 手帳の変更を公開');
    const filled=new URL(base);filled.searchParams.set('body',body);
    fallback.hidden=false;openLink.target='_blank';openLink.rel='noopener noreferrer';
    if(filled.href.length<=6500){bodyField.hidden=true;openLink.href=filled.href;openLink.textContent='GitHubで内容を確認して公開';message.textContent='次の確認画面で、あなたのGitHubアカウントから「Create」を押すと公開に反映されます。';}
    else{bodyField.hidden=false;bodyField.value=body;openLink.href=base.href;openLink.textContent='GitHubの確認画面を開く';message.textContent='下の公開内容をコピーして、GitHubの本文欄に貼り付けてから承認してください。';bodyField.focus();bodyField.select();}
  };
})();
