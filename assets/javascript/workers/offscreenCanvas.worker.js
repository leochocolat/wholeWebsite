import * as THREE from 'three';

const PESPECTIVE = 800;
let width, height, dpr;
let canvas, renderer, scene, camera;
let fov;

const handlers = {
    setup,
    resize,
};

if (typeof self === "object") {
    self.onmessage = function(e) {
        const fn = handlers[e.data.type];
        if (!fn) {
            throw new Error('no handler for type: ' + e.data.type);
        } else {
            fn(e.data);
        }
    }
}

function setup(e) {
    canvas = e.canvas;
    canvas.width = e.width;
    canvas.height = e.height;
    
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    });

    scene = new THREE.Scene();

    fov = (180 * (2 * Math.atan(height / 2 / PESPECTIVE))) / Math.PI;
    camera = new THREE.PerspectiveCamera(fov, width / height, 1, 1000);

    update();
}

function resize(e) {
    width = e.width;
    height = e.height;
    dpr = e.devicePixelRatio;

    canvas.width = width;
    canvas.height = height;

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(dpr);

    fov = (180 * (2 * Math.atan(height / 2 / PESPECTIVE))) / Math.PI;
    camera.fov = fov;
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
}

function update() {
    renderer.render(scene, camera);

    requestAnimationFrame(update);
}