import * as THREE from 'three';
import * as dat from 'dat.gui';

function init() {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 50); // Move the camera back along the z-axis to see the scene
    
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

    // Snowman's body

    const snowManHead = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
    const snowmanTorso = new THREE.Mesh(new THREE.SphereGeometry(7, 32, 32), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
    const snowmanBase = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));

    snowManHead.position.set(0, 12, 0);
    snowmanTorso.position.set(0, 0, 0);
    snowmanBase.position.set(0, -15, 0);

    scene.add(snowManHead);
    scene.add(snowmanTorso);
    scene.add(snowmanBase);

    // Directional light

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Ambient light

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Set up webgl renderer

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);

    // Add the output of the render function to the HTML
    document.body.appendChild(renderer.domElement);

    // Create controls for the GUI
    const controls = new function () {
        // Add controls...
        // this.scaleX = 1;
    };
    // Create the GUI
    const gui = new dat.GUI();
    // gui.add(controls, 'scaleX', 0, 5);

    // Function for re-rendering/animating the scene
    function tick() {
        requestAnimationFrame(tick);
        renderer.render(scene, camera);
    }
    tick();
}

init();
