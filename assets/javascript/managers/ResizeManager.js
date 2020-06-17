import EventDispatcher from '../events/EventDispatcher';
import DeviceUtils from '../utils/DeviceUtils';

import bindAll from '../utils/bindAll';

const THROTTLE_VALUE = 50;
const MIN_HEIGHT_RESIZE = 1;

class ResizeManager extends EventDispatcher {
    constructor() {
        super();

        bindAll(
            this,
            '_resizeHandler'
        );

        this._setup();
    }   

    _setup() {
        this._getViewportSize();
        this._getDocumentSize();
        this._resizeCssViewportVariable();
        this._setupEventListeners();
    }

    _getViewportSize() {
        const newHeight = Math.min(window.innerHeight || 0);
        const delta = Math.abs(newHeight - this._viewportHeight);
        
        this._viewportWidth = Math.min(window.innerWidth || 0);
        this._viewportHeight = Math.min(window.innerHeight || 0);
    
        this._devicePixelRatio = window.devicePixelRatio;

        if (delta > MIN_HEIGHT_RESIZE) { this._resizeCssViewportVariable() };
    }

    _getDocumentSize() {
        const body = document.body;
        const html = document.documentElement;

        this._documentWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
        this._documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    }

    _resizeCssViewportVariable() {
        document.documentElement.style.setProperty('--vh', `${this._viewportHeight * 0.01}px`);
    }

    _setupEventListeners() {
        // const resizeEvent = (DeviceUtils.isTablet() || DeviceUtils.isMobile()) ? 'orientationchange' : 'resize';
        const resizeEvent = 'resize';
        window.addEventListener(resizeEvent, this._resizeHandler);
    }

    _resizeHandler() {
        this._getViewportSize();
        this._getDocumentSize();

        console.log('resize');

        this.dispatchEvent('resize', {
            viewportWidth: this._viewportWidth,
            viewportHeight: this._viewportHeight,
            documentWidth: this._documentWidth,
            documentHeight: this._documentHeight,
            devicePixelRatio: this._devicePixelRatio,
        });

        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this._resizeEndHandler();
        }, THROTTLE_VALUE)
    }

    _resizeEndHandler() {
        this._getViewportSize();
        this._getDocumentSize();

        this.dispatchEvent('resize:end', {
            viewportWidth: this._viewportWidth,
            viewportHeight: this._viewportHeight,
            documentWidth: this._documentWidth,
            documentHeight: this._documentHeight,
            devicePixelRatio: this._devicePixelRatio,
        });
    }
}

export default new ResizeManager();