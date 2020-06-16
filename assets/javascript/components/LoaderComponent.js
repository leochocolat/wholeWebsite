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

    _setupSplitText() {
        this._splitedLoadingLabel = new SplitText(this.ui.loadingLabel, {
            type: 'chars',
            linesClass: 'char char--++',
        });

        this._splitedStartLabel = new SplitText(this.ui.startLabel, {
            type: 'chars',
            linesClass: 'char letter--++',
        });
    }

    _setupCircleAnimation() {
        this._timeline = new TimelineLite({ paused: true });

        this._timeline.fromTo(this.ui.circle, 1, { strokeDashoffset: 220 }, { strokeDashoffset: 0, ease: Power0.easeNone });
    }

    _startProgress() {
        let timeline = new TimelineLite({
            onComplete: () => {
                this._startAnimationCompleted = true;
                // this._finishLoading();
            }
        });

        timeline.to(this.ui.circlePlaceHolder, 0.5, { autoAlpha: 0.5, ease: Power3.easeInOut }, 0);
        timeline.staggerTo(this._splitedLoadingLabel.chars, 1.5, { y: '-100%', ease: Power3.easeOut }, 0.05, 0);

        timeline.to(this._loader, 1.2, {
            value: 0.7, ease: Power4.easeOut,
            onUpdate: () => {
                this.ui.progressValue.innerHTML = parseInt(this._loader.value);
            },
            onComplete: () => {
                this._startAnimationCompleted = true;
                this._finishLoading();
            }
        });
    }

    _finishLoading() {
        if (!this._startAnimationCompleted || !this._loadedCompleted) return;

        let timeline = new TimelineLite({ onComplete: this._finishAnimationComplete });

        timeline.to(this._loader, 2, {
            value: 1,
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