import * as THREE from 'three';
import { TweenLite, Power3 } from 'gsap';

import fragment from '../shaders/particles/fragment.glsl';
import vertex from '../shaders/particles/vertex.glsl';

import fragmentBg from '../shaders/fragment.glsl';
import vertexBg from '../shaders/vertex.glsl';

import TouchTexture from '../modules/threeModules/TouchTexture';

const PESPECTIVE = 800;

let width, height, dpr;
let canvas, renderer, scene, camera, container;
let fov, raycaster, intersectionData;
let imageSize, imageData, texture, uniforms, hitArea, touchTexture;
let mouse, offset, intersection, plane, gradientPlane;
let mesh, cube;

const handlers = {
    setup,
    resize,
    imageDataReady,
    transitionOut,
    mousemove,
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
    setupTouchTexture(e);
    setupScene(e);
    setupBackground(e);
    setupInteractiveMouse(e);
    loadTexture();
    update();
}

function setupTouchTexture(e) {
    touchTexture = new TouchTexture();
}

function transitionIn() {
    TweenLite.to(uniforms.uSize, 1, { value: 0.3, ease: Power3.easeInOut });
    TweenLite.to(uniforms.uRandom, 1, { value: 7.0, ease: Power3.easeInOut });
    TweenLite.fromTo(uniforms.uDepth, 2, { value: 20.0 }, { value: 0.4, ease: Power3.easeInOut });
}

function transitionOut() {
    TweenLite.to(uniforms.uSize, 2, { value: 0.0, ease: Power3.easeInOut });
    TweenLite.to(uniforms.uRandom, 1, { value: 20.0, ease: Power3.easeInOut });
    TweenLite.to(uniforms.uDepth, 2, { value: -20.0, ease: Power3.easeInOut });
}

function loadTexture() {
    let url = '../images/whole-texture.jpg';
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

    scene = new THREE.Scene();

    fov = (180 * (2 * Math.atan(height / 2 / PESPECTIVE))) / Math.PI;

    camera = new THREE.PerspectiveCamera(fov, width / height, 1, 1000);

    container = new THREE.Object3D();

    scene.add(container);
}

function setupBackground() {
    let backgroundUniforms = {
        u_resolution: { value: new THREE.Vector3(width, height, 0) },
        u_time: { value: 0 },
        u_delta_time: { value: 17 },
        u_fps: { value: 60 },
        //colors
        u_primary_color: { value: new THREE.Color(0x393C60), type : 'c' },
        u_primary_position: { value: 0.0 },
        u_secondary_color: { value: new THREE.Color(0x111737), type : 'c' },
        u_secondary_position: { value: 0.5 },
    }

    let backgroundGeometry = new THREE.PlaneGeometry(1, 1, 1);
    let geometryMaterial = new THREE.ShaderMaterial({
        uniforms: backgroundUniforms,
        fragmentShader: fragmentBg,
        vertexShader: vertexBg,
    });

    let backgroundPlane = new THREE.Mesh(backgroundGeometry, geometryMaterial);
    backgroundPlane.scale.set(width, -height, 100);
    backgroundPlane.position.set(0, 0, -210);

    container.add(backgroundPlane);
}

function setupInteractiveMouse() {
    plane = new THREE.Plane();
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    offset = new THREE.Vector3();
    intersection = new THREE.Vector3();
}

function resize(e) {
    width = e.width;
    height = e.height;

    canvas.width = width;
    canvas.height = height;

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(dpr);

    fov = (180 * (2 * Math.atan(height / 2 / PESPECTIVE))) / Math.PI;

    camera.fov = fov;
    // camera.set(0, 0, PESPECTIVE);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function initHitArea() {
    const geometry = new THREE.PlaneGeometry(imageSize.width, imageSize.height, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true, depthTest: false });
    material.visible = false;
    hitArea = new THREE.Mesh(geometry, material);
    hitArea.position.set(0, 0, -200);
    container.add(hitArea);
}

function setupParticules() {
    //filter
    const numPoints = imageSize.width * imageSize.height;
    const threshold = 100;

    let numVisible = 0;

    let originalColors = Float32Array.from(imageData.data);

    for (let i = 0; i < numPoints; i++) {
        if (originalColors[i * 4 + 0] > threshold) numVisible++;
    }

    //points
    uniforms = {
        uTime: { value: 0.0 },
        uRandom: { value: 2.0 },
        uDepth: { value: 0.0 },
        uSize: { value: 0.0 },
        uTextureSize: { value: new THREE.Vector2(imageSize.width, imageSize.height) },
        uTexture: { value: texture },
        uTouch: { value: touchTexture.texture }
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

        offsets[j * 3 + 0] = i % imageSize.width;
        offsets[j * 3 + 1] = Math.floor(i / imageSize.width);

        indices[j] = i;

        angles[j] = Math.random() * Math.PI;

        j++;
    }

    geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
    geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
    geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -200);
    container.add(mesh);
}

function update() {
    if (cube) {
        cube.rotation.z += 0.01;
        cube.rotation.x += 0.01;
    }

    if (mesh) {
        mesh.material.uniforms.uTime.value += 0.1;
    }

    touchTexture.update();

    renderer.render(scene, camera);

    requestAnimationFrame(update);
}

function mousemove(e) {
    if (!hitArea) return;
    
    mouse.x = ((e.mousePosition.x + 0) / width) * 2 - 1;
    mouse.y = -((e.mousePosition.y + 0) / height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([hitArea]);

    if (intersects.length > 0) {
        plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(plane.normal), intersects[0].object.position);
        intersectionData = intersects[0];

        const uv = intersectionData.uv;
        if (touchTexture) touchTexture.addTouch(uv);
    }
}

function imageDataReady(e) {
    imageSize = e.size;
    imageData = e.imageData;

    setupParticules();
    initHitArea();
    transitionIn();
}