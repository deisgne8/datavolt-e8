import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const view=document.querySelector('.hero-logo-view');
if(view)mount().catch(()=>view.classList.add('is-fallback'));

async function mount(){
 const canvas=view.querySelector('canvas'),host=view.closest('.hero-logo');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const gltf=await new GLTFLoader().loadAsync('assets/preloader/mobius-logo.glb');
 const model=gltf.scene;model.updateMatrixWorld(true);
 let mesh;model.traverse(node=>{if(node.isMesh&&!mesh)mesh=node});
 if(!mesh)throw new Error('The Möbius model has no surface.');
 const source=mesh.geometry.getAttribute('position'),normals=mesh.geometry.getAttribute('normal');
 // This supplied GLB is a 512 × 72 surface lattice. Its seam joins the next
 // cross-section half a turn across: two circuits make a seamless Möbius strand.
 const index=mesh.geometry.index;
 const crossCount=index.getX(2)-index.getX(0),rings=source.count/crossCount;
 if(!Number.isInteger(rings)||crossCount<4)throw new Error('Unsupported Möbius surface topology.');
 const strandCount=32,geometry=new THREE.BufferGeometry();
 const positions=[],normalData=[],progress=[],seeds=[];
 const sample=new THREE.Vector3(),sampleNormal=new THREE.Vector3();
 const sections=[];
 for(let ring=0;ring<rings;ring++){
  const cumulative=[0];
  for(let j=0;j<crossCount;j++){
   const a=new THREE.Vector3().fromBufferAttribute(source,ring*crossCount+j);
   const b=new THREE.Vector3().fromBufferAttribute(source,ring*crossCount+(j+1)%crossCount);
   cumulative.push(cumulative.at(-1)+a.distanceTo(b));
  }
  sections.push(cumulative);
 }
 function surfacePoint(ring,fraction){
  const lengths=sections[ring],distance=fraction*lengths.at(-1);
  let j=0;while(j<crossCount-1&&lengths[j+1]<distance)j++;
  const mix=(distance-lengths[j])/(lengths[j+1]-lengths[j]);
  const a=ring*crossCount+j,b=ring*crossCount+(j+1)%crossCount;
  sample.fromBufferAttribute(source,a).lerp(new THREE.Vector3().fromBufferAttribute(source,b),mix).applyMatrix4(mesh.matrixWorld);
  sampleNormal.fromBufferAttribute(normals,a).lerp(new THREE.Vector3().fromBufferAttribute(normals,b),mix).transformDirection(mesh.matrixWorld);
 }
 for(let strand=0;strand<strandCount;strand++){
  const path=[],pathNormals=[],lengths=[0];
  for(let step=0;step<=rings*2;step++){
   const lap=Math.floor(step/rings),fraction=((strand+.5)/(strandCount*2)+lap*.5)%1;
   surfacePoint(step%rings,fraction);path.push(sample.clone());pathNormals.push(sampleNormal.clone());
   if(step)lengths.push(lengths.at(-1)+path[step].distanceTo(path[step-1]));
  }
  for(let step=0;step<path.length-1;step++)for(const at of [step,step+1]){
   positions.push(...path[at].toArray());normalData.push(...pathNormals[at].toArray());
   progress.push(lengths[at]/lengths.at(-1));seeds.push(strand/strandCount);
  }
 }
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
 geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normalData,3));
 geometry.setAttribute('aProgress',new THREE.Float32BufferAttribute(progress,1));
 geometry.setAttribute('aSeed',new THREE.Float32BufferAttribute(seeds,1));
 geometry.computeBoundingBox();
 const center=geometry.boundingBox.getCenter(new THREE.Vector3());geometry.translate(-center.x,-center.y,-center.z);
 const extent=Math.max(...geometry.boundingBox.getSize(new THREE.Vector3()).toArray());
 const uniforms={uTime:{value:0},uMotion:{value:reduced.matches?0:1},uPixelRatio:{value:Math.min(devicePixelRatio,1.75)},uResolution:{value:new THREE.Vector2(1,1)},uLineWidth:{value:1}};
 const vertexShader=`
  attribute float aProgress,aSeed;
  uniform float uTime,uMotion,uPixelRatio;
  varying float vProgress,vSeed,vDepth;
  #ifdef LINE_RIBBON
   attribute vec3 aOther,aOtherNormal;
   attribute float aOtherProgress,aSide,aDirection;
   uniform vec2 uResolution;
   uniform float uLineWidth;
  #endif
  void main(){
   vProgress=aProgress;vSeed=aSeed;
   float frequency=2.0+floor(aSeed*3.0);
   float wave=sin(aProgress*6.283185*frequency-uTime*(.5+.4*fract(aSeed*5.1))+aSeed*18.8496);
   vec3 p=position+normal*wave*.0065*uMotion;
   vec4 world=modelMatrix*vec4(p,1.0);
   vDepth=world.z;
   gl_Position=projectionMatrix*viewMatrix*world;
   #ifdef LINE_RIBBON
    float otherWave=sin(aOtherProgress*6.283185*frequency-uTime*(.5+.4*fract(aSeed*5.1))+aSeed*18.8496);
    vec3 otherPoint=aOther+aOtherNormal*otherWave*.0065*uMotion;
    vec4 otherClip=projectionMatrix*modelViewMatrix*vec4(otherPoint,1.0);
    vec2 direction=(otherClip.xy/otherClip.w-gl_Position.xy/gl_Position.w)*uResolution*aDirection;
    direction/=max(length(direction),.00001);
    vec2 perpendicular=vec2(-direction.y,direction.x);
    gl_Position.xy+=perpendicular*aSide*uLineWidth/uResolution*gl_Position.w;
   #endif
   gl_PointSize=(1.5+2.0*smoothstep(-2.4,2.4,world.z))*uPixelRatio;
  }`;
 const fragmentShader=`
  uniform float uTime;
  varying float vProgress,vSeed,vDepth;
  float hash(float n){return fract(sin(n)*43758.5453);}
  vec3 palette(float hue){
   float h=fract(hue)*5.0;
   vec3 green=vec3(.384,.851,.420),blue=vec3(.361,.596,1.0);
   vec3 violet=vec3(.612,.384,1.0),pink=vec3(1.0,.435,.682),orange=vec3(1.0,.651,.310);
   if(h<1.0)return mix(green,blue,h);
   if(h<2.0)return mix(blue,violet,h-1.0);
   if(h<3.0)return mix(violet,pink,h-2.0);
   if(h<4.0)return mix(pink,orange,h-3.0);
   return mix(orange,green,h-4.0);
  }
  float beat(float at,float duration,float sharp,float gain,float share){
   float time=mod(uTime-at+10.0,10.0);
   float head=time/duration;
   float picked=step(1.0-share,hash(vSeed*91.7+floor((uTime-at)/10.0)*12.9898));
   float distance=(vProgress-head)*sharp*2.3;
   return exp(-distance*distance)*gain*picked*step(time,duration+1.0);
  }
  void main(){
   // A fixed spectrum per fibre; illumination travels along it, not the hue.
   float seed=fract(vSeed*19.776);
   vec3 color=palette(seed);
   float depth=.3+.7*smoothstep(-2.4,2.4,vDepth);
   float pace=.35*(1.0+(fract(seed*1.618)-.5)*.9);
   float wave=.5+.5*sin(vProgress*18.849556-uTime*pace*3.14159+seed*5.0);
   float breathe=1.0+.25*sin(uTime*(.3+.5*fract(seed*2.71))+seed*7.0);
   float light=depth*(.45+.55*wave*wave*wave)*breathe;
   #ifdef SPARKS
    float run=uTime*(.07+.06*hash(seed*79.0))+seed;
    float distance=fract(fract(run)-vProgress);
    float tail=1.0-smoothstep(0.0,.022,distance);
    float lit=step(.55,hash(floor(run)*12.9898+seed*78.233));
    float glow=pow(smoothstep(.5,0.0,length(gl_PointCoord-.5)),2.0);
    float head=exp(-pow(distance/.003,2.0));
    color=mix(color,vec3(1.0),.35+head*.25);
    gl_FragColor=vec4(color*3.0*light*lit*tail*tail*glow,1.0);
   #else
    float surge=beat(0.0,3.0,1.7,1.1,1.0)+beat(3.4,1.25,11.0,3.4,.3)
     +beat(5.0,2.1,5.0,1.5,1.0)+beat(5.42,2.1,5.0,1.5,1.0)+beat(7.9,1.05,12.0,3.6,.22);
    gl_FragColor=vec4(color*.30*light*(1.0+surge),1.0);
   #endif
  }`;
 // Screen-space ribbons provide a true 1 CSS-pixel stroke on WebGL devices
 // where native line primitives are restricted to a single physical pixel.
 const lineGeometry=new THREE.BufferGeometry();
 const ribbon={position:[],normal:[],aProgress:[],aSeed:[],aOther:[],aOtherNormal:[],aOtherProgress:[],aSide:[],aDirection:[]};
 const layout=[[0,-1],[1,-1],[0,1],[0,1],[1,-1],[1,1]];
 for(let i=0;i<geometry.getAttribute('position').count;i+=2){
  for(const [end,side] of layout){
   for(const name of ['position','normal','aProgress','aSeed']){
    const attr=geometry.getAttribute(name);
    for(let j=0;j<attr.itemSize;j++)ribbon[name].push(attr.array[(i+end)*attr.itemSize+j]);
   }
   for(const [name,sourceName] of [['aOther','position'],['aOtherNormal','normal'],['aOtherProgress','aProgress']]){
    const attr=geometry.getAttribute(sourceName);
    for(let j=0;j<attr.itemSize;j++)ribbon[name].push(attr.array[(i+1-end)*attr.itemSize+j]);
   }
   ribbon.aSide.push(side);ribbon.aDirection.push(end?-1:1);
  }
 }
 for(const [name,values] of Object.entries(ribbon))lineGeometry.setAttribute(name,new THREE.Float32BufferAttribute(values,['position','normal','aOther','aOtherNormal'].includes(name)?3:1));
 const material=new THREE.ShaderMaterial({defines:{LINE_RIBBON:1},uniforms,vertexShader,fragmentShader,side:THREE.DoubleSide,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
 const lines=new THREE.Mesh(lineGeometry,material);
 // Separate short, brighter point trails travel over the base paths.
 const sparkGeometry=new THREE.BufferGeometry();
 for(const name of ['position','normal','aProgress','aSeed']){
  const attr=geometry.getAttribute(name),values=[];
  for(let i=0;i<attr.count;i+=2)for(let sub=0;sub<3;sub++)for(let j=0;j<attr.itemSize;j++){
   const a=attr.array[i*attr.itemSize+j],b=attr.array[(i+1)*attr.itemSize+j];
   values.push(THREE.MathUtils.lerp(a,b,sub/3));
  }
  sparkGeometry.setAttribute(name,new THREE.Float32BufferAttribute(values,attr.itemSize));
 }
 const sparkMaterial=new THREE.ShaderMaterial({defines:{SPARKS:1},uniforms,vertexShader,fragmentShader,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
 const sparks=new THREE.Points(sparkGeometry,sparkMaterial);
 const group=new THREE.Group(),placement=new THREE.Group();group.add(lines,sparks);placement.add(group);
 group.scale.setScalar(3/extent);
 const scene=new THREE.Scene();scene.add(placement);
 const camera=new THREE.OrthographicCamera(-5,5,3,-3,.1,100);camera.position.z=15;
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;
 // Additive strands must accumulate over the hero color. A transparent black
 // buffer with opaque shader fragments creates black halos on a colored page.
 const heroColor=getComputedStyle(host.closest('.hero')).getPropertyValue('--hero-ink').trim()||'#000445';
 renderer.setClearColor(heroColor,1);
 // The original filled model is used only to derive the paths, never drawn.
 model.traverse(node=>{if(node.isMesh){node.geometry.dispose();node.material.dispose()}});
 
 let visible=true,frame=0,last=0,disposed=false,contextLost=false,zoom=1;
 const hero=host.closest('.hero');
 const pointer=new THREE.Vector2(),pointerTarget=new THREE.Vector2(),pointerVelocity=new THREE.Vector2();
 function followPointer(event){
  if(event.pointerType!=='mouse'||reduced.matches)return;
  const rect=hero.getBoundingClientRect();
  pointerTarget.set(
   THREE.MathUtils.clamp((event.clientX-rect.left)/rect.width*2-1,-1,1),
   THREE.MathUtils.clamp((event.clientY-rect.top)/rect.height*2-1,-1,1)
  );
 }
 function releasePointer(){pointerTarget.set(0,0)}
 hero.addEventListener('pointermove',followPointer,{passive:true});
 hero.addEventListener('pointerleave',releasePointer);
 function draw(){
  group.rotation.set(.02+pointer.y*.14,-.22+pointer.x*.22,.12-pointer.x*.035);
  group.position.set(pointer.x*.08,-pointer.y*.05,0);
  placement.scale.setScalar(zoom);renderer.render(scene,camera);
 }
 function resize(){
  if(contextLost)return;
  const w=view.clientWidth,h=view.clientHeight,aspect=w/h;
  uniforms.uResolution.value.set(w,h);
  renderer.setSize(w,h,false);camera.left=-3*aspect;camera.right=3*aspect;camera.top=3;camera.bottom=-3;
  if(w<=700){zoom=1.13;placement.position.set(.55,3-(235/h)*6,0)}
  else{zoom=Math.min(1.92,1.6*aspect);placement.position.set(aspect*.42,-.22,0)}
  camera.updateProjectionMatrix();draw();
 }
 function tick(now){
  frame=0;if(disposed||contextLost||!visible||document.hidden||reduced.matches)return;
  const dt=last?Math.min((now-last)/1000,.05):0;last=now;
  if(!document.documentElement.classList.contains('is-preloading')){
   uniforms.uTime.value+=dt;
   // A damped spring follows the pointer and returns smoothly on mouse leave.
   for(const axis of ['x','y']){
    pointerVelocity[axis]+=((pointerTarget[axis]-pointer[axis])*65-pointerVelocity[axis]*13)*dt;
    pointer[axis]+=pointerVelocity[axis]*dt;
   }
   draw();
  }
  frame=requestAnimationFrame(tick);
 }
 function start(){if(!frame&&!disposed&&!contextLost&&visible&&!document.hidden&&!reduced.matches){last=0;frame=requestAnimationFrame(tick)}}
 function stop(){cancelAnimationFrame(frame);frame=0;last=0}
 // Hover adds a gentle tilt; no click or drag controls are registered.
 reduced.addEventListener('change',()=>{
  uniforms.uMotion.value=reduced.matches?0:1;
  if(reduced.matches){stop();pointer.set(0,0);pointerTarget.set(0,0);pointerVelocity.set(0,0);draw()}else start();
 });
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop()});observer.observe(view);
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(view);
 canvas.addEventListener('webglcontextlost',event=>{
  event.preventDefault();contextLost=true;stop();view.classList.remove('is-ready');host.classList.remove('has-caption');canvas.setAttribute('aria-hidden','true');view.querySelector('.hero-logo-poster').removeAttribute('aria-hidden');
 });
 addEventListener('pagehide',event=>{stop();if(event.persisted)return;disposed=true;hero.removeEventListener('pointermove',followPointer);hero.removeEventListener('pointerleave',releasePointer);observer.disconnect();resizeObserver.disconnect();geometry.dispose();lineGeometry.dispose();material.dispose();sparkGeometry.dispose();sparkMaterial.dispose();renderer.dispose()});
 addEventListener('pageshow',start);
 resize();view.classList.add('is-ready');canvas.removeAttribute('aria-hidden');view.querySelector('.hero-logo-poster').setAttribute('aria-hidden','true');start();
}
