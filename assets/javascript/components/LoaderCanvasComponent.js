import Emitter from '../events/Emitter';
import bindAll from '../utils/bindAll';

import Worker from '../workers/offscreenCanvas.worker.js';

class LoaderCanvasComponent {
    constructor(options) {
        this.el = options.el;

        this._bindAll();
        this._setup();
    }

    transitionOut() {
        if (this._worker) {
            this._worker.postMessage({ type: 'transitionOut' }, []);
        }
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

    // _loadTexture() {
    //     let url = 'https://res.cloudinary.com/dgxpb4jhs/image/upload/v1592322434/sample-01_plvqsx.png';
    //     const loader = new THREE.TextureLoader();
    //     loader.load(url, response => {
    //         this._texture = response;
    //         this._setupImageData();
    //     });
    // }

    _setupImageData(e) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const data = e.data;

        this._texture = data.texture;

        const image = this._texture.image;

        this._texture.minFilter = THREE.LinearFilter;
        this._texture.magFilter = THREE.LinearFilter;
        this._texture.format = THREE.RGBFormat;

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.scale(1, -1);// flip y
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height * -1);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // // const texture = JSON.parse(JSON.stringify(this._texture));

        this._worker.postMessage({
            type: 'imageDataReady',
            // texture: texture,
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
            '_resizeHandler',
            '_setupImageData',
            '_mousemoveHandler'
        );
    }

    _setupEventListeners() {
        Emitter.on('RESIZE:END', this._resizeHandler);
        this._worker.addEventListener('message', this._setupImageData.bind(this));
        window.addEventListener('mousemove', this._mousemoveHandler);
    }

    _resizeHandler(e) {
        this._resize(e.viewportWidth, e.viewportHeight, e.devicePixelRatio);
    }

    _sendWoker(object) {
        return JSON.parse(JSON.stringify(object));
    };

    _mousemoveHandler(e) {
        this._worker.postMessage({
            type: 'mousemove',
            mousePosition: { x: e.clientX, y: e.clientY },
        }, []);
    }

}

export default LoaderCanvasComponent;