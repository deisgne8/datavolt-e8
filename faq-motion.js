(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const controllers=[];
 document.querySelectorAll('#faq .faq>details').forEach((details,index)=>{
  const summary=details.querySelector('summary');
  const answer=document.createElement('div');
  answer.className='faq-answer';answer.id=`faq-answer-${index}`;
  [...details.childNodes].filter(node=>node!==summary).forEach(node=>answer.append(node));
  details.append(answer);
  summary.insertAdjacentHTML('beforeend','<svg class="faq-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M0 16H32" stroke="currentColor"/><path class="faq-icon-vertical" d="M16 0V32" stroke="currentColor"/><path d="M16 13L19 16L16 19L13 16Z" fill="currentColor"/></svg>');
  details.classList.add('faq-animated');
  summary.setAttribute('aria-controls',answer.id);
  let expanded=details.open,animation=null;
  function sync(){
   details.classList.toggle('is-expanded',expanded);
   summary.setAttribute('aria-expanded',String(expanded));
   answer.inert=!expanded;
   answer.setAttribute('aria-hidden',String(!expanded));
  }
  function finish(){
   if(animation){animation.onfinish=null;animation.cancel();animation=null}
   details.open=expanded;
   answer.style.height='';
   sync();
  }
  function setOpen(next){
   if(next===expanded)return;
   const from=details.open?answer.getBoundingClientRect().height:0;
   if(animation){animation.onfinish=null;animation.cancel();animation=null}
   expanded=next;sync();
   if(reduced.matches){finish();return}
   // Keep native details open during closing, so the answer can animate out.
   details.open=true;
   const to=expanded?answer.scrollHeight:0;
   animation=answer.animate([{height:`${from}px`},{height:`${to}px`}],{
    duration:500,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'
   });
   animation.onfinish=finish;
  }
  summary.addEventListener('click',event=>{
   event.preventDefault();
   const next=!expanded;
   if(next)controllers.forEach(controller=>{if(controller.element!==details)controller.setOpen(false)});
   setOpen(next);
  });
  // Keep programmatic/native open changes consistent with the enhanced icon.
  details.addEventListener('toggle',()=>{
   if(!animation&&details.open!==expanded){expanded=details.open;sync()}
  });
  controllers.push({element:details,setOpen,finish});
  sync();
 });
 reduced.addEventListener('change',()=>{if(reduced.matches)controllers.forEach(controller=>controller.finish())});
 addEventListener('resize',()=>controllers.forEach(controller=>controller.finish()),{passive:true});
})();
