import * as THREE from "three";
import dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

function init() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 50); // Move the camera back along the z-axis to see the scene

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Snowman's body

  const snowmanHead = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  const snowmanTorso = new THREE.Mesh(
    new THREE.SphereGeometry(7, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  const snowmanBase = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

  snowmanHead.position.set(0, 12, 0);
  snowmanTorso.position.set(0, 0, 0);
  snowmanBase.position.set(0, -15, 0);

  // Hat Brim
  const brimGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
  const brimMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const brim = new THREE.Mesh(brimGeometry, brimMaterial);
  brim.position.set(0, 16, 0);
  scene.add(brim);

  // Hat Top
  const hatTopGeometry = new THREE.CylinderGeometry(3, 4, 5, 32);
  const hatTopMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const hatTop = new THREE.Mesh(hatTopGeometry, hatTopMaterial);
  hatTop.position.set(0, 18.5, 0);
  scene.add(hatTop);

  // Carrot Nose

  const noseGeometry = new THREE.CylinderGeometry(0.5, 0, 3, 32);
  const noseMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
  const nose = new THREE.Mesh(noseGeometry, noseMaterial);
  nose.position.set(0, 12, 5);
  nose.rotation.x = Math.PI / 2;
  scene.add(nose);

  // Black Eyes

  const eyeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-1.5, 14, 4.8);

  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(1.5, 14, 4.8);

  scene.add(leftEye);
  scene.add(rightEye);

  // Black smile

  const smileGeometry = new THREE.TorusGeometry(1.5, 0.2, 2, 20, Math.PI);
  const smileMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const smile = new THREE.Mesh(smileGeometry, smileMaterial);
  smile.position.set(0, 10, 4.5);
  smile.rotation.x = Math.PI;
  scene.add(smile);

  // Black buttons

  const buttonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

  const buttons = [];
  const buttonPositions = [2, 0, -3];

  for (let i = 0; i < buttonPositions.length; i++) {
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.position.set(0, buttonPositions[i], 6.5);
    buttons.push(button);
    scene.add(button);
  }

  // Main Branches

  const armGeometry = new THREE.CylinderGeometry(0.3, 0.3, 10, 8);
  const armMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);

  leftArm.position.set(-8, 0, 0);
  leftArm.rotation.z = Math.PI / 4;
  leftArm.rotation.y = -Math.PI / 8;

  rightArm.position.set(8, 0, 0);
  rightArm.rotation.z = -Math.PI / 4;
  rightArm.rotation.y = Math.PI / 8;

  scene.add(leftArm);
  scene.add(rightArm);

  // Offshoots

  const offshootGeometry = new THREE.BoxGeometry(0.2, 0.2, 3);
  const offshootMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });

  function addOffshoots(arm, yOffset, zOffset) {
    const offshoot = new THREE.Mesh(offshootGeometry, offshootMaterial);
    offshoot.position.y = yOffset;
    offshoot.position.z = zOffset;
    offshoot.rotation.x = 0;
    arm.add(offshoot);
  }

  // Add offshoots to the left arm
  addOffshoots(leftArm, 4, 1);
  addOffshoots(leftArm, 3, -1);
  addOffshoots(leftArm, 2, 0.5);

  // Add offshoots to the right arm
  addOffshoots(rightArm, 4, 1);
  addOffshoots(rightArm, 3, -1);
  addOffshoots(rightArm, 2, 0.5);

  scene.add(snowmanHead);
  scene.add(snowmanTorso);
  scene.add(snowmanBase);

  // Directional light

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Ambient light

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Function to save the exported string as a file

  function saveString(text, filename) {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  // Export GLTF function

  function exportGLTF() {
    const exporter = new GLTFExporter();
    exporter.parse(scene, (gltf) => {
      saveString(JSON.stringify(gltf), "snowman_scene.gltf");
    });
  }

  // Create controls for the GUI
  const controls = new (function () {
    this.snowVisible = false;
  })();
  // Create the GUI
  const gui = new dat.GUI();
  gui
    .add(controls, "snowVisible")
    .name("Snowfall")
    .onChange(function (value) {
      snow.visible = value;
    });

  // Add export folder

  gui.add({ exportGLTF }, "exportGLTF").name("Export to GLTF");

  // Add snow

  const snowParticleCount = 2000;
  // each snow particle has x, y and z coordinates
  const snowParticlesPositions = new Float32Array(snowParticleCount * 3);

  for (let i = 0; i < snowParticleCount; i++) {
    snowParticlesPositions[i * 3 + 0] = Math.random() * 200 - 100;
    snowParticlesPositions[i * 3 + 1] = Math.random() * 200 - 100;
    snowParticlesPositions[i * 3 + 2] = Math.random() * 200 - 100;
  }

  const snowGeometry = new THREE.BufferGeometry();
  snowGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(snowParticlesPositions, 3)
  );
  const snowMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });

  const snow = new THREE.Points(snowGeometry, snowMaterial);
  snow.visible = controls.snowVisible;
  scene.add(snow);

  // Regulate snow speed

  const snowSpeed = new Float32Array(snowParticleCount);
  for (let i = 0; i < snowParticleCount; i++) {
    // snowflakes fall at random speed
    snowSpeed[i] = 0.05 + Math.random() * 0.02;
  }

  // Snow motion effects

  function addSnowMotionEffects() {
    for (let i = 0; i < snowParticleCount; i++) {
      snowGeometry.attributes.position.array[i * 3 + 1] -= snowSpeed[i];
      if (snowGeometry.attributes.position.array[i * 3 + 1] < -100) {
        // reset snowflake to the top
        snowGeometry.attributes.position.array[i * 3 + 1] = 100;
        // reset x position to spread snowflakes out again
        snowGeometry.attributes.position.array[i * 3 + 0] =
          Math.random() * 200 - 100;
      }

      // add sway based on snowflake's y poistion
      snowGeometry.attributes.position.array[i * 3 + 0] +=
        Math.sin(
          Date.now() * 0.001 + snowGeometry.attributes.position.array[i * 3 + 1]
        ) * 0.01;
    }

    // update the snowflakes' position
    snowGeometry.attributes.position.needsUpdate = true;
  }

  // Set up webgl renderer

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(sizes.width, sizes.height);

  // Create orbit controls

  const orbit = new OrbitControls(camera, renderer.domElement);

  // Add the output of the render function to the HTML
  document.body.appendChild(renderer.domElement);

  // Function for re-rendering/animating the scene
  function tick() {
    addSnowMotionEffects();
    orbit.update();
    requestAnimationFrame(tick);
    renderer.render(scene, camera);
  }
  tick();
}

init();
