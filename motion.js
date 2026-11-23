(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const active=new Map(),pending=new Map();
 const easing='cubic-bezier(.22,1,.36,1)';
 let heroStarted=false;
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting)reveal(entry.target)});
 },{threshold:.08,rootMargin:'0px 0px -4% 0px'});

 function prepare(element,delay=0,duration=760,distance=22){
  if(!element||pending.has(element)||reduced.matches)return;
  pending.set(element,{delay,duration,distance});
  element.classList.add('motion-pending');
 }
 function reveal(element,immediate=false){
  const options=pending.get(element);
  if(!options)return;
  pending.delete(element);observer.unobserve(element);
  element.classList.remove('motion-pending');
  if(immediate||reduced.matches)return;
  const animation=element.animate([
   {opacity:0,translate:`0 ${options.distance}px`},
   {opacity:1,translate:'0 0'}
  ],{duration:options.duration,delay:options.delay,easing,fill:'backwards'});
  active.set(element,animation);
  animation.finished.then(()=>active.delete(element)).catch(()=>{});
 }
 function group(selector,step=85){
  document.querySelectorAll(selector).forEach((element,index)=>{
   prepare(element,Math.min(index*step,300));
   if(pending.has(element))observer.observe(element);
  });
 }

 // Reveal each headline line without altering its typography or semantics.
 const heading=document.querySelector('.hero h1');
 if(heading&&!heading.querySelector('.hero-reveal-line')){
  const lines=[document.createElement('span')];
  [...heading.childNodes].forEach(node=>{
   if(node.nodeName==='BR')lines.push(document.createElement('span'));
   else lines.at(-1).append(node);
  });
  heading.setAttribute('aria-label',lines.map(line=>line.textContent.trim()).join(' '));
  lines.forEach(line=>{line.className='hero-reveal-line';line.setAttribute('aria-hidden','true')});
  heading.replaceChildren(...lines);
 }
 const heroItems=[
  [document.querySelector('.hero-logo'),0,1000,0],
  [document.querySelector('.hero-copy .eyebrow'),80,650,16],
  ...[...document.querySelectorAll('.hero-reveal-line')].map((line,index)=>[line,160+index*100,900,28]),
  [document.querySelector('.hero-details>p'),440,800,20],
  ...[...document.querySelectorAll('.hero .actions>*')].map((button,index)=>[button,560+index*100,700,16])
 ];
 heroItems.forEach(args=>prepare(...args));
 function startHero(){
  if(heroStarted)return;
  heroStarted=true;
  heroItems.forEach(([element])=>reveal(element));
 }
 addEventListener('datavolt:intro-complete',startHero,{once:true});
 if(!document.documentElement.classList.contains('is-preloading'))startHero();

 // Existing pinned tracks, 3D scenes, word reveals and scroll-driven steps
 // keep control of their own transforms. Only their introductory copy enters here.
 [
  '.proof-heading>*','.proof-figure',
  '.campus-intro-copy>*',
  '.deployment-label,.deployment-lead>*',
  '.offers-intro>*',
  '.why-heading>*','.why-row',
  '.backing-layout>div:first-child>.eyebrow,.backing-layout>div:first-child>h2,.backing-layout>div:first-child>p',
  '.partner-badge','.backing-image',
  '.sustainability-intro>*',
  '#news .intro .eyebrow,#news .intro h2,#news .intro p,#news .intro .explore-all',
  '.media-arrows','.media-card',
  '.careers-heading .eyebrow,.careers-heading h2,.careers-copy>*',
  '.careers-banner','.career-path',
  '.faq-introduction>*','.faq details',
  '.footer-intro .eyebrow,.footer-intro h2,.footer-intro h3,.footer-intro p',
  '.closing-panel','.footer-grid>div','.footer-bottom'
 ].forEach(selector=>group(selector));

 // Keyboard navigation and motion preferences must never wait for a reveal.
 document.addEventListener('focusin',event=>{
  for(const element of pending.keys())if(element===event.target||element.contains(event.target))reveal(element,true);
  for(const [element,animation] of active)if(element===event.target||element.contains(event.target))animation.finish();
 });
 reduced.addEventListener('change',()=>{
  if(!reduced.matches)return;
  for(const element of [...pending.keys()])reveal(element,true);
  for(const animation of active.values())animation.finish();
 });
 addEventListener('pagehide',event=>{
  if(event.persisted)return;
  observer.disconnect();active.forEach(animation=>animation.cancel());
 },{once:true});
})();
