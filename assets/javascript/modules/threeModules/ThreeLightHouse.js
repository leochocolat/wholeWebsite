import bindAll from "../../utils/bindAll";
import Emitter from "../../events/Emitter";

import ScrollManager from '../../managers/ScrollManager';

import GLTFLoader from '../../loaders/GLTFLoader';

class ThreeLightHouse {
    constructor(scene, width, height) {
        this._scene = scene;
        this._width = width;
        this._height = height;

        this._scrollPosittion = ScrollManager.getPosition();
        this._scrollDelta = 0;

        this._bindAll();
        this._setup();
    }
    
    get mesh() {
        return this._mesh;
    }

    update() {
        
    }

    resize(width, height) {
        this._width = width;
        this._height = height;
    }

    _setup() {
        this._loadModel();
        this._setupEventListeners();
    }

    _loadModel() {
        new GLTFLoader().load('/models/lighthouse.gltf', this._modelLoadedHandler);
    }

    _setupLightHouse() {
        this._mesh.scale.set(7.5, 7.5, 7.5);

        this._mesh.rotation.y = this._scrollPosittion.y * 0.002 + 15;

        this._mesh.position.x = this._scrollPosittion.y * 1.5 + this._width * 0.2;
        this._mesh.position.y = this._scrollPosittion.y - 200;
        this._mesh.position.z = this._scrollDelta * 0.05 + 200;

        this._scene.add(this._mesh);
    }

    _updateLighthousePosition() {
        this._mesh.rotation.y -= this._scrollDelta * 0.0025;

        this._mesh.position.x += this._scrollDelta * 1.5;
        this._mesh.position.y += this._scrollDelta * 0.5;
        this._mesh.position.z += this._scrollDelta * 0.3;
    }

    _bindAll() {
        bindAll(
            this,
            '_scrollHandler',
            '_modelLoadedHandler'
        );
    }

    _setupEventListeners() {
        Emitter.on('SCROLL', this._scrollHandler);
    }

    _scrollHandler(e) {
        this._scrollDelta = e.delta;

        this._updateLighthousePosition();
    }

    _modelLoadedHandler(e) {
        Emitter.emit('MODEL:LOADED', e.scene);
        this._mesh = e.scene;

        this._setupLightHouse();
    }
}

export default ThreeLightHouse;