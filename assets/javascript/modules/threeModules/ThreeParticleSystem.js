class ThreeParticleSystem {
    constructor(scene, height, width) {
        this._scene = scene;
        this._width = width;
        this._height = height;

        this._amount = 1000;

        this._setup();
    }

    update() {
        if (!this._particleSystem) return;

        this._particleSystem.rotation.y += 0.001;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;
    }

    _setup() {
        new THREE.TextureLoader().load('images/particle.png', texture => {
            this._setupParticles(texture);
            this._setupEventListeners();
        });
    }

    _setupParticles(texture) {
        let geometry = new THREE.BufferGeometry();
        let vertices = [];

        let material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 10,
            map: texture,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: false
        });

        for (let i = 0; i < this._amount; i++) {
            const x = Math.random() * this._width * 2 - this._width;
            const y = Math.random() * this._height - this._height/2;
            const z = Math.random() * -500;

            vertices.push(x, y, z);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        this._particleSystem = new THREE.Points(geometry, material);

        // this._scene.add(this._particleSystem);
    }

    _setupEventListeners() {

    }

}

export default ThreeParticleSystem;