let canvas;

const handlers = {
    setup,
};

self.onmessage = function(e) {
    const fn = handlers[e.data.type];
    if (!fn) {
        throw new Error('no handler for type: ' + e.data.type);
    } else {
        fn(e.data);
    }
}

console.log('offscreen canvas worker');

function setup(e) {
    console.log(e);
}