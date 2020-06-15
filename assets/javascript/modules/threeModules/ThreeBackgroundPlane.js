import fragment from '../../shaders/fragment.glsl';
import vertex from '../../shaders/vertex.glsl';
import Emitter from '../../events/Emitter';
import bindAll from '../../utils/bindAll';

import { TweenLite, TimelineLite, Power3, Power0 } from 'gsap';

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
        this._setupGradientTimeline();
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
            u_secondary_position: { value: 0.0 },
            u_third_color: { value: new THREE.Color(0x111737), type : 'c' },
            u_third_position: { value: 1.0 },
        }

        let geometry = new THREE.PlaneGeometry(1, 1, 1);
        let material = new THREE.ShaderMaterial({
            uniforms: this._uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
            fog: false
        });

        this._mesh = new THREE.Mesh(geometry, material);
        this._mesh.position.set(0, 0, POS_Z);
        this._mesh.scale.set(this._width * (this._width/POS_Z), this._height * (this._height/POS_Z), 1);

        this._scene.add(this._mesh);
    }

    _setupGradientTimeline() {
        this._timelineProgress = 0;
        this._timeline = new TimelineLite({ paused: true });
        this._timeline.to(this._uniforms.u_secondary_position, 1, { value: 0.0, ease: Power0.easeNone });
        this._timeline.set(this._uniforms.u_primary_color, { value: this._uniforms.u_secondary_color.value, ease: Power0.easeNone });
        this._timeline.set(this._uniforms.u_secondary_color, { value: this._uniforms.u_third_color.value, ease: Power0.easeNone });
        this._timeline.set(this._uniforms.u_primary_position, { value: 0.0 });
        this._timeline.set(this._uniforms.u_secondary_position, { value: 4.0 });
        this._timeline.to(this._uniforms.u_secondary_position, 2, { value: 0.0, ease: Power0.easeNone });
    }

    _bindAll() {
        bindAll(
            this,
            '_scrollHandler',
            '_startHandler'
        );
    }

    _setupEventListeners() {
        Emitter.on('START:EXPERIENCE', this._startHandler);
        Emitter.on('SCROLL', this._scrollHandler);
    }

    _startHandler() {
        TweenLite.to(this._uniforms.u_secondary_position, 1, { value: 0.5, ease: Power3.easeInOut });
    }

    _scrollHandler(e) {
        const delta = e.delta;

        this._timelineProgress += 0.0005 * -delta;

        if (this._timelineProgress.toFixed(2) < 0 || this._timelineProgress.toFixed(2) > 1) return;
        this._timeline.progress(this._timelineProgress.toFixed(2));
        // console.log(this._timelineProgress.toFixed(2));
    }
}

export default ThreeBackgroundPlane;