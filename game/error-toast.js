// Surface any JS error visibly via the #errBox element.
export function wireErrorToast() {
  const box = document.getElementById('errBox');
  function show(msg) {
    if (!box) return;
    box.textContent = msg;
    box.classList.add('show');
  }
  window.addEventListener('error', (e) =>
    show('ERR: ' + (e.message || e.error) + '\n@ ' + (e.filename || '') + ':' + e.lineno));
  window.addEventListener('unhandledrejection', (e) => show('PROMISE ERR: ' + e.reason));
  window.__errShow = show;
}
