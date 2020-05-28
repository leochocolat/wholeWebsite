import { TimelineLite, Power4 } from 'gsap';
import Emitter from '../events/Emitter';

function transitionOutHome(el, done) {
    Emitter.emit('TRANSITION:OUT', { pageName: 'home', el: el });

    const content = el.querySelector('.main__content');
    const overlay = el.querySelector('.js-transition-overlay');
    
    const tl = new TimelineLite({ onComplete: done });
    tl.to(content, 1.1, { y: -300, ease: Power4.easeInOut }, 0);
    tl.to(overlay, 1, { y: 0, ease: Power4.easeInOut }, 0);
}

function transitionOutProject(el, done) {
    Emitter.emit('TRANSITION:OUT', { pageName: 'project', el: el });

    const content = el.querySelector('.main__content');
    const overlay = el.querySelector('.js-transition-overlay');
    
    const tl = new TimelineLite({ onComplete: done });
    tl.to(content, 1.1, { y: 300, ease: Power4.easeInOut }, 0);
    tl.to(overlay, 1, { y: 0, ease: Power4.easeInOut }, 0);
}

function transitionInHome(el, done) {
    Emitter.emit('TRANSITION:IN', { pageName: 'home', el: el });
}

function transitionInProject(el, done) {
    Emitter.emit('TRANSITION:IN', { pageName: 'project', el: el });
}

function beforeLeaveState(el, done) {
    if (document.querySelector('html').classList.contains('isLoading')) return;
    document.querySelector('html').classList.add('isLoading');
}

function afterLeaveState(el, done) {
    document.querySelector('html').classList.remove('isLoading');
}

export {
    transitionOutHome,
    transitionOutProject,
    transitionInHome,
    transitionInProject,
    beforeLeaveState,
    afterLeaveState
};