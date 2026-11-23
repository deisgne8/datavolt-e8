const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const menu=$('.menu'),nav=$('.nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');$$('.nav-dropdown').forEach(d=>d.open=false)}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);nav.classList.toggle('open',open)});
$$('.nav-dropdown').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)$$('.nav-dropdown').forEach(o=>{if(o!==d)o.open=false})}));
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))$$('.nav-dropdown').forEach(d=>d.open=false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasOpen=nav.classList.contains('open');closeMenu();if(wasOpen)menu.focus()}});
// Reveal navigation on upward scrolling; keep open menus and keyboard focus usable.
(() => {
 const header=$('.header');
 let lastY=Math.max(0,scrollY),direction=0,distance=0,frame=0;
 function show(){header.classList.remove('is-scroll-hidden')}
 function update(){
  frame=0;
  const y=Math.max(0,Math.min(scrollY,document.documentElement.scrollHeight-innerHeight));
  const delta=y-lastY;
  lastY=y;
  if(y<96||nav.classList.contains('open')||header.querySelector('details[open], :focus-visible')){show();distance=0;return}
  if(Math.abs(delta)<1)return;
  const nextDirection=Math.sign(delta);
  distance=nextDirection===direction?distance+Math.abs(delta):Math.abs(delta);
  direction=nextDirection;
  if(distance>=8){header.classList.toggle('is-scroll-hidden',direction>0);distance=0}
 }
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});
 header.addEventListener('focusin',show);
 header.addEventListener('toggle',event=>{if(event.target.open)show()},true);
 menu.addEventListener('click',show);
})();
function filterCountry(country){window.dispatchEvent(new CustomEvent('campus:filter',{detail:country}))}
const enquiry=$('#enquiry'),preview=$('#preview');
function showPreview(title,copy,note='This destination is outside the homepage concept.'){closeMenu();$('#preview-details').replaceChildren();$('#preview-title').textContent=title;$('#preview-copy').textContent=copy;$('#preview-note').textContent=note;preview.showModal();document.body.classList.add('modal-open')}
function openEnquiry(type){closeMenu();$('#enquiry select').value=type;$('#enquiry [type=submit]').textContent=type==='Book a tour'?'Request a tour':'Contact sales';$('#form-status').textContent='';enquiry.showModal();document.body.classList.add('modal-open')}
$$('[data-contact]').forEach(b=>b.addEventListener('click',()=>openEnquiry(b.dataset.contact)));
$('.enquiry-close').addEventListener('click',()=>enquiry.close());
$$('dialog').forEach(d=>{d.addEventListener('close',()=>document.body.classList.remove('modal-open'));d.addEventListener('click',e=>{const r=d.getBoundingClientRect();if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close()})});
$('#enquiry-form').addEventListener('submit',e=>{e.preventDefault();$('#form-status').textContent='Concept preview only — your enquiry has not been sent or stored. To speak with DataVolt, call +966112299510.'});
const routes={'All campuses':'campuses','Saudi Arabia':'campuses','Uzbekistan':'campuses','Hyperscale':'services','Build to suit':'services','AI solutions':'services','Colocation overview':'colocation','Local expertise':'why','Carrier neutrality':'why','Delivery approach':'deployment','Our approach':'sustainability','Energy and cooling':'sustainability','The company':'about','Shareholders':'about','Strategic partnerships':'about','Company newsroom':'news','Announcements':'news','Insights':'news','Media Centre':'news','Sustainability':'sustainability','Why DataVolt':'why','Services':'services','Professionals':'careers','Graduates':'careers','AI Academy':'careers'};
$$('[data-info]').forEach(b=>b.addEventListener('click',()=>{const label=b.dataset.info,id=routes[label];if(id){closeMenu();if(['All campuses','Saudi Arabia','Uzbekistan'].includes(label))filterCountry(label==='All campuses'?'all':label==='Saudi Arabia'?'saudi':'uzbekistan');$('#'+id).scrollIntoView();}else showPreview(label,'The supplied wireframe does not include an approved destination for this link.')}));
$$('[data-article]').forEach(b=>b.addEventListener('click',()=>{const card=b.closest('.card');showPreview($('h3',card).textContent,$('.news-summary',card).textContent,'Sample editorial content and publication date from the supplied wireframe. No published article URL was supplied.')}));
$$('[data-campus]').forEach(b=>b.addEventListener('click',()=>{const c=b.closest('.campus-panel');showPreview($('h3',c).textContent,`${$('.location',c).textContent} · ${$('.capacity',c).textContent} · ${$('.campus-status',c).textContent}`,'');const specs=$('.campus-specification',c);if(specs)$('#preview-details').append(specs.content.cloneNode(true));}));
