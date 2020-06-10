class ThreeLights {
    constructor(scene) {
        this._scene = scene;

        this._setup();
    }

    update() {

    }

    resize() {

    }

    setTarget(mesh) {
        if (!mesh) return;

        this._directionalLight.target = mesh;
        this._spotLightPink.target = mesh;
        this._spotLightPurple.target = mesh;
    }

    _setup() {
        this._ambientLight = new THREE.AmbientLight(0xffffff);
        this._directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this._spotLightPink = new THREE.SpotLight(0xD493B8, 1);
        this._spotLightPink.position.set(500, 500, 1000);

        this._spotLightPurple = new THREE.SpotLight(0x393C60, 1);
        this._spotLightPurple.position.set(-500, 500, 1000);

        this._scene.add(this._ambientLight);
        this._scene.add(this._directionalLight);

        this._scene.add(this._spotLightPink);
        this._scene.add(this._spotLightPurple);
    }
}

export default ThreeLights;