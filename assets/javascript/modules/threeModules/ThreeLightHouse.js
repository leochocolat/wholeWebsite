import bindAll from "../../utils/bindAll";
import Emitter from "../../events/Emitter";

import ScrollManager from '../../managers/ScrollManager';

import GLTFLoader from '../../loaders/GLTFLoader';

import { TweenLite, Power3 } from 'gsap';

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
        Emitter.emit('MODEL:STARTLOADING', {});
        
        new GLTFLoader().load('/models/lighthouse-light.gltf', this._modelLoadedHandler);
    }

    _setupLightHouse() {
        this._mesh.scale.set(7.5, 7.5, 7.5);

        this._mesh.rotation.y = this._scrollPosittion.y * 0.002 + 12;

        // this._mesh.position.x = this._scrollPosittion.y * 1.5 + this._width * 0.2;
        this._mesh.position.x = this._scrollPosittion.y * 1.5 + this._width;
        this._mesh.position.y = this._scrollPosittion.y - 200;
        this._mesh.position.z = this._scrollDelta * 0.05 + 200;

        this._mesh.traverse(child => {
            if (child.name === 'physical_light') {
                child.material.emissive = new THREE.Color(0xffff00);
                child.visible = false;
                child.material.emissiveIntensity = 100;

                this._mesh.updateMatrixWorld();

                let vector = new THREE.Vector3();
                let position = child.getWorldPosition(vector); 
            }
        });

        this._scene.add(this._mesh);
    }

    _updateLighthousePosition() {
        this._mesh.rotation.y -= this._scrollDelta * 0.0025;
        this._mesh.rotation.z = this._scrollDelta * 0.0025;

        this._mesh.position.x += this._scrollDelta * 1.5;
        this._mesh.position.y += this._scrollDelta * 0.5;
        this._mesh.position.z += this._scrollDelta * 0.3;
    }

    _bindAll() {
        bindAll(
            this,
            '_scrollHandler',
            '_modelLoadedHandler',
            '_startHandler'
        );
    }

    _setupEventListeners() {
        Emitter.on('SCROLL', this._scrollHandler);
        Emitter.on('START:EXPERIENCE', this._startHandler);
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

    _startHandler() {
        TweenLite.to(this._mesh.position, 2, { x: this._scrollPosittion.y * 1.5 + this._width * 0.2, ease: Power3.easeOut });
        TweenLite.to(this._mesh.rotation, 2, { y: this._scrollPosittion.y * 0.002 + 15, ease: Power3.easeOut });
    }
}

export default ThreeLightHouse;