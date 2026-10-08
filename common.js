// 送信と受信の共通処理
(function () {
  const C = window.HIROBA || {};
  const isClosed = () => C.CLOSE_AT && new Date() >= new Date(C.CLOSE_AT);

  async function post(data) {
    // text/plain で送ると、GoogleスクリプトにCORSの事前確認なしで届く
    const res = await fetch(C.API, { method: 'POST', body: JSON.stringify(data) });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'error');
    return json;
  }
  async function get(action) {
    const res = await fetch(C.API + '?action=' + encodeURIComponent(action));
    return res.json();
  }
  function toast(el, msg, isErr) {
    el.textContent = msg;
    el.classList.toggle('err', !!isErr);
    if (!isErr) setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 4000);
  }
  function chipGroup(box, values) {
    let picked = '';
    values.forEach(v => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = v; b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => {
        picked = picked === v ? '' : v;
        [...box.children].forEach(x => x.setAttribute('aria-pressed', String(x.textContent === picked)));
      });
      box.appendChild(b);
    });
    return { value: () => picked, reset: () => { picked = ''; [...box.children].forEach(x => x.setAttribute('aria-pressed', 'false')); } };
  }
  function errorText(e) {
    if (String(e.message) === 'closed') return '受付は終わりました。ありがとうございました。';
    if (String(e.message) === 'empty') return '何か書いてから送ってください。';
    return '送れませんでした。電波を確認して、もう一度押してください。';
  }
  window.Hiroba = { C, isClosed, post, get, toast, chipGroup, errorText };
})();
