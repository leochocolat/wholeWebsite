import EventDispatcher from '../events/EventDispatcher';

import bindAll from '../utils/bindAll';
import DeviceUtils from '../utils/DeviceUtils';

import VirtualScroll from 'virtual-scroll';

class SnapScrollManager extends EventDispatcher {
    constructor(options = {}) {
        super(options);

        bindAll(
            this,
            '_virtualScrollHandler',
            '_virtualScrollEndHandler',
        );

        this._allowSnap = true;
        this._allowWheel = true;

        this._setup();
    }

    removeEventListener() {
        this._virtualScroll.off(this._virtualScrollHandler);
    }

    _setup() {
        this._setupVirtualScroll();
        this._setupEventListeners();
    }

    _setupVirtualScroll() {
        const options = {
            limitInertia: true
        };
        this._virtualScroll = new VirtualScroll(options)
    }

    _setupEventListeners() {
        this._virtualScroll.on(this._virtualScrollHandler);
    }

    _virtualScrollHandler(e) {
        this._wheelDirection = e.deltaY <= 0 ? 'down' : 'up';
        e.direction = this._wheelDirection;

        if (Math.abs(e.deltaY) > 4) {
            clearTimeout(this._wheelTimeout);
            this._wheelTimeout = setTimeout(() => {
                this._virtualScrollEndHandler(e);
            }, 100);

            if (!this._allowSnap) return;
            this._allowSnap = false;

            this.dispatchEvent('wheel:snap', e);
            //TODO: Try to cancel scroll event when snap is called
        }
    }

    _virtualScrollEndHandler(e) {
        this._allowSnap = true;
        this.dispatchEvent('wheel:snap:end', e);
    }
}

export default new SnapScrollManager();