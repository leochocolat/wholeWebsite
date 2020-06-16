<template>
    <div class="video-player">
        <video class="video-player__video js-video" playsinline>
            <!-- <source :src="`https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm`" type="video/mp4"> -->
            <source :src="`https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm`" type="video/webm">
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
    mounted() {
        this._videoplayerComponent = new VideoPlayerComponent({ el: this.$el });
    }
}
</script>