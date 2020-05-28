import Emitter from 'events';

const emitter = new Emitter();
emitter.setMaxListeners(100);

export default emitter;