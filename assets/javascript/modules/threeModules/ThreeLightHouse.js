import bindAll from "../../utils/bindAll";
import Emitter from "../../events/Emitter";

import ScrollManager from '../../managers/ScrollManager';

class ThreeLightHouse {
    constructor(scene, width, height) {
        this._scene = scene;
        this._width = width;
        this._height = height;

        this._scrollPosittion = ScrollManager.getPosition();
        this._scrollDelta = 0;
        console.log(this._scrollPosittion);

        this._bindAll();
        this._setup();
    }
    
    get mesh() {
        return this._mesh;
    }

    update() {
        
    }

    reszie(width, height) {
        this._width = width;
        this._height = height;
    }

    _setup() {
        this._setupLightHouse();
        this._setupEventListeners();
    }

    _setupLightHouse() {
        let geometry = new THREE.BoxGeometry(1, 2, 1);
        let material = new THREE.MeshNormalMaterial();
        this._mesh = new THREE.Mesh(geometry, material);

        this._mesh.position.x = this._width/2;
        this._mesh.position.y = this._height/2;

        this._mesh.scale.set(this._width * 0.15, this._width * 0.15, this._width * 0.15);

        this._scene.add(this._mesh);
    }

    _setLighthousePosition() {
        this._mesh.rotation.y += this._scrollPosittion.y * 0.002;

        this._mesh.position.x += this._scrollPosittion.y * 1.5;
        this._mesh.position.y += this._scrollPosittion.y;
    }

    _updateLighthousePosition() {
        this._mesh.rotation.y += this._scrollDelta * 0.002;

        this._mesh.position.x += this._scrollDelta * 1.5;
        this._mesh.position.y += this._scrollDelta;
    }

    _bindAll() {
        bindAll(
            this,
            '_scrollHandler'
        );
    }

    _setupEventListeners() {
        Emitter.on('SCROLL', this._scrollHandler);
    }

    _scrollHandler(e) {
        this._scrollDelta = e.delta;

        this._updateLighthousePosition();
    }
}

export default ThreeLightHouse;