import Emitter from '../../events/Emitter';
import bindAll from '../../utils/bindAll';
import ScrollTriggerManager from '../../managers/ScrollTriggerManager';
import { TweenLite } from 'gsap';

class ThreeFog {
    constructor(scene) {
        this._scene = scene;

        this._color = new THREE.Color(0x393C60);
        this._density = 0.0050;

        this._bindAll();
        this._setup();
    }

    update() {
        
    }

    resize() {

    }

    _setup() {
        this._fog = new THREE.FogExp2(this._color, this._density);
        this._scene.fog = this._fog;
        

        this._setupEventListeners();
    }

    _transitionIn() {
        TweenLite.to(this._fog, 1, { density: 0.0020 });
        TweenLite.to(this._fog, 1, { density: 0.0028 });
    }

    _bindAll() {
        bindAll(this, '_transitionIn');
    }

    _setupEventListeners() {
        Emitter.on('MODEL:LOADED', this._transitionIn);
    }
}

export default ThreeFog;