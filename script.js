// Variables globals per emmagatzemar la imatge generada
let lastSharedBlob = null;
let lastBlobUrl = null;

// Variables per SignaturePad
const signatureCanvas = document.getElementById('signatureCanvas');
const clearSignatureBtn = document.getElementById('clearSignature');
let signaturePad = null;

// Inicialitzar SignaturePad
if (signatureCanvas) {
  // Ajustar mida del canvas per alta resolució
  function resizeSignatureCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const rect = signatureCanvas.getBoundingClientRect();

    // Guardar contingut actual si existeix
    let data = null;
    if (signaturePad && !signaturePad.isEmpty()) {
      data = signaturePad.toData();
    }

    signatureCanvas.width = rect.width * ratio;
    signatureCanvas.height = rect.height * ratio;
    signatureCanvas.getContext('2d').scale(ratio, ratio);

    // Re-dibuixar si hi havia contingut
    if (signaturePad && data) {
      signaturePad.clear();
      signaturePad.fromData(data);
    }
  }

  // Crear instància de SignaturePad
  signaturePad = new SignaturePad(signatureCanvas, {
    backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent
    penColor: '#333', // Color similar a la font Pacifico
    minWidth: 1,
    maxWidth: 3
  });

  // Mostrar/amagar botó d'esborrar
  signaturePad.addEventListener('endStroke', () => {
    if (clearSignatureBtn) {
      clearSignatureBtn.classList.toggle('visible', !signaturePad.isEmpty());
    }
  });

  // Botó per esborrar
  if (clearSignatureBtn) {
    clearSignatureBtn.addEventListener('click', () => {
      signaturePad.clear();
      clearSignatureBtn.classList.remove('visible');
    });
  }

  // Ajustar canvas al carregar i redimensionar
  window.addEventListener('load', resizeSignatureCanvas);
  window.addEventListener('resize', resizeSignatureCanvas);

  // Inicialitzar immediatament també
  resizeSignatureCanvas();
}

const printBtn = document.getElementById('printBtn');
const printOptions = document.getElementById('printOptions');
const shareBtn = document.getElementById('shareBtn');
const writingArea = document.querySelector('.writing-area');
const paragraphs = writingArea ? Array.from(writingArea.querySelectorAll('p')) : [];
const shareModal = document.getElementById('shareModal');
const shareBody = document.getElementById('shareBody');
const closeShare = document.getElementById('closeShare');
const copyLinkBtn = document.getElementById('copyLink');
const downloadImageBtn = document.getElementById('downloadImage');
const toggleEditOrderBtn = document.getElementById('toggleEditOrder');
function populateEmojiOverlays() {
  const wrapper = document.getElementById('letterWrapper');
  if (!wrapper) return;
  const top = wrapper.querySelector('.emoji-overlay-top');
  const bottom = wrapper.querySelector('.emoji-overlay-bottom');
  const left = wrapper.querySelector('.emoji-overlay-left');
  const right = wrapper.querySelector('.emoji-overlay-right');
  const emojis = ['🎄','⭐','🎁','❄️','🎉','☃️','👑','🔔','🎊','🎆','💝'];
  const wrapperRect = wrapper.getBoundingClientRect();
  const emojiSize = 36; // px
  // Amplada del wrapper (inclou carta + padding pels emojis)
  const horizontalCount = Math.max(1, Math.floor(wrapperRect.width / emojiSize));
  // Alçada disponible pels laterals (descomptant top i bottom overlays)
  // Usem ceil per assegurar que cobreix tota l'alçada
  const verticalSpace = wrapperRect.height - 76; // 38px top + 38px bottom aprox
  const verticalCount = Math.max(1, Math.ceil(verticalSpace / emojiSize));

  function emojiToLocalSrc(e) {
    const codePoints = Array.from(e).map(ch => ch.codePointAt(0).toString(16));
    return `twemoji/svg/${codePoints.join('-')}.svg`;
  }

  function makeImg(ch) {
    const img = document.createElement('img');
    img.alt = ch;
    img.width = emojiSize;
    img.height = emojiSize;
    img.style.display = 'block';
    img.src = emojiToLocalSrc(ch);
    return img;
  }

  if (top) {
    top.innerHTML = '';
    for (let i = 0; i < horizontalCount; i++) {
      const ch = emojis[i % emojis.length];
      const img = makeImg(ch);
      img.style.display = 'inline-block';
      top.appendChild(img);
    }
  }

  if (bottom) {
    bottom.innerHTML = '';
    for (let i = 0; i < horizontalCount; i++) {
      const ch = emojis[i % emojis.length];
      const img = makeImg(ch);
      img.style.display = 'inline-block';
      bottom.appendChild(img);
    }
  }

  if (left) {
    left.innerHTML = '';
    for (let i = 0; i < verticalCount; i++) {
      const ch = emojis[i % emojis.length];
      const img = makeImg(ch);
      left.appendChild(img);
    }
  }

  if (right) {
    right.innerHTML = '';
    for (let i = 0; i < verticalCount; i++) {
      const ch = emojis[i % emojis.length];
      const img = makeImg(ch);
      right.appendChild(img);
    }
  }
}
// Restore print button behaviour
if (printBtn && printOptions) {
  printBtn.addEventListener('click', () => {
    printOptions.classList.toggle('hidden');
  });

  // Tancar desplegable quan es perd el focus (clic fora)
  document.addEventListener('click', (e) => {
    if (!printBtn.contains(e.target) && !printOptions.contains(e.target)) {
      printOptions.classList.add('hidden');
    }
  });
}

