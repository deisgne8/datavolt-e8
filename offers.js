(() => {
  const section = document.querySelector('#services');
  if (!section) return;
  const rows = [...section.querySelectorAll('.offer-row')];
  const dial = section.querySelector('.offers-dial');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 768px)');
  const ns = 'http://www.w3.org/2000/svg';
  const clamp = n => Math.max(0, Math.min(1, n));
  let frame = 0, visible = false, active = -1;

  // Original service pictograms on the reference's 16 × 16 dot matrix.
  const masks = [
    (x,y) => y>=3 && y<=12 && [3,7,11].some(a=>x>=a&&x<=a+2) && ![6,10].includes(y),
    (x,y) => (y>=7&&y<=12&&x>=3&&x<=12&&(x===3||x===12||y===7||y===12)) || (y>=2&&y<=6&&Math.abs(y-(2+Math.abs(x-7.5)))<1) || (x>=7&&x<=8&&y>=9&&y<=12),
    (x,y) => (x>=4&&x<=11&&y>=4&&y<=11&&(x<=5||x>=10||y<=5||y>=10)) || ((x===2||x===13)&&y>=5&&y<=10&&y%2===0) || ((y===2||y===13)&&x>=5&&x<=10&&x%2===0) || (x>=7&&x<=8&&y>=7&&y<=8),
    (x,y) => [[4,4],[11,4],[4,11],[11,11]].some(([a,b])=>Math.abs(x-a)<=1&&Math.abs(y-b)<=1) || ((x===7||x===8)&&y>=4&&y<=11) || ((y===7||y===8)&&x>=4&&x<=11)
  ];
  function svgEl(tag, attrs) {
    const el=document.createElementNS(ns,tag);
    for(const [key,value] of Object.entries(attrs)) el.setAttribute(key,value);
    return el;
  }
  function icon(index) {
    const svg=svgEl('svg',{viewBox:'0 0 96 96',class:'offer-dot-icon','aria-hidden':'true'});
    for(let y=0;y<16;y++) for(let x=0;x<16;x++) {
      const on=masks[index](x,y);
      const dot=svgEl('circle',{cx:3+x*6,cy:3+y*6,r:on?2.3:1,class:on?'offer-dot is-lit':'offer-dot'});
      dot.style.setProperty('--dot-delay',`${((x*7+y*11)%17)*.008}s`);
      svg.append(dot);
    }
    return svg;
  }
  const ring=svgEl('svg',{viewBox:'0 0 220 220',class:'offers-ring','aria-hidden':'true'});
  ring.append(svgEl('circle',{cx:110,cy:110,r:97,fill:'none',stroke:'currentColor','stroke-opacity':'.12','stroke-width':1}));
  const ticks=[];
  for(let i=0;i<80;i++){
    const a=i/80*Math.PI*2-Math.PI/2;
    const tick=svgEl('line',{x1:110+103*Math.cos(a),y1:110+103*Math.sin(a),x2:110+110*Math.cos(a),y2:110+110*Math.sin(a),stroke:'currentColor','stroke-width':1.5,'stroke-opacity':'.14'});
    ring.append(tick);ticks.push(tick);
  }
  dial.replaceChildren(ring);
  const icons=rows.map((row,i)=>{
    const layer=document.createElement('div');layer.className='offers-icon-layer';layer.append(icon(i));dial.append(layer);
    const mobile=icon(i);mobile.classList.add('offer-mobile-icon');row.prepend(mobile);
    const p=row.querySelector('.offer-detail p');
    const copy=p.textContent;
    // Keep a single accessible sentence, while visual words reveal in sequence.
    p.replaceChildren();
    const accessible=document.createElement('span');accessible.className='offer-accessible-copy';accessible.textContent=copy;p.append(accessible);
    copy.split(/\s+/).forEach((word,j)=>{
      const mask=document.createElement('span');mask.className='offer-word-mask';mask.setAttribute('aria-hidden','true');
      const text=document.createElement('span');text.className='offer-word';text.textContent=word;text.style.setProperty('--word-delay',`${(j+1)*.01}s`);mask.append(text);p.append(mask,document.createTextNode(' '));
    });
    row.addEventListener('focusin',()=>select(i));
    return layer;
  });
  function select(index){
    if(active===index)return;
    active=index;section.dataset.activeOffer=String(index);
    rows.forEach((row,i)=>row.classList.toggle('is-active',i===index));
    icons.forEach((layer,i)=>{
      const leaving=layer.classList.contains('is-active')&&i!==index;
      layer.classList.toggle('is-leaving',leaving);
      layer.classList.toggle('is-active',i===index);
    });
  }
  function update(){
    frame=0;if(!visible)return;
    const motion=desktop.matches&&!reduced.matches;
    section.classList.toggle('offers-motion',motion);
    const target=innerHeight*.5;
    let closest=0,distance=Infinity;
    rows.forEach((row,i)=>{
      const r=row.getBoundingClientRect();const delta=Math.abs(r.top+r.height/2-target);
      if(delta<distance){distance=delta;closest=i;}
      const strength=clamp(1-delta/(innerHeight*.5+36));
      row.style.setProperty('--title-opacity',String(strength));
      row.style.setProperty('--title-scale',String(.97+.03*strength));
    });
    // Keyboard focus always reveals its corresponding description/action.
    const focused=rows.findIndex(row=>row.contains(document.activeElement));
    select(focused>=0?focused:closest);
    const first=rows[0].getBoundingClientRect(),last=rows.at(-1).getBoundingClientRect();
    const progress=clamp((target-first.top)/(last.bottom-first.top));
    ticks.forEach((tick,i)=>tick.setAttribute('stroke-opacity',i/80<=progress?'.85':'.14'));
    dial.style.setProperty('--dial-opacity',motion?String(clamp(Math.min(target-first.top+120,last.bottom-target+120)/120)):'1');
  }
  function request(){if(!frame)frame=requestAnimationFrame(update);}
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request();},{rootMargin:'150px'}).observe(section);
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});
  reduced.addEventListener('change',()=>{section.classList.remove('offers-motion');request();});
  desktop.addEventListener('change',request);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)request();});
  select(0);
})();
