// const lenis = new Lenis();
// lenis.on("scroll", ScrollTrigger.update);
// gsap.ticker.add((time) => lenis.raf(time * 1000));
// gsap.ticker.lagSmoothing(0);

// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xfefdfd);

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// const renderer = new THREE.WebGLRenderer({
//   antialias: true,
//   alpha: true,
// });

// renderer.setClearColor(0xffffff, 1);
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.physicallyCorrectLights = true;
// renderer.toneMapping = THREE.ACESFilmicToneMapping; // toneMapping
// renderer.toneMappingExposure = 2.5; // exposure
// document.querySelector(".model").appendChild(renderer.domElement);

// function basicAnimate() {
//   renderer.render(scene, camera);
//   requestAnimationFrame(basicAnimate);
// }

// basicAnimate();

// let model;
// const loader = new THREE.GLTFLoader();
// loader.load("./extinction/magic_sword.glb", function (gltf) {
//   model = gltf.scene;
//   model.traverse((node) => {
//     if (node.isMesh) {
//       if (node.material) {
//         node.material.metalness = 0.3;
//         node.material.roughness = 0.4;
//         node.material.envMapIntensity = 1.5;
//       }
//       node.castShadow = true;
//       node.receiveShadow = true;
//     }
//   });
//   const box = new THREE.Box3().setFromObject(model);
//   const center = box.getCenter(new THREE.Vector3());
//   model.position.sub(center); // Center the model
//   //   model.position.set(0, -0.5, 0);
//   //   model.rotation.set(0, 0, 0);
//   model.scale.set(1, 1, 1);
//   scene.add(model);

//   const size = box.getSize(new THREE.Vector3());
//   const maxDim = Math.max(size.x, size.y, size.z);
//   camera.position.z = maxDim * 1.5; // Adjust camera distance based on model size
//   //model.scale.set(0, 0, 0);
//   playInitialAnimation();
//   cancelAnimationFrame(basicAnimate);
//   animate();
// });