function printWithDecorations() {
  document.body.classList.remove('no-decorations');
  window.print();
}

function printWithoutDecorations() {
  document.body.classList.add('no-decorations');
  window.print();
}

writingArea.addEventListener('keydown', (e) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const node = range.startContainer.nodeType === 3 ? range.startContainer.parentElement : range.startContainer;
  const currentP = node.closest('p');
  const index = paragraphs.indexOf(currentP);

  if (e.key === 'Enter') {
    e.preventDefault();
    if (index < paragraphs.length - 1) {
      moveCursorToParagraph(index + 1);
    }
  }
});

writingArea.addEventListener('input', () => {
  paragraphs.forEach((p, i) => {
    if (p.scrollWidth > p.clientWidth && i < paragraphs.length - 1) {

      // Text del paràgraf actual sense espais finals
      let text = p.textContent.replace(/\s+$/, '');
      const words = text.split(' ');
      const movedWord = words.pop();

      // Text que es queda
      p.textContent = words.join(' ');

      const nextP = paragraphs[i + 1];

      // Afegir la paraula al següent paràgraf, sense dobles espais
      nextP.textContent = movedWord + (nextP.textContent ? ' ' + nextP.textContent : '');

      // Posicionar el cursor just després de la paraula moguda
      moveCursorAfterWord(nextP, movedWord);
    }
  });
});

// Share button handler: generate image and open modal; fall back to modal with notice on error
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    const wrapper = document.getElementById('letterWrapper');
    populateEmojiOverlays();
    const prevNoDecor = document.body.classList.contains('no-decorations');

    // Mostrar indicador de càrrega
    shareBtn.disabled = true;
    const originalText = shareBtn.textContent;
    shareBtn.textContent = 'Generant...';

    try {
      document.body.classList.remove('no-decorations');

      // Esperar recursos
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      await waitForImages(wrapper, 3000);

      // Generar canvas del wrapper (inclou carta + emojis)
      let canvas = null;
      try {
        canvas = await html2canvas(wrapper, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        });
      } catch (err) {
        console.error('html2canvas failed:', err);
        alert('No s\'ha pogut generar la imatge: ' + err.message);
        return;
      }

      // Verificar que el canvas s'ha generat
      if (!canvas) {
        console.warn('html2canvas returned null');
        alert('No s\'ha pogut generar la imatge. Torna-ho a provar.');
        return;
      }

      // Convertir a blob (ara amb promesa)
      let blob;
      try {
        blob = await canvasToBlob(canvas);
      } catch (err) {
        console.warn('toBlob failed:', err);
        alert('No s\'ha pogut generar la imatge. Torna-ho a provar.');
        return;
      }

      const blobUrl = URL.createObjectURL(blob);
      lastSharedBlob = blob;
      lastBlobUrl = blobUrl;

      // En mòbil, intentar Web Share API primer
      if (isMobileDevice()) {
        const shared = await shareWithNativeAPI(blob);
        if (shared) {
          // L'usuari ha compartit amb èxit, no cal obrir el modal
          return;
        }
        // Si no s'ha pogut compartir amb l'API nativa, mostrar modal
      }

      // Obrir modal amb la imatge ja generada
      openShareModal({ blob, blobUrl, canvas });

    } finally {
      if (prevNoDecor) document.body.classList.add('no-decorations');
      shareBtn.disabled = false;
      shareBtn.textContent = originalText;
    }
  });
} else {
  console.warn('shareBtn not found; share action unavailable');
}

