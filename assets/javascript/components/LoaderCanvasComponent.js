import Emitter from '../events/Emitter';
import bindAll from '../utils/bindAll';

import Worker from '../workers/offscreenCanvas.worker.js';


class LoaderCanvasComponent {
    constructor(options) {
        this.el = options.el;

        this._bindAll();
        this._setup();
    }

    _setup() {
        if ('OffscreenCanvas' in window) {
            this._setupCanvas();
            this._resize();
            this._setupOffscreenCanvas();
            this._setupEventListeners();
        }
    }

    _setupCanvas() {
        this._canvas = this.el;
    }

    _resize(width, height, devicePixelRatio) {
        this._width = width || window.innerWidth;
        this._height = height || window.innerHeight;
        this._devicePixelRatio = devicePixelRatio || window.devicePixelRatio;

        if (this._worker) {
            this._worker.postMessage({
                type: 'resize',
                width: this._width,
                height: this._height,
                devicePixelRatio: this._devicePixelRatio,
            }, []);
        } else {
            this._canvas.width = this._width;
            this._canvas.height = this._height;
        }
    }

    _setupOffscreenCanvas() {
        this._offscreenCanvas = this.el.transferControlToOffscreen();
        this._worker = new Worker();
        this._worker.postMessage({
            type: 'setup',
            canvas: this._offscreenCanvas,
            width: window.innerWidth,
            height: window.innerHeight
        }, [this._offscreenCanvas]);
    }

    _update() {
        
    }

    _bindAll() {
        bindAll(
            this,
            '_resizeHandler'
        );
    }

    _setupEventListeners() {
        Emitter.on('RESIZE:END', this._resizeHandler);
    }

    _resizeHandler(e) {
        this._resize(e.viewportWidth, e.viewportHeight, e.devicePixelRatio);
    }

}

export default LoaderCanvasComponent;