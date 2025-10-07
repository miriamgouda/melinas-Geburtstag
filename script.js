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

// Placeholder action for gift button
document.getElementById('giftBtn').addEventListener('click', (e)=>{
  e.preventDefault();
  alert('Sag mir einfach Bescheid, welchen Anbieter du magst (z. B. GetYourGuide, Tinggly, Airbnb Experiences) – dann kommt dein Einlöse-Link!');
});
