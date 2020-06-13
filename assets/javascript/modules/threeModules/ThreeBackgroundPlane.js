import fragment from '../../shaders/fragment.glsl';
import vertex from '../../shaders/vertex.glsl';
import Emitter from '../../events/Emitter';
import bindAll from '../../utils/bindAll';

const POS_Z = -200;

class ThreeBackgroundPlane {
    constructor(scene, width, height) {
        this._scene = scene;
        this._width = width;
        this._height = height;

        this._bindAll();
        this._setup();
    }

    get mesh() {
        return this._mesh;
    }

    update(time, deltaTime, fps) {
        this._uniforms.u_time.value = time;
        this._uniforms.u_delta_time.value = deltaTime;
        this._uniforms.u_fps.value = fps;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._mesh.scale.set(this._width * (this._width/POS_Z), this._height * (this._height/POS_Z), 1);
        this._uniforms.u_resolution.value.set(this._width, this._height, 1);
    }

    _setup() {
        this._setupPlane();
        this._setupEventListeners();
    }

    _setupPlane() {
        this._uniforms = {
            u_resolution: { value: new THREE.Vector3(this._width, this._height, 0) },
            u_time: { value: 0 },
            u_delta_time: { value: 17 },
            u_fps: { value: 60 },
            //colors
            u_primary_color: { value: new THREE.Color(0xD493B8), type : 'c' },
            u_primary_position: { value: 0.0 },
            u_secondary_color: { value: new THREE.Color(0x393C60), type : 'c' },
            u_secondary_position: { value: 0.7 },
            u_third_color: { value: new THREE.Color(0x0015FF), type : 'c' },
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

    _bindAll() {
        bindAll(
            this,
            '_scrollHandler'
        );
    }

    _setupEventListeners() {
        Emitter.on('EXPERIENCE:START', this._startHandler);
        Emitter.on('SCROLL', this._scrollHandler);
    }

    _startHandler() {
        
    }

    _scrollHandler(e) {
        const delta = e.delta;

        // console.log(this._uniforms.u_secondary_position.value);
        // this._uniforms.u_secondary_position.value += 0.001 * -delta;
    }
}

export default ThreeBackgroundPlane;