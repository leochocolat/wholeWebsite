import fragment from '../../shaders/fragment.glsl';
import vertex from '../../shaders/vertex.glsl';

const POS_Z = -200;

class ThreeBackgroundPlane {
    constructor(scene, width, height) {
        this._scene = scene;
        this._width = width;
        this._height = height;

        this._setup();
    }

    get mesh() {
        return this._mesh;
    }

    update(time, deltaTime, fps) {
        console.log(time, deltaTime, fps);
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._mesh.scale.set(this._width * (this._width/POS_Z), this._height * (this._height/POS_Z), 1);
    }

    _setup() {
        this._setupPlane();
    }

    _setupPlane() {
        this._uniforms = {

        }

        let geometry = new THREE.PlaneGeometry(1, 1, 1);
        let material = new THREE.ShaderMaterial({
            uniforms: this._uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
        });

        this._mesh = new THREE.Mesh(geometry, material);
        this._mesh.position.set(0, 0, POS_Z);
        this._mesh.scale.set(this._width * (this._width/POS_Z), this._height * (this._height/POS_Z), 1);

        this._scene.add(this._mesh);
    }
}

export default ThreeBackgroundPlane;