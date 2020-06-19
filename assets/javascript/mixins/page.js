import ScrollManager from '../managers/ScrollManager';
import ScrollModule from '../modules/ScrollModule';
import { mapGetters } from 'vuex';
import Emitter from '../events/Emitter';

export default {
    mounted() {
        this._setup();
        this._setupSmoothScroll();
        this._setupSession();
        this._setupCurrentPage();
        this._setupEventListeners();
    },
    methods: {
        _setup() {
            // ScrollManager.enable();
        },
        _setupSmoothScroll() {
            this._scrollModule = new ScrollModule({
                container: this.$el,
                content: this.$el.querySelector('.js-scroll-content'),
                smooth: false,
                smoothValue: 0.1
            });            
        },
        _setupSession() {
            if (this.session) return;
            this.$store.dispatch('session/setSession', Date.now());
        },
        _setupCurrentPage() {
            this.$store.dispatch('page/setCurrent', this.namespace);
            document.querySelector('html').classList.add(`${this.namespace}`);
            document.body.classList.add(`${this.namespace}`);
        },
        _setupEventListeners() {
            Emitter.on('START:EXPERIENCE', this._startHandler);
        },
        _startHandler() {
            this._scrollModule.start();
            ScrollManager.enable();
        }
    },
    computed: {
        ...mapGetters({
          session: ['session/session'],
          currentPage: ['page/current'],
          previousPage: ['page/previous'],
        }),
    },
    beforeDestroy() {
        document.querySelector('html').classList.remove(`${this.namespace}`);
        document.body.classList.remove(`${this.namespace}`);
        ScrollManager.disable();

        if (this.scrollModule) {
            this.scrollModule.disable();
        }
    },
}