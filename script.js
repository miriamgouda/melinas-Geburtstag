// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Reveal cards on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('revealed');
      io.unobserve(e.target);
    }
  });
},{ threshold: .12 });
document.querySelectorAll('.observe').forEach(el => io.observe(el));

// Piano: prefer audio file if present, else WebAudio fallback
const playBtn = document.getElementById('playMusicBtn');
const audioEl = document.getElementById('pianoAudio');
let triedFile = false;
let ctx;

function fallbackPiano(){
  if(!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  const now = ctx.currentTime + 0.05;
  const bpm = 96, beat = 60/bpm, q = beat, e = beat/2, d = beat*1.5;
  const SEMI = 2 ** (1/12);
  const A4 = 440;
  const n = s => A4 * (SEMI ** s);
  const NOTES = {{ 'D4': n(-7), 'E4': n(-5), 'F#4': n(-3), 'G4': n(-2), 'A4': n(0), 'B4': n(2), 'C5': n(3), 'D5': n(5) }};
  let t = now;
  const seq = [
    ['D4', q], ['D4', e], ['E4', q], ['D4', q], ['G4', q], ['F#4', d],
    ['D4', q], ['D4', e], ['E4', q], ['D4', q], ['A4', q], ['G4', d],
    ['D4', q], ['D4', e], ['D5', q], ['B4', q], ['G4', q], ['F#4', q], ['E4', q],
    ['C5', q], ['C5', e], ['B4', q], ['G4', q], ['A4', q], ['G4', d],
  ];
  function piano(freq, start, dur){
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o1.type = 'sine'; o2.type = 'triangle';
    o1.frequency.value = freq; o2.frequency.value = freq*2;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.45, start+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start+dur-0.03);
    o1.connect(g); o2.connect(g); g.connect(ctx.destination);
    o1.start(start); o2.start(start); o1.stop(start+dur); o2.stop(start+dur);
  }
  seq.forEach(([k, dur], i)=>{ piano(NOTES[k], t, dur); t += dur; });
}

playBtn.addEventListener('click', async () => {
  if(!triedFile){
    triedFile = true;
    try{
      await audioEl.play();
      playBtn.textContent = 'Piano läuft ✦';
      playBtn.disabled = true;
      return;
    }catch(e){ /* fall back below */ }
  }
  fallbackPiano();
  playBtn.textContent = 'Piano läuft ✦';
  playBtn.disabled = true;
});

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
document.querySelectorAll('#gallery img').forEach(img => {
  img.addEventListener('click', () => {
    lbImg.src = img.dataset.full || img.src;
    lb.hidden = false;
  });
});
document.querySelector('.lightbox-close').addEventListener('click', () => lb.hidden = true);
lb.addEventListener('click', (e) => {{ if(e.target === lb) lb.hidden = true; }});

// Voucher button placeholder; will be updated once a specific link/file is provided.
document.getElementById('voucherBtn').addEventListener('click', (e)=>{
  // If href is '#', prevent navigation and inform
  if(e.currentTarget.getAttribute('href') === '#'){
    e.preventDefault();
    alert('Sobald dein persönlicher Wunschgutschein-Link/Datei vorliegt, hinterlege ich ihn hier.');
  }
});
