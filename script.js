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

    // Add snow

    const snowParticleCount = 5000;
    // each snow particle has x, y and z coordinates
    const snowParticlesPositions = new Float32Array(snowParticleCount * 3);

    for (let i = 0; i < 1000; i++) {
        snowParticlesPositions[i * 3 + 0] = Math.random() * 200 - 100;
        snowParticlesPositions[i * 3 + 1] = Math.random() * 200 - 100;
        snowParticlesPositions[i * 3 + 2] = Math.random() * 200 - 100;
    }

    const snowGeometry = new THREE.BufferGeometry;
    snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowParticlesPositions, 3));
    const snowMaterial = new THREE.PointsMaterial({color: 0xFFFFFF, size: 0.5});
    
    const snow = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snow);

    // Regulate snow speed

    const snowSpeed = new Float32Array(snowParticleCount);
    for (let i = 0; i < snowParticleCount; i++) {
        // snowflakes fall at random speed
        snowSpeed[i] = 0.1 + Math.random() * 0.2;
    }

    // Snow motion effects

    function addSnowMotionEffects() {
        for (let i = 0;  i < snowParticleCount; i++) {
            snowGeometry.attributes.position.array[i * 3 + 1] -= snowSpeed[i];
            if (snowGeometry.attributes.position.array[i * 3 + 1] < -100) {
                // reset snowflake to the top
                snowGeometry.attributes.position.array[i * 3 + 1] = 100;
                // reset x position to spread snowflakes out again
                snowGeometry.attributes.position.array[i * 3 + 0] = Math.random() * 200 - 100;
            }

            // add sway based on snowflake's y poistion
            snowGeometry.attributes.position.array[i * 3 + 0] += Math.sin(Date.now() * 0.001 + snowGeometry.attributes.position.array[i * 3 + 1]) * 0.01;
        }

            // update the snowflakes' position
        snowGeometry.attributes.position.needsUpdate = true;
    }

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
        addSnowMotionEffects();
        requestAnimationFrame(tick);
        renderer.render(scene, camera);
    }
    tick();
}

init();
