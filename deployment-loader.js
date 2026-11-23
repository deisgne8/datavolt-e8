const deployment=document.querySelector('#deployment');
if(deployment){
 const steps=[...deployment.querySelectorAll('.deployment-copy article')];
 const stage=deployment.querySelector('.deployment-stage-view');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,lastTime=0;
 const displayed=steps.map(()=>0);
 const clamp=value=>Math.max(0,Math.min(1,value));
 const smooth=value=>{const p=clamp(value);return p*p*(3-2*p)};
 function updateSteps(time=performance.now()){
  frame=0;
  const dt=Math.min(50,time-(lastTime||time-16.7));
  lastTime=time;
  const staticMode=reduced.matches;
  deployment.classList.toggle('deployment-sequenced',!staticMode);
  const mobile=innerWidth<=700;
  const stageRect=stage.getBoundingClientRect();
  const leadBottom=deployment.querySelector('.deployment-lead .button').getBoundingClientRect().bottom-stageRect.top;
  const rackOffset=mobile?0:Math.max(100,leadBottom+32-stage.clientHeight*.35);
  deployment.style.setProperty('--deployment-rack-offset',`${Math.round(rackOffset)}px`);
  const progress=clamp(-deployment.getBoundingClientRect().top/Math.max(1,deployment.offsetHeight-stage.offsetHeight));
  let moving=false;
  steps.forEach((step,index)=>{
   const target=staticMode?1:mobile
    ?clamp((innerHeight*.88-step.getBoundingClientRect().top)/Math.max(180,innerHeight*.38))
    :clamp((progress-(.12+index*.24))/.24);
   let value=staticMode?1:displayed[index]+(target-displayed[index])*(1-Math.exp(-dt/90));
   if(Math.abs(value-target)<.0001)value=target;
   displayed[index]=value;
   moving ||= value!==target;
   const title=smooth(value/.22);
   const copy=smooth((value-.28)/.34);
   const line=smooth((value-.55)/.4);
   step.style.setProperty('--step-title',String(title));
   step.style.setProperty('--step-title-y',`${(1-title)*14}px`);
   step.style.setProperty('--step-copy',String(copy));
   step.style.setProperty('--step-copy-y',`${(1-copy)*12}px`);
   step.style.setProperty('--step-line',String(line));
  });
  if(moving)requestSteps();
 }
 function requestSteps(){if(!frame)frame=requestAnimationFrame(updateSteps)}
 addEventListener('scroll',requestSteps,{passive:true});
 addEventListener('resize',requestSteps);
 reduced.addEventListener('change',requestSteps);
 document.fonts.ready.then(requestSteps);
 updateSteps();
 const observer=new IntersectionObserver(async entries=>{
  if(!entries.some(e=>e.isIntersecting))return;
  observer.disconnect();
  try{const {mountDeployment}=await import('./deployment-scene.js?v=aligned');await mountDeployment(deployment)}
  catch(error){console.warn('Deployment scene unavailable; using the still image.',error);deployment.classList.add('scene-fallback')}
 },{rootMargin:'700px'});
 observer.observe(deployment);
}
