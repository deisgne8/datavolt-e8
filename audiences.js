(() => {
 const section=document.querySelector('#audiences');if(!section)return;
 const film=section.querySelector('.audience-film'),video=film.querySelector('video');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const cards=section.querySelector('.audience-cards');
 const items=[...cards.children];
 const shell=section.querySelector('.audience-scroll-shell');
 const stage=section.querySelector('.audience-scroll-stage');
 const desktop=matchMedia('(min-width:1101px) and (pointer:fine)');
 const previous=section.querySelector('.audience-prev'),next=section.querySelector('.audience-next');
 const status=section.querySelector('.audience-carousel-status');
 section.classList.add('audience-reveal-ready');
 const introObserver=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting)){
   section.classList.add('audience-intro-visible');
   introObserver.disconnect();
  }
 },{threshold:.25});
 introObserver.observe(stage);
 let frame=0,lastTime=0,current=0,start=0,range=1,index=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 function render(time=performance.now()){
  frame=0;
  if(!section.classList.contains('audience-pinned'))return;
  start=shell.getBoundingClientRect().top+scrollY;
  const target=clamp((scrollY-start)/range);
  const dt=Math.min(50,time-(lastTime||time-16.7));lastTime=time;
  current+=(target-current)*(1-Math.exp(-dt/90));
  if(Math.abs(current-target)<.0001)current=target;
  items.forEach((card,i)=>{
   const p=clamp((current-(.22+i*.055))/.46);
   const eased=p*p*(3-2*p);
   card.style.setProperty('--audience-card-x',`${(1-eased)*(innerWidth+80)}px`);
  });
  if(current!==target)schedule();
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render)}
 function updateControls(){
  const first=items[0].offsetLeft;
  let nearest=0,best=Infinity;
  items.forEach((item,i)=>{const delta=Math.abs(item.offsetLeft-first-cards.scrollLeft);if(delta<best){best=delta;nearest=i}});
  previous.disabled=cards.scrollLeft<=2;
  next.disabled=cards.scrollLeft>=cards.scrollWidth-cards.clientWidth-2;
  index=next.disabled&&!previous.disabled?items.length-1:nearest;
  status.textContent=`${index+1} / ${items.length}`;
 }
 function move(direction){
  const target=items[Math.max(0,Math.min(items.length-1,index+direction))];
  cards.scrollTo({left:target.offsetLeft-items[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'});
 }
 previous.addEventListener('click',()=>move(-1));
 next.addEventListener('click',()=>move(1));
 cards.addEventListener('scroll',updateControls,{passive:true});
 cards.addEventListener('keydown',event=>{
  if(event.target!==cards||!['ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();move(event.key==='ArrowRight'?1:-1);
 });
 cards.addEventListener('focusin',event=>{
  const card=event.target.closest('.audience-card');if(!card)return;
  if(section.classList.contains('audience-pinned')){
   const progress=(scrollY-start)/range;
   if(progress<.8){scrollTo({top:start+range*.8,behavior:'instant'});current=.8;render();}
  }else card.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
 });
 function measure(){
  const pinned=desktop.matches&&!reduced.matches;
  section.classList.toggle('audience-pinned',pinned);
  cards.style.removeProperty('--audience-title-height');
  cards.style.removeProperty('--audience-copy-height');
  const titleHeight=Math.max(...items.map(c=>c.querySelector('h3').getBoundingClientRect().height));
  const copyHeight=Math.max(...items.map(c=>c.querySelector('p').getBoundingClientRect().height));
  cards.style.setProperty('--audience-title-height',`${titleHeight}px`);
  cards.style.setProperty('--audience-copy-height',`${copyHeight}px`);
  if(pinned){
   cards.scrollLeft=0;
   const heading=section.querySelector('.audience-heading-grid');
   const cardsTop=heading.offsetTop+heading.offsetHeight+28;
   const contentHeight=Math.max(...items.map(c=>c.querySelector('div').offsetHeight));
   const cardHeight=Math.max(contentHeight+132,Math.min(560,innerHeight-cardsTop-30)*.9);
   section.style.setProperty('--audience-cards-top',`${cardsTop}px`);
   section.style.setProperty('--audience-card-height',`${cardHeight}px`);
   const height=stage.clientHeight;
   range=height*2;
   section.style.setProperty('--audience-scroll-height',`${height+range}px`);
   start=shell.getBoundingClientRect().top+scrollY;
   current=clamp((scrollY-start)/range);render();
  }else{
   items.forEach(c=>c.style.removeProperty('--audience-card-x'));
  }
  updateControls();
 }
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',measure);
 desktop.addEventListener('change',measure);
 reduced.addEventListener('change',measure);
 document.fonts.ready.then(measure);
 addEventListener('load',measure);
 measure();
 let visible=false,paused=reduced.matches||!!navigator.connection?.saveData;
 function update(){
  if(visible&&!document.hidden&&!paused){
   if(!video.getAttribute('src')){video.src=video.dataset.src;video.load()}
   video.play().catch(()=>{if(!visible||document.hidden||paused)return;paused=true});
  }else video.pause();
 }
 video.addEventListener('playing',()=>film.classList.add('has-video'));
 video.addEventListener('error',()=>{film.classList.remove('has-video')});
 reduced.addEventListener('change',()=>{paused=reduced.matches;update()});
 document.addEventListener('visibilitychange',update);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update()},{rootMargin:'150px'}).observe(section.querySelector('.audience-hero'));
 update();
})();
