import ThreeScene from '../modules/threeModules/ThreeScene';
import Emitter from '../events/Emitter';

let canvas;
let width, height, devicePixelRatio;
let threeScene;

const handlers = {
    'setup': setup,
    'resize': resizeHandler,
    'scroll': scrollHandler,
    'close': close,
    'start': startExperience,
};

if (typeof self === 'object') {
    self.onmessage = function(e) {
        const name = e.data.name;
        const fn = handlers[name];
        
        if (!fn) {
            throw new Error('no handler for type: ' + e.data.type);
        } else {
            fn(e.data);
        }
    }
}

function setup(e) {
    setupCanvas(e);
    setupThreeScene(e);

    update();
}

function close() {
    cancelAnimationFrame(update);
}

function setupCanvas(e) {
    width = e.width;
    height = e.height;
    devicePixelRatio = e.devicePixelRatio;

    canvas = e.canvas;
    canvas.width = width;
    canvas.height = height;
}

function setupThreeScene() {
    threeScene = new ThreeScene(canvas, width, height, devicePixelRatio);
}

function startExperience(e) {
    Emitter.emit('START:EXPERIENCE', e.event);
}

function update() {
    threeScene.update();

    requestAnimationFrame(update);
}

//handlers
function resizeHandler(e) {
    width = e.width;
    height = e.height;
    devicePixelRatio = e.devicePixelRatio;

    canvas.width = width;
    canvas.height = height;
    
    threeScene.resize(width, height, devicePixelRatio);
}

function scrollHandler(e) {
    Emitter.emit('SCROLL', e.event);
}