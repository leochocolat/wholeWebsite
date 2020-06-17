<template>
    <div class="video-player" data-scroll data-scroll-offset="200">
        <video :poster="poster.fields.file.url" class="video-player__video js-video" playsinline>
            <source :src="'https://serge-bocancea.fr/WholeDemo.mp4'" type="video/mp4">
            <source :src="'https://serge-bocancea.fr/WholeDemo.webm'" type="video/webm">
            <!-- <source :src="video[0].fields.file.url" type="video/mp4">
            <source :src="video[1].fields.file.url" type="video/webm"> -->
            <p>This browser does not support the video element.</p>
        </video>
        <button class="video-player__button is-active js-play-button">
            <div class="video-player__button-circle"></div>
            <svg class="video-player__button-svg" id="Calque_1" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><title>play-icon</title><polygon points="499.5 249.5 -0.5 499.5 -0.5 -0.5 499.5 249.5" fill="#fff"/></svg>
        </button>
        <div class="video-player__progress-container js-progress-bar">
            <div class="video-player__progress js-progress"></div>
        </div>
    </div>
</template>

<script>
import VideoPlayerComponent from '~/assets/javascript/components/VideoPlayerComponent';

export default {
    props: {
        video: {
            type: Array,
            required: false
        },
        poster: {
            type: Object,
            required: false
        }
    },
    mounted() {
        this._videoplayerComponent = new VideoPlayerComponent({ el: this.$el });
    }
}
</script>