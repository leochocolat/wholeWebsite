import Emitter from '../../events/Emitter';
import bindAll from '../../utils/bindAll';

import { TweenLite } from 'gsap';

class ThreeParticleSystem {
    constructor(scene, height, width) {
        this._scene = scene;
        this._width = width;
        this._height = height;

        this._amount = 100;

        this._bindAll();
        this._setup();
    }

    update() {
        if (!this._particleSystem) return;

        // this._particleSystem.rotation.y += 0.001;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;
    }

    _setup() {
        let loader = new THREE.ImageBitmapLoader();

        loader.load('../images/particle.png', imageBitmap => {
            const texture = new THREE.CanvasTexture(imageBitmap);
            this._setupParticles(texture);
            this._setupEventListeners();
        });
    }

    _setupParticles(texture) {
        let geometry = new THREE.BufferGeometry();
        let vertices = [];

        let material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 50,
            map: texture,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false,
            opacity: 0
        });

        for (let i = 0; i < this._amount; i++) {
            const x = Math.random() * this._width * 2 - this._width;
            const y = Math.random() * this._height * 4 - this._height * 2;
            const z = Math.random() * -500;

            vertices.push(x, y, z);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        this._particleSystem = new THREE.Points(geometry, material);

        this._scene.add(this._particleSystem);
    }

    _animateIn() {
        TweenLite.to(this._particleSystem.material, 1, { opacity: 1 });
    }

    _animateOut() {
        TweenLite.to(this._particleSystem.material, 1, { opacity: 0, onComplete: () => {
            this._allowParticulesAnimation = false;
        } });
    }

    _bindAll() {
        bindAll(
            this,
            '_scrollHandler',
            '_seaEnterHandler',
            '_seaLeaveHandler'
        );
    }

    _setupEventListeners() {
        Emitter.on('SCROLL', this._scrollHandler);
        Emitter.on('SEA:ENTER', this._seaEnterHandler);
        Emitter.on('SEA:EXIT', this._seaLeaveHandler);
    }

    _scrollHandler(e) {
        // if (!this._allowParticulesAnimation) return;
        this._particleSystem.position.y -= e.delta * 0.5;
    }

    _seaEnterHandler() {
        this._allowParticulesAnimation = true;
        this._animateIn();
    }
    
    _seaLeaveHandler(e) {
        this._animateOut();
    }

}

export default ThreeParticleSystem;