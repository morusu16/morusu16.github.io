// Public profile only. Never put passwords or access tokens in this file.
// A blank name displays a neutral placeholder until the researcher chooses one.
window.LAB_PROFILE = {
  displayName: '',
  biography: '',
  drawerNames: {},
  links: []
  // Each link: { id: 'stable-unique-id', label: 'GitHub', url: 'https://...', object: 'monitor' }
  // object may be 'monitor', 'notebook', or 'specimen'.
  // position: { x: 65, y: 30 } stores the desk placement as percentages (0–100).
  // surface: 'desk' or 'shelf' (drawer); page: 0-based drawer number.
  // Drawers hold six items each. Desk items are only archived by the owner's choice.
  // label is the masking-tape name; description is the short hover/touch note.
  // drawerNames: { '0': '資料', '1': '日記' } renames drawers without moving their contents.
};
