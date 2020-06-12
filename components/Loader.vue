<template>
    <div class="loader">
        <canvas class="loader__canvas js-offscreen-canvas"></canvas>
        <div class="container loader__container">
            <div class="loader__progress">
                <span class="loader__progress-value js-progress-value">0</span>%
            </div>
        </div>
    </div>
</template>

<script>
import LoaderComponent from '~/assets/javascript/components/LoaderComponent';

export default {
    mounted() {
        this.setup();
    },
    methods: {
        setup() {
            this._loaderComponent = new LoaderComponent({ el: this.$el });
        }
    }
}
</script>