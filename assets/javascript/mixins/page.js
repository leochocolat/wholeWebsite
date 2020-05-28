import ScrollManager from '../managers/ScrollManager';
import { mapGetters } from 'vuex';

export default {
    mounted() {
        this._setup();
        this._setupSession();
        this._setupCurrentPage();
    },
    methods: {
        _setup() {
            ScrollManager.enable();
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