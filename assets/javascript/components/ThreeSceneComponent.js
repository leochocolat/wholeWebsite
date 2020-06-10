import { gsap } from 'gsap';
import Emitter from '../events/Emitter';
import bindAll from '../utils/bindAll';

import ThreeLightHouse from '../modules/threeModules/ThreeLightHouse';
import ThreeLights from '../modules/threeModules/ThreeLights';

const PESPECTIVE = 800;

class ThreeSceneComponent {
    constructor(options) {
        this.el = options.el;
        this.ui = {};
        this.sceneEntities = {};

        this._bindAll();
        this._setup();
    }

    close() {
        this._removeEventListeners();
    }

    _setup() {
        this._setupScene();
        this._resize();
        this._setupLighthouse();
        this._setupLights();
        this._setupEventListeners();
    }

    _resize(width, height, devicePixelRatio) {
        this._width = width || window.innerWidth;
        this._height = height || window.innerHeight;
        this._devicePixelRatio = devicePixelRatio || window.devicePixelRatio;

        this.el.width = this._width;
        this.el.height = this._height;

        this._renderer.setSize(this._width, this._height);
        this._renderer.setPixelRatio(this._devicePixelRatio);

        this._camera.fov = (180 * (2 * Math.atan(this._height / 2 / PESPECTIVE))) / Math.PI;
        this._camera.aspect = this._width/this._height;
        this._camera.updateProjectionMatrix();
    }

    _setupScene() {
        this._scene = new THREE.Scene();

		this._renderer = new THREE.WebGLRenderer({
            canvas: this.el,
            alpha: true
        });

        // this._renderer.setClearColor(0x1F1F1F);

        const fov = (180 * (2 * Math.atan(this.el.height / 2 / PESPECTIVE))) / Math.PI;

        this._camera = new THREE.PerspectiveCamera(fov, this.el.width / this.el.height, 1, 1000);
        this._camera.position.set(0, 0, PESPECTIVE);
    }

    _setupLights() {
        this.sceneEntities.lights = new ThreeLights(this._scene);
        this.sceneEntities.lights.setTarget(this.sceneEntities.lighthouse.mesh);
    }

    _setupLighthouse() {
        this.sceneEntities.lighthouse = new ThreeLightHouse(this._scene, this._width, this._height);
    }

    _update() {
        for (let name in this.sceneEntities) {
            this.sceneEntities[name].update();
        }

        this._renderer.render(this._scene, this._camera);
    }

    _bindAll() {
        bindAll(
            this,
            '_tickHandler',
            '_scrollHandler',
            '_resizeHandler'
        );
    }

    _setupEventListeners() {
        gsap.ticker.add(this._tickHandler);
        Emitter.on('SCROLL', this._scrollHandler);
        Emitter.on('RESIZE:END', this._resizeHandler);
    }

    _removeEventListeners() {
        gsap.ticker.remove(this._tickHandler);
    }

    _tickHandler() {
        this._update();
    }

    _scrollHandler() {
        
    }

    _resizeHandler(e) {
        this._resize(e.viewportWidth, e.viewportHeight, e.devicePixelRatio);
    }
}

export default ThreeSceneComponent;