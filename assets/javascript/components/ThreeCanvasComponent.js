import { gsap } from 'gsap';
import Emitter from '../events/Emitter';
import bindAll from '../utils/bindAll';

import Worker from '../workers/UIScene.worker.js';

import ThreeScene from '../modules/threeModules/ThreeScene';

class ThreeCanvasComponent {
    constructor(options) {
        this.el = options.el;
        this.ui = {};

        this._bindAll();
        this._setup();
    }

    close() {
        this._removeEventListeners();
     
        if (this._isOffscreen) {
            this._worker.postMessage({
                name: 'close',
            }, []);
        } else {
            
        }
    }

    _setup() {
        this._setupDeltaTime();

        this._setupThreeScene();
        this._resize();

        this._setupEventListeners();
    }

    _resize(width, height, devicePixelRatio) {
        this._width = width || window.innerWidth;
        this._height = height || window.innerHeight;
        this._devicePixelRatio = devicePixelRatio || window.devicePixelRatio;

        if (this._isOffscreen) {
            this._worker.postMessage({
                name: 'resize',
                width: this._width,
                height: this._height,
                devicePixelRatio: this._devicePixelRatio
            }, []);
        } else {
            this.el.width = this._width;
            this.el.height = this._height;
        }
    }

    _setupDeltaTime() {
        this._time = 0;
        this._startTime = Date.now();
        this._dateNow = this._startTime;
        this._lastTime = this._dateNow;
        this._deltaTime = 16;
        this._fps = Math.round(1000 / this._deltaTime);
    }

    _setupThreeScene() {
        if ('OffscreenCanvas' in window) {
            this._isOffscreen = true;
            this._setupOffscreenCanvasScene();
        } else {
            this._setupCanvasScene();
        }
    }

    _setupOffscreenCanvasScene() {
        this._offscreenCanvas = this.el.transferControlToOffscreen();
        this._worker = new Worker();
        
        this._worker.postMessage({
            name: 'setup',
            canvas: this._offscreenCanvas,
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
        }, [this._offscreenCanvas]);
    }

    _setupCanvasScene() {
        this._threeScene = new ThreeScene(this.el, window.innerWidth, window.innerHeight, window.devicePixelRatio);
        //todo
    }

    _update() {
        if (this._isOffscreen) return;

        this._threeScene.update();
    }

    _sendWoker(object) {
        return JSON.parse(JSON.stringify(object));
    };

    _bindAll() {
        bindAll(
            this,
            '_tickHandler',
            '_scrollHandler',
            '_resizeHandler'
        );
    }

    _setupEventListeners() {
        gsap.ticker.add(this._tickHandler);

        Emitter.on('SCROLL', this._scrollHandler);
        Emitter.on('RESIZE:END', this._resizeHandler);
    }

    _removeEventListeners() {
        gsap.ticker.remove(this._tickHandler);

        Emitter.removeListener('SCROLL', this._scrollHandler);
        Emitter.removeListener('RESIZE:END', this._resizeHandler);
    }

    _tickHandler() {
        this._update();
    }

    _scrollHandler(e) {
        if (this._isOffscreen) {
            this._worker.postMessage({
                name: 'scroll',
                event: this._sendWoker(e)
            }, []);
        } else {

        }
    }

    _resizeHandler(e) {
        this._resize(e.viewportWidth, e.viewportHeight, e.devicePixelRatio);
    }
}

export default ThreeCanvasComponent;