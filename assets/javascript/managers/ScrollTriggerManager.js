import EventDispatcher from '../events/EventDispatcher';
import ScrollManager from './ScrollManager';
import Emitter from '../events/Emitter';
import DeviceUtils from '../utils/DeviceUtils';

import bindAll from '../utils/bindAll';
import lerp from '../utils/lerp';
import { TweenLite } from 'gsap';


/**
 * TODO:
 * * add Sticky option
 * * Find out how to improve perf by using workers (maybe getTransform)
 */

class ScrollTriggerManager extends EventDispatcher {
    constructor(options) {
        super(options);

        bindAll(
            this,
            '_scrollHandler',
            '_resizeEndHandler'
        );

        this.triggers = [];
        this.triggerSections = [];
    }
    
    /**
     * Public
     */
    setContainerElement(el) {
        this.el = el;
    }

    start() {
        this._setupTriggers();
        this._detectElements();
        this._setupEventListeners();
    }

    setContentHeight(height) {
        this._contentHeight = height;
        this._updateElements();

        this._detectElements();
    }

    removeEventListeners() {
        ScrollManager.removeEventListeners('scroll', this._scrollHandler);
        ScrollManager.removeEventListeners('scroll:end', this._scrollEndHandler);

        //TODO: Remove event listener of emitter
    }

    /**
    * Private
    */
    _setupTriggers() {
        const elements = this.el.querySelectorAll('[data-scroll]');
        const sections = this.el.querySelectorAll('[data-scroll-section]');

        console.log(sections);

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const className = section.dataset.scrollClass;
            let top = section.getBoundingClientRect().top + ScrollManager.getPosition().y;
            let bottom = top + section.offsetHeight; 
            
            const triggerSection = {
                el: section,
                class: className,
                top: top,
                bottom: bottom,
                inView: false
            }

            this.triggerSections.push(triggerSection);
        }

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const className = element.dataset.scrollClass;//not used for now
            let top = element.getBoundingClientRect().top + ScrollManager.getPosition().y;
            const offset = element.dataset.scrollOffset ? parseInt(element.dataset.scrollOffset) : 0;
            let bottom = top + element.offsetHeight;
            const repeat = element.dataset.scrollRepeat;
            const call = element.dataset.scrollCall;
            const speed = element.dataset.scrollSpeed ? parseFloat(element.dataset.scrollSpeed) : undefined;
            const delay = element.dataset.scrollDelay ? parseFloat(element.dataset.scrollDelay) : undefined;
            const direction = element.dataset.scrollDirection || 'vertical';
            const target = element.dataset.scrollTarget;
            const position = element.dataset.scrollPosition;

            let targetEl;
            if (target) {
                targetEl = document.querySelector(`${target}`);
                if (targetEl) {
                    top = targetEl.getBoundingClientRect().top + ScrollManager.getPosition().y;
                    bottom = top + element.offsetHeight;
                }
            } else {
                targetEl = element;
            }

            const trigger = {
                el: element,
                class: className,
                top: top + offset,
                bottom: bottom - offset,
                offset: offset,
                repeat: repeat,
                call: call,
                speed: speed,
                delay: delay,
                direction: direction,
                target: targetEl,
                position: position,
                inView: false
            }

