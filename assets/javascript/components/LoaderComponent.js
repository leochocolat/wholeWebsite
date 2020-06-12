import Emitter from '../events/Emitter';
import bindAll from '../utils/bindAll';
import { TweenLite } from 'gsap';

import LoaderCanvasComponent from './LoaderCanvasComponent';

class LoaderComponent {
    constructor(options) {
        this.el = options.el;

        this.ui = {
            canvas: this.el.querySelector('.js-offscreen-canvas'),
            progressValue: this.el.querySelector('.js-progress-value'),
        }

        this.components = {
            loaderCanvasComponent: new LoaderCanvasComponent({ el: this.ui.canvas })
        }

        this._loader = { value: 0 };

        this._bindAll();
        this._setup();
    }

    _setup() {
        this._setupEventListeners();
        this._startProgress();
    }
    
    _startProgress() {
        TweenLite.to(this._loader, 2, { value: 90,
            onUpdate: () => {
                this.ui.progressValue.innerHTML = parseInt(this._loader.value);
            },
            onComplete: () => {
                this._startAnimationCompleted = true;
                this._finishLoading();
            } });
    }

    _finishLoading() {
        if (!this._startAnimationCompleted || !this._loadedCompleted) return;

        TweenLite.to(this._loader, 2, { value: 100,
            onUpdate: () => {
                this.ui.progressValue.innerHTML = parseInt(this._loader.value);
            },
            onComplete: this._finishAnimationComplete
        })
    }

    _transitionOut() {

    }

    _bindAll() {
        bindAll(
            this,
            '_loadingStartingHandler',
            '_loadingCompleteHandler',
            '_finishAnimationComplete'
        );
    }

    _setupEventListeners() {
        Emitter.on('MODEL:LOADED', this._loadingCompleteHandler);
    }

    _loadingStartingHandler() {
        this._startProgress();
    }

    _loadingCompleteHandler() {
        this._loadedCompleted = true;
        this._finishLoading();
    }

    _finishAnimationComplete() {
        this._transitionOut();
    }
}

export default LoaderComponent;