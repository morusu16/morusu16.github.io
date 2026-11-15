(() => {
  const dialog = document.querySelector('#lab-reader');
  const profile = LabProfile.normalize(window.LAB_PROFILE);
  document.querySelector('[data-reader-name]').textContent = profile.displayName.trim() || '研究員証';
  document.querySelector('[data-reader-bio]').textContent = profile.biography.trim() || 'この手帳は、これから少しずつ埋まっていきます。';
  const links = document.querySelector('[data-reader-links]');
  for (const link of profile.links) {
    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.textContent = link.label;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    links.append(anchor);
  }
  document.querySelector('[data-reader-empty]').hidden = !!profile.links.length;
  document.querySelector('[data-open-reader]').onclick = () => LabBook.open(dialog);
  document.querySelector('[data-close-reader]').onclick = () => LabBook.close(dialog);
  dialog.addEventListener('cancel', event => { event.preventDefault(); LabBook.close(dialog); });
})();
