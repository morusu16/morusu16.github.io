(() => {
  function transfer(input,id,surface){
    const profile=LabProfile.normalize(input),link=profile.links.find(item=>item.id===id);
    if(!link)throw new Error('Object not found');
    const target=surface==='shelf'?'shelf':'desk';
    if(link.surface===target)return profile;
    const others=profile.links.filter(item=>item.id!==id);
    if(target==='shelf'){
      link.deskPosition={...link.position};
      Object.assign(link,LabLayout.allocate(others,{surface:'shelf'}));
    }else{
      Object.assign(link,LabLayout.allocate(others,{surface:'desk',position:link.deskPosition}));
    }
    return LabProfile.normalize(profile);
  }
  window.LabInventory={transfer};
})();
