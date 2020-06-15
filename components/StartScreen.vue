<template>
    <div class="start-screen is-active" >
        <canvas class="start-screen__canvas js-offscreen-canvas"></canvas>

        <div class="container start-screen__container">
            <div class="start-screen__progress">
                <span class="start-screen__progress-value js-progress-value">0</span>%
            </div>

            <div class="start-screen__start-button-container">
                <div class="start-screen__start-button-label-container">
                    <span class="start-screen__start-button-label js-start-label">
                        Explore
                    </span>
                    <span class="start-screen__start-button-label js-loading-label">
                        Loading
                    </span>
                </div>
                <button class="start-screen__start-button" @click="startExperience">
                    <Arrow class="start-screen__start-button-arrow js-start-arrow" />
                    <svg class="start-screen__start-button-circle start-screen__start-button-circle--placeholder js-circle-placeholder" width="80" height="80">
                        <circle cx="30" cy="30" r="30" />
                    </svg>
                    <svg class="start-screen__start-button-circle start-screen__start-button-circle--loading js-loading-svg" width="80" height="80">
                        <circle class="js-loading-circle" cx="30" cy="30" r="30" />
                    </svg>
                </button>
            </div>
        </div>


    </div>
</template>

<script>
import Emitter from '~/assets/javascript/events/Emitter';
import Arrow from '~/components/partials/Arrow';
import LoaderComponent from '~/assets/javascript/components/LoaderComponent';

export default {
    components: {
        Arrow
    },
    mounted() {
        this.setup();
    },
    methods: {
        setup() {
            this._loaderComponent = new LoaderComponent({ el: this.$el });
        },
        startExperience() {
            Emitter.emit('START:EXPERIENCE', {});
            this.$el.classList.remove('is-active');
        }
    }
}
</script>