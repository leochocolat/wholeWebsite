import ScrollManager from '../managers/ScrollManager';
import ScrollModule from '../modules/ScrollModule';
import { mapGetters } from 'vuex';

export default {
    mounted() {
        this._setup();
        this._setupSmoothScroll();
        this._setupSession();
        this._setupCurrentPage();
    },
    methods: {
        _setup() {
            ScrollManager.enable();
        },
        _setupSmoothScroll() {
            this._scrollModule = new ScrollModule({
                container: this.$el,
                content: this.$el.querySelector('.js-scroll-content'),
                smooth: true,
                smoothValue: 0.1
            });

            this._scrollModule.start();
        },
        _setupSession() {
            if (this.session) return;
            this.$store.dispatch('session/setSession', Date.now());
        },
        _setupCurrentPage() {
            this.$store.dispatch('page/setCurrent', this.namespace);
            document.querySelector('html').classList.add(`${this.namespace}`);
            document.body.classList.add(`${this.namespace}`);
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