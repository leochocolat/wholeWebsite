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
            this._loadTexture();
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

    _loadTexture() {
        let url = 'https://images.unsplash.com/photo-1591974250916-19041d07f4a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60';
        const loader = new THREE.TextureLoader();
        loader.load(url, response => {
            this._texture = response;
            this._setupImageData();
        });
    }

    _setupImageData() {       
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const image = this._texture.image;

        canvas.width = image.width;
        canvas.height = image.height;

	    ctx.scale(1, -1);// flip y
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height * -1);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const texture = JSON.parse(JSON.stringify(this._texture));

        this._worker.postMessage({
            type: 'textureLoaded',
            texture: texture,
            imageData: imageData,
            size: {
                width: image.width,
                height: image.height
            } 
        }, []);
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