// Configuration: default order of share targets. Users can edit this array to change order.
const SHARE_TARGETS = [
  { id: 'whatsapp', name: 'WhatsApp', type: 'web', icon: 'https://static.whatsapp.net/rsrc.php/v3/yP/r/rYZqPCBaG70.png', mobileOnly: false },
  { id: 'twitter', name: 'Twitter', type: 'web', icon: 'https://abs-0.twimg.com/responsive-web/client-web/icon-ios.b1fc7275.png', mobileOnly: false },
  { id: 'facebook', name: 'Facebook', type: 'web', icon: 'https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZBER1Vmft.ico', mobileOnly: false },
  { id: 'instagram', name: 'Instagram', type: 'web', icon: 'https://static.cdninstagram.com/rsrc.php/v3/yI/r/VsNE-OHk_8a.png', mobileOnly: true },
  { id: 'bluesky', name: 'Bluesky', type: 'web', icon: 'https://web-cdn.bsky.app/static/favicon.png', mobileOnly: false },
  { id: 'threads', name: 'Threads', type: 'web', icon: 'https://static.cdninstagram.com/rsrc.php/v4/yK/r/-fFyD6YK6t6.png', mobileOnly: false },
  { id: 'mastodon', name: 'Mastodon', type: 'web', icon: 'https://files.mastodon.social/accounts/avatars/000/013/179/original/b4ceb19c9c54ec7e.png', mobileOnly: false }
];

function openShareModal({ blob, blobUrl, canvas }) {
  if (!shareBody) return;
  shareBody.innerHTML = '';

  // Eliminar avisos anteriors
  const oldNotices = document.querySelectorAll('.share-panel > .note');
  oldNotices.forEach(n => n.remove());

  // Store references for copy/download
  if (blob) lastSharedBlob = blob;
  if (blobUrl) {
    lastBlobUrl = blobUrl;
    shareBody.dataset.blobUrl = blobUrl;
  }

  // Filtrar xarxes segons dispositiu
  const isMobile = isMobileDevice();
  const filteredTargets = SHARE_TARGETS.filter(t => !t.mobileOnly || isMobile);

  if (!filteredTargets || filteredTargets.length === 0) {
    const msg = document.createElement('div');
    msg.style.padding = '12px';
    msg.textContent = 'Cap servei configurat.';
    shareBody.appendChild(msg);
  }

  filteredTargets.forEach((target) => {
    const link = document.createElement('a');
    link.className = 'share-button';
    link.href = '#';
    link.dataset.target = target.id;
    link.dataset.blobUrl = blobUrl;
    link.title = target.name;
    link.innerHTML = `<img src="${target.icon}" alt="${target.name}"/><span style="display:none">${target.name}</span>`;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      handleShareTarget(target, { blob, blobUrl, canvas });
    });

    shareBody.appendChild(link);
  });

  // Show modal
  if (shareModal) {
    shareModal.classList.remove('hidden');
    shareModal.setAttribute('aria-hidden', 'false');
  }
}


window.addEventListener('load', () => { populateEmojiOverlays(); });
window.addEventListener('resize', () => { populateEmojiOverlays(); });

if (closeShare) {
  closeShare.addEventListener('click', () => { try { closeModal(); } catch (e) { console.warn('closeModal failed', e); } });
} else if (shareModal) {
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

if (shareModal) {
  shareModal.addEventListener('click', (e) => {
    try {
      if (e.target.classList && e.target.classList.contains('share-backdrop')) closeModal();
    } catch (err) {
      console.warn('Error handling modal click:', err);
    }
  });
}

function closeModal() {
  if (!shareModal) return;
  shareModal.classList.add('hidden');
  shareModal.setAttribute('aria-hidden', 'true');
}

if (copyLinkBtn) {
  copyLinkBtn.addEventListener('click', async () => {
  if (!lastSharedBlob) {
    alert('Cap imatge generada. Torna a prémer "Compartir".');
    return;
  }

  // Try to write the image to the clipboard (most modern Chrome/Edge support this)
  if (navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([new ClipboardItem({ [lastSharedBlob.type]: lastSharedBlob })]);
      alert('Imatge copiada al portapapers. Pots enganxar-la a una aplicació que accepti imatges.');
      return;
    } catch (err) {
      console.warn('No s\'ha pogut copiar la imatge al portapapers:', err);
    }
  }

  // Fallback: copy blob URL (note: blob URLs only work in this browser session)
  try {
    await navigator.clipboard.writeText(lastBlobUrl);
    alert('URL temporal copiada al portapapers. Alguns serveis no podran accedir-hi.');
  } catch (err) {
    // Last resort: open the image in a new tab for manual save
    window.open(lastBlobUrl, '_blank');
  }
  });
} else {
  console.warn('copyLinkBtn not found; copy disabled');
}

