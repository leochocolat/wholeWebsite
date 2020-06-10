import Emitter from '../../events/Emitter';

class ThreeFog {
    constructor(scene) {
        this._scene = scene;

        this._color = new THREE.Color(0x393C60);
        this._density = 0.0030;
        // this._density = 0.0020;

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

    _setupEventListeners() {

    }
}

export default ThreeFog;