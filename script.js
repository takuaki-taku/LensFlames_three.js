import * as THREE from 'three';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';


let camera, scene, renderer;
let controls;

const clock = new THREE.Clock();




init();
animate();

function init(){
  //camera
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    15000
  );
  camera.position.z = 250;


  //scene
  scene = new THREE.Scene();

  //geometry
  const size = 250;
  const geometry = new THREE.BoxGeometry(size,size,size);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 50, //輝度
  });

  for(let i=0; i < 2500; i++){
    const mesh = new THREE.Mesh(geometry,material);

    mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

    //回転度合いをランダムに
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z = Math.random() * Math.PI;
  
    scene.add(mesh);
  }

  //平行光源
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.1);
  scene.add(dirLight);

  //レンズフレアを追加する
  const textureLoader = new THREE.TextureLoader();
  const textureFlare = textureLoader.load("./textures/LensFlare.png");

  addLight(8, 0.3, 0.9, 0, 0, -1000);

  //ポイント光源を追加
  function addLight(h, s, l, x, y, z){
    const light =new THREE.PointLight(0xffffff, 1.5, 2000);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);

    const lensflare = new Lensflare();
    lensflare.addElement(
      new LensflareElement(textureFlare, 700, 0, light.color)
    );

    scene.add(lensflare);
  }

  //renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

    //　マウス操作を行う
  controls = new FlyControls(camera, renderer.domElement);

  controls.movementSpeed = 2500;
  controls.rollSpeed = 1/ (3 * Math.PI);


  
  renderer.render(scene, camera);
}


function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); //経過した時間を取得
  controls.update(delta);
  renderer.render(scene, camera);
}