if (downloadImageBtn) {
  downloadImageBtn.addEventListener('click', () => {
    if (!lastBlobUrl) {
      alert('Cap imatge generada. Torna a prémer "Compartir".');
      return;
    }
    const link = document.createElement('a');
    link.href = lastBlobUrl;
    link.download = 'carta-als-reis.png';
    link.click();
  });
} else {
  console.warn('downloadImageBtn not found; download disabled');
}

// Handle opening each web target with prefilled compose URL. For desktop, open a new window.
function handleShareTarget(target, { blob, blobUrl, canvas }) {
  const text = encodeURIComponent('Mira la meva carta als Reis d\'Orient 🎁');
  const pageUrl = encodeURIComponent(window.location.href);

  let url;
  switch (target.id) {
    case 'whatsapp':
      // WhatsApp Web o app - no pot adjuntar imatges directament, però podem afegir el text
      url = `https://api.whatsapp.com/send?text=${text}`;
      break;
    case 'twitter':
      url = `https://twitter.com/intent/tweet?text=${text}`;
      break;
    case 'facebook':
      // Facebook Sharer - accepta quote per al text
      url = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${text}`;
      break;
    case 'instagram':
      // Instagram no té web composer - obrir l'app o web
      // L'usuari haurà de copiar la imatge i enganxar-la
      url = `https://www.instagram.com/`;
      break;
    case 'bluesky':
      url = `https://bsky.app/compose?text=${text}`;
      break;
    case 'threads':
      // Threads no té endpoint de composició pública
      url = `https://www.threads.net/`;
      break;
    case 'mastodon':
      // Mastodon.social per defecte, els usuaris poden canviar-ho
      const instance = 'https://mastodon.social';
      url = `${instance}/share?text=${text}`;
      break;
    default:
      url = `https://twitter.com/intent/tweet?text=${text}`;
  }

  // Open the compose URL in a new window/tab
  window.open(url, '_blank', 'noopener');

  // Close the modal after opening
  closeModal();
}

// Wait for images inside a container to load, with timeout
function waitForImages(container, timeout = 2000) {
  return new Promise((resolve) => {
    const imgs = Array.from(container.querySelectorAll('img'));
    if (!imgs.length) return resolve();
    let remaining = imgs.length;
    const timer = setTimeout(() => resolve(), timeout);
    imgs.forEach(img => {
      if (img.complete) {
        remaining -= 1;
        if (remaining === 0) { clearTimeout(timer); resolve(); }
      } else {
        img.addEventListener('load', () => {
          remaining -= 1;
          if (remaining === 0) { clearTimeout(timer); resolve(); }
        });
        img.addEventListener('error', () => {
          remaining -= 1;
          if (remaining === 0) { clearTimeout(timer); resolve(); }
        });
      }
    });
  });
}

// Promisifica canvas.toBlob per poder usar await
function canvasToBlob(canvas, type = 'image/png') {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('No s\'ha pogut generar el blob'));
    }, type);
  });
}

// Detecta si estem en un dispositiu mòbil
function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Intenta compartir amb l'API nativa del navegador (mòbils)
async function shareWithNativeAPI(blob) {
  const file = new File([blob], 'carta-als-reis.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'La meva carta als Reis d\'Orient',
        text: 'Mira la meva carta als Reis d\'Orient! 🎁',
        files: [file]
      });
      return true;
    } catch (err) {
      // L'usuari ha cancel·lat o hi ha hagut un error
      if (err.name !== 'AbortError') {
        console.warn('Error compartint:', err);
      }
      return false;
    }
  }
  return false;
}

function moveCursorToParagraph(index) {
  const p = paragraphs[index];
  const range = document.createRange();
  range.selectNodeContents(p);
  range.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function moveCursorAfterWord(p, word) {
  const textNode = p.firstChild;
  if (!textNode) return;

  const pos = textNode.textContent.indexOf(word) + word.length;
  const range = document.createRange();
  range.setStart(textNode, pos);
  range.collapse(true);

  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
