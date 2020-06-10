import bindAll from '../utils/bindAll';
import DeviceUtils from '../utils/DeviceUtils';

import Emitter from '../events/Emitter';
import ScrollManager from '../managers/ScrollManager';
import ScrollTriggerManager from '../managers/ScrollTriggerManager';

import { TweenLite, gsap } from 'gsap';

class ScrollModule {
    constructor(options) {
        bindAll(
            this,
            '_scrollHandler',
            '_readyStateChangeHandler',
            '_resizeHandler',
            '_resizeEndHandler',
            '_callHandler',
            '_tickHandler'
        );

        this.container = options.container;
        this.content = options.content;
        this.smooth = options.smooth;
        this.smoothValue = options.smoothValue;

        this._scroll = {};
        this._previousScroll = {};
        this._offsetY = 0;

        this.ui = {
            scrollTo: document.querySelectorAll('[data-scroll-to]')
        }

        setInterval(() => {
            this._allowContentHeightCheck = true;
        }, 2000);

        this._setup();
    }

    /**
    * Public
    */
    start() {
        ScrollTriggerManager.start({ el: this.container });
    }

    enable() {
        this._setupEventListeners();
        this._setStyleProps();
    }

    disable() {
        this._removeEventListeners();
        this._removeStyleProps();
    }

    scrollTo(value) {
        ScrollManager.scrollTo(value);
    }

    /**
    * Private
    */
    _setup() {
        ScrollManager.start();

        if (this.smooth) {
            ScrollManager.enableSmoothScroll();
            ScrollManager.setSmoothValue(this.smoothValue);
        }
        
        this._setupEventListeners();
        this._setupScrollTo();
        this._setStyleProps();
        this._resize();
        ScrollTriggerManager.setContainerElement(this.container)
    }

    _setupScrollTo() {
        for (let i = 0; i < this.ui.scrollTo.length; i++) {
            this.ui.scrollTo[i].addEventListener('click', () => {
                const target = this.ui.scrollTo[i].dataset.scrollTo;
                const offset = this.ui.scrollTo[i].dataset.scrollToOffset;
                ScrollManager.scrollTo(target, offset);
            });
        }
    }

    _setStyleProps() {
        if (DeviceUtils.isTouch()) return;

        document.querySelector('html').classList.add('hasSmoothScroll');
        
        this.content.style.willChange = 'transform';
        this.content.style.position = 'fixed';
    }

    _removeStyleProps() {
        //TODO
    }

    _resize() {
        this._contentHeight = this.content.clientHeight;
        this.container.style.height =  `${this._contentHeight}px`;
        ScrollTriggerManager.setContentHeight(this._contentHeight);

        this._setOffset();
    }

    _setOffset() {
        if (DeviceUtils.isTouch()) return;

        const position = ScrollManager.getPosition();
        const y = this._offsetY + - position.y;

        TweenLite.set(this.content, { y: y });
    }

    _checkContentHeight() {
        const contentHeight = this.content.clientHeight;

        if (this._contentHeight != contentHeight) {
            this._resize();
        };
    }

    update() {
        if (this._allowContentHeightCheck) {
            this._allowContentHeightCheck = false;
            this._checkContentHeight();
        }
    }

    _setupEventListeners() {
        ScrollManager.addEventListener('scroll', this._scrollHandler);
        ScrollManager.addEventListener('scroll:end', this._scrollEndHandler);

        ScrollTriggerManager.addEventListener('call', this._callHandler);

        document.addEventListener('readystatechange', this._readyStateChangeHandler);
        Emitter.on('RESIZE', this._resizeHandler);
        Emitter.on('RESIZE:END', this._resizeEndHandler);

        gsap.ticker.add(this._tickHandler);
    }

    _removeEventListeners() {
        ScrollManager.removeEventListener('scroll', this._scrollHandler);
        ScrollManager.removeEventListener('scroll:end', this._scrollEndHandler);

        ScrollTriggerManager.removeEventListener('call', this._callHandler);
        ScrollTriggerManager.removeEventListeners();

        document.removeEventListener('readystatechange', this._readyStateChangeHandler);
        gsap.ticker.remove(this._tickHandler);
    }

    _scrollHandler(e) {
        this._setOffset();
    }

    _scrollEndHandler(e) {
        this._setOffset();
        Emitter.emit('SCROLL:END', e);
    }

    _callHandler(e) {
        
    }

    _readyStateChangeHandler() {
        this._resize();
    }

    _resizeHandler() {
        //nothing
    }

    _resizeEndHandler() {
        this._resize();
    }

    _tickHandler() {
        this.update();
    }
}

export default ScrollModule;