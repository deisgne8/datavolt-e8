import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';

export async function mountDeployment(section){
 const stage=section.querySelector('.deployment-stage-view');
 const canvas=section.querySelector('canvas');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power',preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=0.95;
 renderer.shadowMap.enabled=true;
 renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.localClippingEnabled=true;
 renderer.setClearColor(0x000000,0);
 const scene=new THREE.Scene();
 // Match the reference's camera-depth falloff, blending distant cabinets
 // into this page's navy rather than adding a flat overlay over the scene.
 scene.fog=new THREE.Fog(0x091d54,24,65);
 // A physically lit studio: broad reflections, opaque surfaces, and real shadows.
 const pmrem=new THREE.PMREMGenerator(renderer);
 const room=new RoomEnvironment();
 const studio=pmrem.fromScene(room,0.04);
 scene.environment=studio.texture;
 scene.environmentIntensity=0.42;
 room.dispose();pmrem.dispose();
 const key=new THREE.DirectionalLight(0xeaf0ff,2.8);
 key.position.set(-6,12,9);key.target.position.set(0,-1,-6);
 key.castShadow=true;key.shadow.mapSize.set(2048,2048);
 Object.assign(key.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:0.5,far:80});
 key.shadow.normalBias=0.025;key.shadow.bias=-0.0001;key.shadow.radius=3;
 scene.add(key,key.target);
 const fill=new THREE.DirectionalLight(0x7d9dff,0.9);fill.position.set(-4,-3,7);scene.add(fill);
 const camera=new THREE.PerspectiveCamera(25.4,1,.1,2000);
 camera.position.set(0,0,7.5);
 const group=new THREE.Group();scene.add(group);
 const base=new URL('./assets/deployment/',import.meta.url).href;
 const vendor=new URL('./vendors/deployment/',import.meta.url).href;
 const draco=new DRACOLoader().setDecoderPath(vendor+'draco/');
 const gltf=new GLTFLoader().setDRACOLoader(draco);
 const texture=new THREE.TextureLoader();
 const [rackModel,drawerModel,layout,normal]=await Promise.all([
  gltf.loadAsync(base+'new-rack-2.glb'),gltf.loadAsync(base+'drawer.glb'),gltf.loadAsync(base+'dataEnvironement-4.glb'),
  texture.loadAsync(base+'normalmap_data_hightpoly.png')
 ]);
 normal.flipY=false;
 const low=[],high=[];let floorY=-2.1184365749;
 layout.scene.children.forEach(n=>{if(n.name==='floor')floorY=n.position.y;else if(n.name.includes('low-poly'))low.push(n.position);else if(n.name.includes('high-poly'))high.push(n.position)});
 const geometry=rackModel.scene.children[0].geometry;geometry.computeTangents();
 const floorClip=new THREE.Plane(new THREE.Vector3(0,1,0),-floorY);
 const rackMaterial=new THREE.MeshPhysicalMaterial({
  color:0x66798f,metalness:0.62,roughness:0.34,
  clearcoat:0.16,clearcoatRoughness:0.32,anisotropy:0.25,anisotropyRotation:Math.PI/2,
  normalMap:normal,normalScale:new THREE.Vector2(1.0,1.0),
  transparent:false,opacity:1,depthWrite:true,
  clippingPlanes:[floorClip],clipShadows:true
 });
 // Recesses in the normal map receive occlusion; the old black albedo and
 // baked LED glow are deliberately absent from this material.
 rackMaterial.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vFinishPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nvFinishPosition = position;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vFinishPosition;').replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
   float grain = fract(sin(dot(floor(vFinishPosition * 540.0), vec3(12.9898,78.233,37.719))) * 43758.5453);
   roughnessFactor = clamp(roughnessFactor + (grain - 0.5) * 0.015, 0.25, 0.7);
  `);
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   vec3 relief = texture2D(normalMap, vNormalMapUv).xyz * 2.0 - 1.0;
   float cavity = smoothstep(0.35, 0.98, relief.z);
   // Dark graphite vent faces sit inside the brushed blue-grey housing.
   float ventPanel = step(0.038, vNormalMapUv.x) * (1.0 - step(0.749, vNormalMapUv.x)) * (1.0 - step(0.286, vNormalMapUv.y));
   diffuseColor.rgb *= mix(1.0, 0.48, ventPanel);
   diffuseColor.rgb *= mix(0.18, 1.0, cavity);
  `);
 };
 // Reference-like light falloff across successive banks: foreground racks
 // retain their finish while the far-right banks lose illumination and contrast.
 function applyDistanceFalloff(material){
  const prepare=material.onBeforeCompile.bind(material);
  material.onBeforeCompile=shader=>{
   prepare(shader);
   shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying float vRackDistance;').replace('#include <begin_vertex>',`#include <begin_vertex>
    vRackDistance = max(instanceMatrix[3].x - 8.0, 0.0) + max(-instanceMatrix[3].z, 0.0) * 0.45;
   `);
   shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float vRackDistance;').replace('#include <opaque_fragment>',`outgoingLight *= exp(-vRackDistance * 0.065);
    #include <opaque_fragment>`);
  };
 }
 applyDistanceFalloff(rackMaterial);
 // Prefer the primary rack positions, removing coincident proxy placements.
 const positions=[];
 for(const position of [...high,...low]){
  if(!positions.some(existing=>existing.distanceToSquared(position)<0.04))positions.push(position);
 }
 // Number the cabinets within each contiguous row so the initial roofline
 // descends in steps. Each row then settles onto its shared base height.
 const rowSlots=new Array(positions.length).fill(0);
 const ordered=positions.map((position,index)=>({position,index})).sort((a,b)=>a.position.z-b.position.z||a.position.x-b.position.x);
 let previous=null,slot=0;
 for(const entry of ordered){
  if(!previous||Math.abs(entry.position.z-previous.position.z)>0.2||entry.position.x-previous.position.x>3)slot=0;
  else slot++;
  rowSlots[entry.index]=slot;previous=entry;
 }
 const drawerRackIndex=positions.findIndex(p=>Math.abs(p.x)<0.2&&Math.abs(p.z)<0.2);
 const rackOffsets=new Array(positions.length).fill(0);
 const racks=new THREE.InstancedMesh(geometry,rackMaterial,positions.length);
 const dummy=new THREE.Object3D();
 positions.forEach((p,i)=>{dummy.position.copy(p);dummy.rotation.set(0,-Math.PI/2,0);dummy.updateMatrix();racks.setMatrixAt(i,dummy.matrix)});
 racks.instanceMatrix.needsUpdate=true;racks.computeBoundingBox();
 racks.castShadow=true;racks.receiveShadow=true;group.add(racks);
 // Two tiny steady status indicators per cabinet: emissive lenses, no bloom
 // or flashing. They share the rack's depth fade and animated vertical offset.
 const ledHeights=[2.42,1.08];
 const ledMaterial=new THREE.MeshStandardMaterial({
  color:0xc7ddff,emissive:0x83b4ff,emissiveIntensity:1.7,
  roughness:0.3,metalness:0.05,clippingPlanes:[floorClip]
 });
 applyDistanceFalloff(ledMaterial);
 const statusLeds=new THREE.InstancedMesh(new THREE.SphereGeometry(0.012,8,6),ledMaterial,positions.length*ledHeights.length);
 statusLeds.frustumCulled=false;group.add(statusLeds);
 const drawer=drawerModel.scene.children[0].clone();
 drawer.material=new THREE.MeshPhysicalMaterial({color:0x586e89,metalness:0.62,roughness:0.32,clearcoat:0.16,transparent:false});
 const drawerBaseY=drawer.position.y;
 drawer.castShadow=true;drawer.receiveShadow=true;group.add(drawer);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(130,130),new THREE.ShadowMaterial({color:0x020615,opacity:0.22}));
 floor.rotation.x=-Math.PI/2;floor.position.y=floorY+0.002;floor.receiveShadow=true;group.add(floor);
 // Restrained blue-white edge lighting coordinates with the navy section.
 const channels=new THREE.InstancedMesh(new THREE.BoxGeometry(1.87,0.025,0.035),new THREE.MeshStandardMaterial({color:0xb4caff,emissive:0x6e98ff,emissiveIntensity:0.9,roughness:0.28}),positions.length);
 positions.forEach((p,i)=>{dummy.position.set(p.x,floorY+0.025,p.z+1.66);dummy.rotation.set(0,0,0);dummy.updateMatrix();channels.setMatrixAt(i,dummy.matrix)});
 applyDistanceFalloff(channels.material);group.add(channels);
 RectAreaLightUniformsLib.init();
 for(const z of [0,10.62,-16.39]){
  const wash=new THREE.RectAreaLight(0x7b9fff,4,14,0.35);
  wash.position.set(5,floorY+0.1,z+2.05);wash.lookAt(5,0.8,z);group.add(wash);
 }
 for(const x of [5]){
  const spill=new THREE.RectAreaLight(0x7b9fff,4.5,14,0.6);
  spill.position.set(x,floorY+0.45,2.0);spill.lookAt(x,floorY,2.6);group.add(spill);
 }
 group.scale.setScalar(.7);
 let progress=.28,visible=true,frame=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 const ease=v=>v*v*(3-2*v);
 // Camera poses sampled from the reference site's desktop sequence.
 // The entry holds lower briefly to keep the longer DataVolt introduction clear.
 const cameraPoses=[
  [0,-1,-2.7,0,-0.314159],
  [.2,-1,-2.7,0,-0.305291],
  [.3,-1.022294,-2.5,-0.167205,-0.280534],
  [.4,-1.108402,-1.922676,-0.813016,-0.235267],
  [.5,-1.279501,-2.116304,-2.096256,-0.166221],
  [.6,-1.546275,-2.418207,-4.097064,-0.078645],
  [.75,-2.028604,-2.964047,-7.714532,0.047871],
  [.9,-2.366679,-3.346638,-10.250092,0.127046],
  [1,-2.477391,-3.471929,-11.080435,0.153075]
 ];
 function poseAt(t,column){
  let i=0;while(i<cameraPoses.length-2&&t>cameraPoses[i+1][0])i++;
  const a=cameraPoses[i],b=cameraPoses[i+1],prev=cameraPoses[Math.max(0,i-1)],next=cameraPoses[Math.min(cameraPoses.length-1,i+2)];
  const span=b[0]-a[0],u=clamp((t-a[0])/span),u2=u*u,u3=u2*u;
  const ma=(b[column]-prev[column])/(b[0]-prev[0]),mb=(next[column]-a[column])/(next[0]-a[0]);
  const value=(2*u3-3*u2+1)*a[column]+(u3-2*u2+u)*span*ma+(-2*u3+3*u2)*b[column]+(u3-u2)*span*mb;
  return THREE.MathUtils.clamp(value,Math.min(a[column],b[column]),Math.max(a[column],b[column]));
 }
 function render(){
  frame=0;if(!visible)return;
  const mobile=stage.clientWidth<701;
  if(mobile||reduced.matches){progress=.18;}else{const rect=section.getBoundingClientRect();progress=clamp(-rect.top/Math.max(1,section.offsetHeight-stage.offsetHeight));}
  // The stepped row aligns during the close-up. Static modes
  // show the completed alignment without scroll-driven motion.
  const alignment=mobile||reduced.matches?1:clamp(progress/0.42);
  positions.forEach((position,index)=>{
   const delay=Math.min(rowSlots[index]*0.045,0.35);
   const settled=ease(clamp((alignment-delay)/(1-delay)));
   rackOffsets[index]=rowSlots[index]*0.24*(1-settled);
   dummy.position.copy(position);dummy.position.y-=rackOffsets[index];
   dummy.rotation.set(0,-Math.PI/2,0);dummy.updateMatrix();racks.setMatrixAt(index,dummy.matrix);
   ledHeights.forEach((height,ledIndex)=>{
    dummy.position.set(position.x+0.43,position.y+height-rackOffsets[index],position.z+1.64);
    dummy.rotation.set(0,0,0);dummy.updateMatrix();
    statusLeds.setMatrixAt(index*ledHeights.length+ledIndex,dummy.matrix);
   });
  });
  racks.instanceMatrix.needsUpdate=true;statusLeds.instanceMatrix.needsUpdate=true;
  drawer.position.y=drawerBaseY-(rackOffsets[drawerRackIndex]||0);
  const cameraProgress=mobile||reduced.matches?0:progress;
  group.position.set(poseAt(cameraProgress,1),poseAt(cameraProgress,2),poseAt(cameraProgress,3));
  group.rotation.set(poseAt(cameraProgress,4),.35*Math.PI,0);
  drawer.position.z=THREE.MathUtils.lerp(2.56,1.33335,ease(clamp(progress/.65)));
  if(mobile){group.position.x-=.25;group.position.y+=.7;group.position.z-=3.4;}
  group.updateMatrixWorld(true);
  floorClip.set(new THREE.Vector3(0,1,0),-floorY).applyMatrix4(group.matrixWorld);
  renderer.render(scene,camera);
 }
 function request(){if(!frame)frame=requestAnimationFrame(render)}
 function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();request()}
 reduced.addEventListener('change',resize);
 addEventListener('scroll',request,{passive:true});
 new ResizeObserver(resize).observe(stage);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)request()},{rootMargin:'100px'}).observe(section);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();section.classList.remove('scene-ready')});
 section.classList.add('scene-ready');resize();
 // Exposed only for the local verification tool and static poster capture.
 canvas.capturePoster=()=>{renderer.render(scene,camera);return canvas.toDataURL('image/png')};
 draco.dispose();
}
