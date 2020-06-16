import * as THREE from 'three';

import fragment from '../shaders/particles/fragment.glsl';
import vertex from '../shaders/particles/vertex.glsl';

const PESPECTIVE = 800;
let width, height, dpr;
let canvas, renderer, scene, camera, container;
let fov;
let imageSize, imageData, texture;
let mesh, cube, fog;

const handlers = {
    setup,
    resize,
    imageDataReady,
};

if (typeof self === "object") {
    self.onmessage = function (e) {
        const fn = handlers[e.data.type];
        if (!fn) {
            throw new Error('no handler for type: ' + e.data.type);
        } else {
            fn(e.data);
        }
    }
}

function setup(e) {
    setupScene(e);
    loadTexture();
    update();
}

function loadTexture() {
    let url = 'https://res.cloudinary.com/dgxpb4jhs/image/upload/v1592322434/sample-01_plvqsx.png';
    const loader = new THREE.ImageBitmapLoader();
    loader.load(url, response => {
        texture = new THREE.CanvasTexture(response);
        self.postMessage({
            texture: texture
        });
    });
}

function setupScene(e) {
    canvas = e.canvas;
    width = e.width;
    height = e.height;

    canvas.width = width;
    canvas.height = height;

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    // renderer.setClearColor(0x000000);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    camera.position.z = 1000;
    camera.position.y = -140;


    container = new THREE.Object3D();

    scene.add(container);

    // cube test
    // let cubeGeo = new THREE.BoxGeometry(100, 100, 100);
    // let cubeMaterial = new THREE.MeshStandardMaterial(0xffffff);
    // cube = new THREE.Mesh(cubeGeo, cubeMaterial);

    // container.add(cube);
}

function resize(e) {
    width = e.width;
    height = e.height;

    canvas.width = width;
    canvas.height = height;

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(dpr);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function setupParticules() {
    //filter
    const numPoints = imageSize.width * imageSize.height;
    const threshold = 34;

    let numVisible = 0;

    let originalColors = Float32Array.from(imageData.data);

    for (let i = 0; i < numPoints; i++) {
        if (originalColors[i * 4 + 0] > threshold) numVisible++;
    }

    //console.log('numVisible : ', numVisible, 'numPoints : ', numPoints);

    //points
    const uniforms = {
        uTime: { value: 0.0 },
        uRandom: { value: 1.0 },
        uDepth: { value: 4.0 },
        uSize: { value: 1.5 },
        uTextureSize: { value: new THREE.Vector2(width, height) },
        uTexture: { value: texture },
        uTouch: { value: null }
    };

    const material = new THREE.RawShaderMaterial({
        uniforms,
        vertexShader: vertex,
        fragmentShader: fragment,
        depthTest: false,
        transparent: true,
        // blending: THREE.AdditiveBlending
    });

    const geometry = new THREE.InstancedBufferGeometry();

    // positions
    const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
    positions.setXYZ(0, -0.5, 0.5, 0.0);
    positions.setXYZ(1, 0.5, 0.5, 0.0);
    positions.setXYZ(2, -0.5, -0.5, 0.0);
    positions.setXYZ(3, 0.5, -0.5, 0.0);
    geometry.setAttribute('position', positions);

    // uvs
    const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
    uvs.setXYZ(0, 0.0, 0.0);
    uvs.setXYZ(1, 1.0, 0.0);
    uvs.setXYZ(2, 0.0, 1.0);
    uvs.setXYZ(3, 1.0, 1.0);
    geometry.setAttribute('uv', uvs);

    // index
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

    const indices = new Uint16Array(numVisible);
    const offsets = new Float32Array(numVisible * 3);
    const angles = new Float32Array(numVisible);

    for (let i = 0, j = 0; i < numPoints; i++) {

        if (originalColors[i * 4 + 0] <= threshold) continue;

        offsets[j * 3 + 0] = i % width;
        offsets[j * 3 + 1] = Math.floor(i / width);

        indices[j] = i;

        angles[j] = Math.random() * Math.PI;

        j++;
    }

    geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
    geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
    geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));

    mesh = new THREE.Mesh(geometry, material);
    container.add(mesh);
}

function update() {
    if (cube) {
        cube.rotation.z += 0.01;
        cube.rotation.x += 0.01;
    }

    // camera.position.z += -1;
    // camera.rotation.y += 0.1;
    // camera.rotation.x += 0.1;

    if (mesh) {
        mesh.material.uniforms.uTime.value += 1;
    }

    renderer.render(scene, camera);

    requestAnimationFrame(update);
}

// function textureLoaded(texture) {

//     // texture = texture.texture;

//     // setupParticules();
// }

function imageDataReady(e) {
    imageSize = e.size;
    imageData = e.imageData;

    setupParticules();
}