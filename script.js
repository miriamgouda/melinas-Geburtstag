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

// --- Music: modern, soft synth "Happy Birthday" with WebAudio API ---
let audioCtx = null;
function playNote(freq, startTime, duration, type='sine'){
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, startTime);
  g.gain.exponentialRampToValueAtTime(0.3, startTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration - 0.02);
  o.connect(g).connect(audioCtx.destination);
  o.start(startTime);
  o.stop(startTime + duration);
}

function playChord(freqs, startTime, duration){
  freqs.forEach(f => playNote(f, startTime, duration, 'triangle'));
}

function happyBirthday(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const now = audioCtx.currentTime + 0.05;
  const bpm = 108; // modern moderate tempo
  const beat = 60 / bpm;
  const q = beat;        // quarter note
  const e = beat/2;      // eighth
  const d = beat*1.5;    // dotted quarter

  // Helper to map note names to Hz (A4=440)
  const A4 = 440;
  const SEMI = 2 ** (1/12);
  const notes = {
    C4: A4 * (SEMI ** (-9)),
    D4: A4 * (SEMI ** (-7)),
    E4: A4 * (SEMI ** (-5)),
    F4: A4 * (SEMI ** (-4)),
    G4: A4 * (SEMI ** (-2)),
    A4: A4,
    B4: A4 * (SEMI ** (2)),
    C5: A4 * (SEMI ** (3)),
    D5: A4 * (SEMI ** (5)),
    E5: A4 * (SEMI ** (7)),
    F5: A4 * (SEMI ** (8)),
    G5: A4 * (SEMI ** (10)),
  };

  let t = now;
  // Arrangement in G major (starting on D)
  const melody = [
    ['D4', q], ['D4', e], ['E4', q], ['D4', q], ['G4', q], ['F#4', d],
    ['D4', q], ['D4', e], ['E4', q], ['D4', q], ['A4', q], ['G4', d],
    ['D4', q], ['D4', e], ['D5', q], ['B4', q], ['G4', q], ['F#4', q], ['E4', q],
    ['C5', q], ['C5', e], ['B4', q], ['G4', q], ['A4', q], ['G4', d],
  ];

  // Add missing note frequencies
  notes['F#4'] = A4 * (SEMI ** (-3));
  notes['D5']  = A4 * (SEMI ** (5));
  notes['C5']  = A4 * (SEMI ** (3));

  melody.forEach(([n, dur], i) => {
    const freq = notes[n];
    playNote(freq, t, dur, 'sine');
    // soft pad chord on downbeats
    if(i % 3 === 0){
      playChord([freq/2, freq/1.5], t, dur*1.2);
    }
    t += dur;
  });
}

document.getElementById('playMusicBtn').addEventListener('click', () => {
  happyBirthday();
  const btn = document.getElementById('playMusicBtn');
  btn.textContent = 'Musik läuft ✦';
  btn.disabled = true;
});

// Placeholder action for gift button (kept in case you want a custom flow)
document.querySelectorAll('#gift a, #gift .btn').forEach(el=>{
  // no-op; real link points to Wunschgutschein
});
