(() => {
 const overlay=document.querySelector('#site-preloader');
 if(!overlay || typeof overlay.showModal!=='function')return;
 const playbackRate=2/3;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let finished=false,frame=0,last=0,elapsed=0,motionElapsed=0,exitElapsed=0,ready=false,scene=null;
 const abort=new AbortController();
 const bar=overlay.querySelector('[role="progressbar"]');
 const label=overlay.querySelector('.preloader-percent');
 const meter=overlay.querySelector('.preloader-meter');
 const fallback=overlay.querySelector('.preloader-fallback');
 const clamp=value=>Math.max(0,Math.min(1,value));
 const ease=value=>value<.5?4*value*value*value:1-Math.pow(-2*value+2,3)/2;
 function cleanup(){
  if(finished)return;
  finished=true;abort.abort();clearTimeout(watchdog);cancelAnimationFrame(frame);
  scene?.dispose();overlay.close();overlay.remove();
  document.documentElement.classList.remove('is-preloading');
  dispatchEvent(new Event('datavolt:intro-complete'));
  removeEventListener('pagehide',cleanup);
 }
 function tick(now){
  if(finished)return;
  const dt=last?Math.min((now-last)/1000,.05):0;last=now;
  if(!document.hidden){
   elapsed+=dt*playbackRate;motionElapsed+=dt*playbackRate;
   if(ready && elapsed>=2.4)exitElapsed+=dt*playbackRate;
  }
  // Finish the count before the forward zoom; never exit while assets are pending.
  if(!ready)elapsed=Math.min(elapsed,2.35);
  if(reduced.matches){if(ready){cleanup();return}}
  else{
   const zoom=clamp(exitElapsed/1.05);
   const openingCleared=scene?.render(elapsed,false,motionElapsed,zoom);
   const percent=ready && elapsed>=2.4?100:Math.min(99,Math.round(ease(clamp(elapsed/2.4))*100));
   bar.setAttribute('aria-valuenow',percent);
   label.textContent=String(percent).padStart(2,'0')+'%';
   meter.style.opacity=String(1-ease(clamp(zoom/.35)));
   // Keep the loader fully opaque until the zoom completes. Closing the
   // dialog reveals the hero in one frame, without ghosting either layer.
   fallback.style.transform=`scale(${Math.pow(32,ease(clamp((zoom-.18)/.82)))})`;
   fallback.style.opacity=overlay.classList.contains('is-fallback')?'1':'0';
   if(openingCleared || zoom>=1){cleanup();return}
  }
  frame=requestAnimationFrame(tick);
 }
 overlay.showModal();overlay.focus({preventScroll:true});
 document.documentElement.classList.add('is-preloading');
 overlay.addEventListener('cancel',event=>{event.preventDefault();cleanup()});
 addEventListener('pagehide',cleanup);
 const watchdog=setTimeout(cleanup,8000);
 const domReady=document.readyState==='loading'
  ?new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true}))
  :Promise.resolve();
 const model=import('./preloader-scene.js?v=brand-palette').then(async({mountPreloader})=>{
  if(finished)return;
  const mounted=await mountPreloader(overlay,abort.signal,()=>{});
  if(finished){mounted.dispose();return;}
  scene=mounted;
 }).catch(()=>{overlay.classList.add('is-fallback')}).finally(()=>{if(!finished)frame=requestAnimationFrame(tick)});
 const hero=domReady.then(async()=>{const img=document.querySelector('.hero-logo-poster');if(img)await img.decode().catch(()=>{})});
 const font=domReady.then(async()=>{if(document.fonts)await Promise.allSettled([document.fonts.load('16px "Neo Sans Light"'),document.fonts.ready])});
 Promise.allSettled([model,hero,font]).then(()=>{ready=true});
})();
