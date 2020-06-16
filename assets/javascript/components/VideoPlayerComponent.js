import Emitter from '../events/Emitter';
import bindAll from '../utils/bindAll';
import { gsap, TweenLite } from 'gsap';

class VideoPlayerComponent {
    constructor(options) {
        this.el = options.el;

        this.ui = {
            video: this.el.querySelector('.js-video'),
            progressBar: this.el.querySelector('.js-progress-bar'),
            progress: this.el.querySelector('.js-progress'),
            button: this.el.querySelector('.js-play-button')
            // poster: this.el.querySelector('.js-poster')
        }

        this._bindAll();
        this._setup();
    }

    close() {
        this._removeEventListeners();
    }

    play() {
        this._isPlaying = true;
        this.ui.video.play();

        this.ui.button.classList.remove('is-active');
    }
    
    pause() {
        this._isPlaying = false;
        this.ui.video.pause();

        this.ui.button.classList.add('is-active');
    }

    enableControls() {
        this._getContainerPosition();
    }

    _setup() {
        this._setupEventListeners();
    }

    _getContainerPosition() {
        const { x, width } = this.el.getBoundingClientRect();

        this._offsetLeft = x;
        this._width = width;
    }

    _updateProgess() {
        this._progress = (this.ui.video.currentTime/this._duration).toFixed(3);
        TweenLite.set(this.ui.progress, { scaleX: this._progress });
    }

    _bindAll() {
        bindAll(
            this,
            '_canplayHandler',
            '_endedHandler',
            '_playingHandler',
            '_tickHandler',
            '_clickProgressHandler',
            '_clickHandler',
            '_resizeHandler',
            '_clickPlayHandler'
        );
    }

    _setupEventListeners() {
        if (this.ui.video.readyState === 4) {
            this._canplayHandler();
        } else {
            this.ui.video.addEventListener('canplaythrough', this._canplayHandler);
        }

        this.ui.video.addEventListener('ended', this._endedHandler);
        this.ui.video.addEventListener('playing', this._playingHandler);
        this.ui.button.addEventListener('click', this._clickPlayHandler);
        this.ui.progressBar.addEventListener('click', this._clickProgressHandler);
        this.ui.video.addEventListener('click', this._clickHandler);
        Emitter.on('RESIZE:END', this._resizeHandler);

        gsap.ticker.add(this._tickHandler);
    }

    _removeEventListeners() {
        this.ui.video.removeEventListener('canplaythrough', this._canplayHandler);
        this.ui.video.removeEventListener('ended', this._endedHandler);
        this.ui.video.removeEventListener('playing', this._playingHandler);
        this.ui.progressBar.removeEventListener('click', this._clickProgressHandler);
        this.el.removeEventListener('click', this._clickHandler);
        Emitter.removeListener('RESIZE:END', this._resizeHandler);

        gsap.ticker.remove(this._tickHandler);
    }

    _clickPlayHandler(e) {
        if (!this._isReady) return;
        if (this._isPlaying) return;

        this.play();
    }

    _canplayHandler() {
        this._isReady = true;

        this.enableControls();

        // if (this.ui.poster.classList.contains('is-video-ready')) return;
        // this.ui.poster.classList.add('is-video-ready');

    }

    _endedHandler() {
        this._isPlaying = false;

        e.currentTarget.classList.add('is-active');
    }

    _playingHandler() {
        // if (!this.ui.poster.classList.contains('is-video-ready')) {
        //     this._isReady = true;
        //     this.ui.poster.classList.add('is-video-ready');
        // }
        
        this._duration = this.ui.video.duration;
        this._isPlaying = true;
    }

    _tickHandler() {
        if (!this._duration) return;
        if (!this._isPlaying) return;

        this._updateProgess();
    }

    _clickProgressHandler(e) {
        if (!this._isReady) return;

        const posX = e.clientX;
        const targetProgress = ((posX - this._offsetLeft) / this._width) * this._duration;
        
        if (!targetProgress) return;
        this.ui.video.currentTime = targetProgress;
        this._updateProgess();
    }

    _clickHandler() {
        if (this._isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    _resizeHandler() {
        this._getContainerPosition();
    }
}

export default VideoPlayerComponent;