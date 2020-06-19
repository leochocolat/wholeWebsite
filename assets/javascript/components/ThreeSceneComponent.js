import { gsap } from 'gsap';
import Emitter from '../events/Emitter';
import bindAll from '../utils/bindAll';

import ThreeBackgroundPlane from '../modules/threeModules/ThreeBackgroundPlane';
import ThreeLightHouse from '../modules/threeModules/ThreeLightHouse';
import ThreeLights from '../modules/threeModules/ThreeLights';
import ThreeFog from '../modules/threeModules/ThreeFog';
import ThreeParticleSystem from '../modules/threeModules/ThreeParticleSystem';

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
        this._setupDeltaTime();

        this._setupScene();
        this._resize();

        //scene entities
        this._setupParticleSystem();
        this._setupFog();
        this._setupBackgroundPlane();
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

        for (let name in this.sceneEntities) {
            if (!this.sceneEntities[name].resize) continue;
            this.sceneEntities[name].resize(width, height, devicePixelRatio)
        }
    }

    _setupDeltaTime() {
        this._time = 0;
        this._startTime = Date.now();
        this._dateNow = this._startTime;
        this._lastTime = this._dateNow;
        this._deltaTime = 16;
        this._fps = Math.round(1000 / this._deltaTime);
    }

    _setupScene() {
        this._scene = new THREE.Scene();

		this._renderer = new THREE.WebGLRenderer({
            canvas: this.el,
            alpha: true
        });

        this._renderer.setClearColor(0x393C60);

        const fov = (180 * (2 * Math.atan(this.el.height / 2 / PESPECTIVE))) / Math.PI;

        this._camera = new THREE.PerspectiveCamera(fov, this.el.width / this.el.height, 1, 1000);
        this._camera.position.set(0, 0, PESPECTIVE);
    }

    /*
    Scene Entities
    */
    _setupParticleSystem() {
        this.sceneEntities.particleSystem = new ThreeParticleSystem(this._scene, this._width, this._height);
    }

    _setupFog() {
        this.sceneEntities.fog = new ThreeFog(this._scene);
    }

    _setupBackgroundPlane() {
        this.sceneEntities.backgroundPlane = new ThreeBackgroundPlane(this._scene, this._width, this._height);
    }

    _setupLights() {
        this.sceneEntities.lights = new ThreeLights(this._scene);
        this.sceneEntities.lights.setTarget(this.sceneEntities.lighthouse.mesh);
    }

    _setupLighthouse() {
        this.sceneEntities.lighthouse = new ThreeLightHouse(this._scene, this._width, this._height);
    }

    _updateDeltaTime() {
        this._dateNow = Date.now();
        this._time = this._dateNow - this._startTime;
        this._deltaTime = this._dateNow - this._lastTime;
        this._lastTime = this._dateNow;
        this._fps = Math.round(1000 / this._deltaTime);
    }

    _update() {
        this._updateDeltaTime();

        for (let name in this.sceneEntities) {
            if (!this.sceneEntities[name].update) continue;

            this.sceneEntities[name].update(this._time, this._deltaTime, this._fps);
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
        Emitter.on('SCROLL', this._scrollHandler, { passive: true });
        Emitter.on('RESIZE:END', this._resizeHandler, { passive: true });
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