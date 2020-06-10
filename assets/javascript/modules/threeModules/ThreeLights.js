class ThreeLights {
    constructor(scene) {
        this._scene = scene;

        this._setup();
    }

    update() {

    }

    reszie() {

    }

    setTarget(mesh) {
        this._directionalLight.target = mesh;
    }

    _setup() {
        this._ambientLight = new THREE.AmbientLight(0x404040);
        this._directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

        this._scene.add(this._ambientLight);
        this._scene.add(this._directionalLight);
    }
}

export default ThreeLights;