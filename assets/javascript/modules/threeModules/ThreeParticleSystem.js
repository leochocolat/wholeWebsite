class ThreeParticleSystem {
    constructor(scene, height, width) {
        this._scene = scene;
        this._width = width;
        this._height = height;

        this._amount = 1000;
        this._particles = new THREE.Geometry();

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
        new THREE.TextureLoader().load('images/particle.png', texture => {
            this._setupParticles(texture);
            this._setupEventListeners();
        });
    }

    _setupParticles(texture) {
        let material = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 10,
            map: texture,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        for (let i = 0; i < this._amount; i++) {
            const x = Math.random() * this._width * 2 - this._width;
            const y = Math.random() * this._height - this._height/2;
            const z = Math.random() * -500;

            const particle = new THREE.Vector3(x, y, z);
            particle.velocity = new THREE.Vector3(
                Math.random(),
                Math.random(),
                Math.random(),
            )

            this._particles.vertices.push(particle);
        }

        this._particleSystem = new THREE.Points(this._particles, material);

        this._scene.add(this._particleSystem);
    }

    _setupEventListeners() {

    }

}

export default ThreeParticleSystem;