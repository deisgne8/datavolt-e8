(() => {
  const section=document.querySelector('#why');
  if(!section)return;
  const rows=[...section.querySelectorAll('.why-row')];
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  function select(index){rows.forEach((row,i)=>row.classList.toggle('is-active',i===index));}
  rows.forEach((row,i)=>{
    row.addEventListener('pointerenter',()=>{if(fine.matches)select(i);});
    row.addEventListener('focusin',()=>select(i));
    row.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')select(i);});
    row.addEventListener('keydown',e=>{
      const next=e.key==='ArrowDown'?i+1:e.key==='ArrowUp'?i-1:e.key==='Home'?0:e.key==='End'?rows.length-1:null;
      if(next!==null){e.preventDefault();rows[Math.max(0,Math.min(rows.length-1,next))].focus();}
    });
  });
  section.querySelector('.why-rows').addEventListener('pointerleave',()=>{
    const focused=rows.findIndex(row=>row.contains(document.activeElement));select(focused);
  });
  section.addEventListener('focusout',()=>requestAnimationFrame(()=>{
    if(!section.contains(document.activeElement)&&!section.querySelector('.why-rows:hover'))select(-1);
  }));
})();
