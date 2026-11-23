import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export async function mountPreloader(overlay,signal,onProgress){
 const canvas=overlay.querySelector('canvas');
 const stage=overlay.querySelector('.preloader-stage');
 // Stream the supplied GLB so progress reflects actual asset loading.
 const response=await fetch('assets/preloader/mobius-logo.glb',{signal});
 if(!response.ok)throw new Error('Logo unavailable');
 const total=Number(response.headers.get('content-length'));
 const reader=response.body.getReader(),chunks=[];let loaded=0;
 while(true){const {done,value}=await reader.read();if(done)break;chunks.push(value);loaded+=value.length;if(total)onProgress(Math.min(.85,loaded/total*.85))}
 const bytes=new Uint8Array(loaded);let offset=0;
 for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}
 const gltf=await new GLTFLoader().parseAsync(bytes.buffer,'');
 const model=gltf.scene;
 function disposeModel(){model.traverse(node=>{if(node.isMesh){node.geometry.dispose();const list=Array.isArray(node.material)?node.material:[node.material];list.forEach(material=>material.dispose())}})}
 if(signal.aborted){disposeModel();return {render:()=>{},dispose:()=>{}}}
 let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'})}
 catch(error){disposeModel();throw error}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=.95;
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(32,1,.1,100);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
 const environment=pmrem.fromScene(room,.04);
 scene.environment=environment.texture;
 room.dispose();pmrem.dispose();
 const bounds=new THREE.Box3().setFromObject(model),center=bounds.getCenter(new THREE.Vector3());
 model.position.sub(center);
 const group=new THREE.Group();group.add(model);scene.add(group);
 const baseScale=3/Math.max(...bounds.getSize(new THREE.Vector3()).toArray());
 group.scale.setScalar(baseScale);
 // Retain the GLB's cyan-to-violet vertex colors and use a soft satin finish.
 model.traverse(node=>{if(node.isMesh){node.material.roughness=.3;node.material.metalness=.24;node.material.envMapIntensity=.85}});
 scene.add(new THREE.HemisphereLight(0xe9f3ff,0x1c2464,1.1));
 const key=new THREE.DirectionalLight(0xffffff,1.7);key.position.set(-3,4,5);scene.add(key);
 const rim=new THREE.DirectionalLight(0x96dfff,1.6);rim.position.set(4,1,-2);scene.add(rim);
 let disposed=false,poseTime=0,lastMotionTime=0,lastStaticPose=false,lastZoom=0,revealZoom=8;
 const clamp=value=>Math.max(0,Math.min(1,value));
 // One periodic orientation path: pose and angular velocity match at the
 // cycle boundary. Quaternion composition avoids abrupt Euler pose changes.
 const xAxis=new THREE.Vector3(1,0,0),yAxis=new THREE.Vector3(0,1,0),zAxis=new THREE.Vector3(0,0,1);
 const tiltRotation=new THREE.Quaternion(),yawRotation=new THREE.Quaternion(),rollRotation=new THREE.Quaternion();
 // Keep an unwrapped clockwise phase. Quaternion slerp can choose the
 // shorter counterclockwise route when settling into the final half turn.
 // A full turn takes 2.7 seconds at the intro playback rate.
 const cycleDuration=1.8,exitDuration=1.05,alignmentEnd=.48;
 let exiting=false,exitPhase=0,targetPhase=0,exitTilt=0,exitYaw=0;
 const smoother=value=>{const p=clamp(value);return p*p*p*(p*(p*6-15)+10)};
 function render(time,staticPose=false,motionTime=time,zoom=0){
  if(disposed)return;
  poseTime=time;lastMotionTime=motionTime;lastStaticPose=staticPose;lastZoom=zoom;
  const phase=2*Math.PI*motionTime/cycleDuration;
  // Reach full size early enough to show a complete revolution before exit.
  const arrival=smoother(time/.5);
  group.scale.setScalar(baseScale*(staticPose?1:arrival));
  group.position.set(0,0,0);camera.clearViewOffset();
  // Optical zoom preserves the circular opening instead of pushing the
  // curved mesh through the camera's near plane as its scale increases.
  camera.zoom=staticPose?1:Math.pow(32,smoother((zoom-.18)/.82));
  camera.updateProjectionMatrix();
  if(staticPose)group.quaternion.identity();
  else{
   let roll=phase,tilt=.52*(1-Math.cos(phase)),yaw=.22*Math.sin(phase);
   if(zoom>0){
    if(!exiting){
     exitPhase=phase;exitTilt=tilt;exitYaw=yaw;
     targetPhase=Math.PI+Math.ceil((phase-Math.PI)/(2*Math.PI))*2*Math.PI;
     exiting=true;
    }
    const p=clamp(zoom/alignmentEnd),alignment=smoother(p);
    const distance=targetPhase-exitPhase;
    // Monotone Hermite easing matches entry speed and settles without reversal.
    const slope=distance>1e-6?Math.min(3,(2*Math.PI/cycleDuration)*exitDuration*alignmentEnd/distance):0;
    const turn=slope*p+(3-2*slope)*p*p+(slope-2)*p*p*p;
    roll=exitPhase+distance*turn;
    tilt=THREE.MathUtils.lerp(exitTilt,1.04,alignment);
    yaw=THREE.MathUtils.lerp(exitYaw,0,alignment);
    // The opening is offset within this asymmetric GLB; center the opening,
    // rather than its outer bounding box, before the final zoom fills frame.
    group.position.set(-.45*alignment,-.20*alignment,0);
   }else exiting=false;
   tiltRotation.setFromAxisAngle(xAxis,tilt);
   yawRotation.setFromAxisAngle(yAxis,yaw);
   rollRotation.setFromAxisAngle(zAxis,-roll);
   group.quaternion.copy(rollRotation).multiply(tiltRotation).multiply(yawRotation);
  }
  renderer.render(scene,camera);
  // Reveal as soon as the opening clears the screen, without waiting through
  // the invisible remainder of the 32× zoom.
  return !staticPose && zoom>=alignmentEnd && camera.zoom>=revealZoom;
 }
 function resize(){
  const w=stage.clientWidth,h=stage.clientHeight;
  renderer.setSize(w,h,false);camera.aspect=w/h;
  const projected=Math.min(h*.49,w*.72);
  revealZoom=Math.hypot(w,h)/(projected*.48)*1.08;
  camera.position.z=3/(2*Math.tan(THREE.MathUtils.degToRad(16))*(projected/h));
  camera.updateProjectionMatrix();render(poseTime,lastStaticPose,lastMotionTime,lastZoom);
 }
 resize();
 const observer=new ResizeObserver(resize);observer.observe(stage);
 overlay.classList.add('is-rendered');onProgress(1);
 const dispose=()=>{if(disposed)return;disposed=true;observer.disconnect();disposeModel();environment.dispose();renderer.dispose();renderer.forceContextLoss()};
 signal.addEventListener('abort',dispose,{once:true});
 return {render,dispose};
}