            this.triggers.push(trigger);
        }
    }

    _detectElements() {
        const scrollTop = ScrollManager.getPosition().y;
        const scrollBottom = scrollTop + window.innerHeight;

        for (let i = 0; i < this.triggers.length; i++) {
            const element = this.triggers[i];

            if (!element.inView) {
                if ((scrollBottom >= element.top) && (scrollTop < element.bottom)) {
                    this._setInView(element);
                }
            }

            if (element.inView) {
                if ((scrollBottom < element.top) || (scrollTop > element.bottom)) {
                    this._setOutOfView(element);
                }
            }
            
            if (element.speed) {
                if (!DeviceUtils.isTouch()) {
                    this._transformElement(element);
                };
            }
        }

        for (let i = 0; i < this.triggerSections.length; i++) {
            const section = this.triggerSections[i];

            if (!section.inView) {
                if ((scrollBottom >= section.top) && (scrollTop < section.bottom)) {
                    this._setSectionInView(section);
                }
            }

            if (section.inView) {
                if ((scrollBottom < section.top) || (scrollTop > section.bottom)) {
                    this._setSectionOutOfView(section);
                }
            }
        }
    }

    _transformElement(element) {
        if (!element.inView) return;

        const scrollTop = ScrollManager.getPosition().y;
        const scrollMiddle = scrollTop + window.innerHeight/2;
        const scrollBottom = scrollTop + window.innerHeight;
        const middle = element.top + (element.bottom - element.top);

        let transformDistance;

        switch (element.position) {
            case 'top':
                transformDistance = scrollTop * - element.speed;
            break;

            case 'elementTop':
                transformDistance = (scrollBottom - element.top) * -element.speed;
            break;

            case 'bottom':
                transformDistance = (this._contentHeight - scrollBottom + this.windowHeight) * element.speed;
            break;

            default:
                transformDistance = (scrollMiddle - middle) * - element.speed;
            break;
        }


        if (element.delay) {
            let start = this._getTransform(element.el);
            const lerpY = lerp(start.y, transformDistance, element.delay);

            if (element.direction === 'horizontal') {
                TweenLite.set(element.el, { x: lerpY });
            } else {
                TweenLite.set(element.el, { y: lerpY });
            }
        } else {
            if (element.direction === 'horizontal') {
                TweenLite.set(element.el, { x: transformDistance });
            } else {
                TweenLite.set(element.el, { y: transformDistance });
            }
        }

    }

    _setInView(trigger) {
        trigger.inView = true;
        trigger.el.classList.add('isInView');

        if (trigger.call) {
            this._dispatchCallEvent(trigger, 'enter');

            if (trigger.repeat === undefined) {
                trigger.call = false;
            }
        }
    }

    _setOutOfView(trigger) {
        trigger.inView = false;

        if (trigger.call) {
            this._dispatchCallEvent(trigger, 'exit');
        }
        
        if (trigger.repeat) {
            trigger.el.classList.remove('isInView');
        }
    }

    _setSectionInView(section) {
        section.inView = true;
        // section.el.classList.add('isInView');
        section.el.style.visibility = 'auto';
    }
    
    _setSectionOutOfView(section) {
        section.inView = false;
        // section.el.classList.remove('isInView');
        section.el.style.visibility = 'hidden';
    }

    _dispatchCallEvent(trigger, state) {
        const payload = {
            name: trigger.call,
            el: trigger.el,
            state: state
        }

        this.dispatchEvent('call', payload);
    }

    _updateElements() {
        for (let i = 0; i < this.triggers.length; i++) {
            const trigger = this.triggers[i];
            const top = trigger.target.getBoundingClientRect().top + ScrollManager.getPosition().y + trigger.offset;
            const bottom = top + trigger.target.offsetHeight - trigger.offset;

            trigger.top = top;
            trigger.bottom = bottom;
        }
    }

    _getTransform(el) {
        const translate = {};
        if(!window.getComputedStyle) return;
    
        const style = getComputedStyle(el);
        const transform = style.transform || style.webkitTransform || style.mozTransform;
    
        let mat = transform.match(/^matrix3d\((.+)\)$/);
        if(mat) return parseFloat(mat[1].split(', ')[13]);
    
        mat = transform.match(/^matrix\((.+)\)$/);
        translate.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
        translate.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0;
    
        return translate;
    }

    _setupEventListeners() {
        ScrollManager.addEventListener('scroll', this._scrollHandler);
        ScrollManager.addEventListener('scroll:end', this._scrollEndHandler);

        Emitter.on('RESIZE:END', this._resizeEndHandler);
    }

    _scrollHandler() {
        this._detectElements();
    }

    _scrollEndHandler() {
        //nothing
    }

    _resizeEndHandler() {
        this._updateElements();
    }
}

export default new ScrollTriggerManager();