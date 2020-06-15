import ThreeLightHouse from './ThreeLightHouse';
import ThreeLights from './ThreeLights';
import ThreeFog from './ThreeFog';
import ThreeBackgroundPlane from './ThreeBackgroundPlane';
import ThreeParticleSystem from './ThreeParticleSystem';

const PESPECTIVE = 800;

class ThreeScene {
    constructor(canvas, width, height, devicePixelRatio) {
        this._canvas = canvas;
        this._width = width;
        this._height = height;
        this._devicePixelRatio = devicePixelRatio;

        this._sceneEntities = {};

        this._setup();
    }

    resize(width, height, devicePixelRatio) {
        this._width = width;
        this._height = height;
        this._devicePixelRatio = devicePixelRatio;

        this._renderer.setSize(this._width, this._height, false);
        // this._renderer.setPixelRatio(this._devicePixelRatio);

        this._fov = (180 * (2 * Math.atan(this._height / 2 / PESPECTIVE))) / Math.PI;
        this._camera.fov = this._fov;
        this._camera.aspect = this._width/this._height;
        this._camera.updateProjectionMatrix();

        for (let name in this._sceneEntities) {
            if (!this._sceneEntities[name].resize) return;
            this._sceneEntities[name].resize(this._width, this._height, this._devicePixelRatio);
        }
    }

    update() {
        this._updateDeltaTime();

        for (let name in this._sceneEntities) {
            if (!this._sceneEntities[name].update) return;
            this._sceneEntities[name].update(this._dateNow, this._deltaTime, this._fps);
        }
        
        this._renderer.render(this._scene, this._camera);
    }

    _setup() {
        this._setupDeltaTime();
        this._setupScene();

        this._setupSceneEntities();
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
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            alpha: true,
            antialias: false
        });

        this._renderer.setClearColor(0x393C60);

        this._renderer.setSize(this._width, this._height, false);
        // this._renderer.setPixelRatio(this._devicePixelRatio);

        this._scene = new THREE.Scene();

        this._fov = (180 * (2 * Math.atan(this._height / 2 / PESPECTIVE))) / Math.PI;

        this._camera = new THREE.PerspectiveCamera(this._fov, this._width / this._height, 1, 1000);
        this._camera.position.set(0, 0, PESPECTIVE);
    }

    _setupSceneEntities() {
        this._sceneEntities.lights = new ThreeLights(this._scene);
        // this._sceneEntities.lights.setTarget(this._sceneEntities.lighthouse.mesh);

        this._sceneEntities.fog = new ThreeFog(this._scene);
        this._sceneEntities.lighthouse = new ThreeLightHouse(this._scene, this._width, this._height);
        this._sceneEntities.backgroundPlane = new ThreeBackgroundPlane(this._scene, this._width, this._height);
        this._sceneEntities.particules = new ThreeParticleSystem(this._scene, this._width, this._height);
    }

    _updateDeltaTime() {
        this._dateNow = Date.now();
        this._time = this._dateNow - this._startTime;
        this._deltaTime = this._dateNow - this._lastTime;
        this._lastTime = this._dateNow;
        this._fps = Math.round(1000 / this._deltaTime);

        // console.log(this._fps);
    }
}

export default ThreeScene;