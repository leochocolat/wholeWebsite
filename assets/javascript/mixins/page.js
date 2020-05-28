import ScrollManager from '../managers/ScrollManager';
import { mapGetters } from 'vuex';

export default {
    mounted() {
        this.setup();
        this.setupSession();
        this.setupCurrentPage();
    },
    methods: {
        setupSession() {
            if (!this.session) {
                if (this.startLoading) {
                    this.startLoading();
                }
                this.$store.dispatch('session/setSession', Date.now());
            } else {
                ScrollManager.enable();

                if (this.removeLoading) {
                    this.removeLoading();
                }
            }
        },
        setupCurrentPage() {
            this.$store.dispatch('page/setCurrent', this.name);
            document.querySelector('html').classList.add(`${this.name}`);
            document.body.classList.add(`${this.name}`);
        }
    },
    computed: {
        ...mapGetters({
          scrollPosition: ['scroll/position'],
          session: ['session/session'],
          currentPage: ['page/current'],
          previousPage: ['page/previous'],
        }),
    },
    beforeDestroy() {
        document.querySelector('html').classList.remove(`${this.name}`);
        document.body.classList.remove(`${this.name}`);
        ScrollManager.disable();

        if (this.scrollModule) {
            this.scrollModule.disable();
        }
    },
}