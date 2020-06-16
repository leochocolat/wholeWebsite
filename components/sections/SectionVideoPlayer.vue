<template>
    <section class="section-video-player">
        <div class="container section-video-player__container">
            <div class="section-video-player__content">
                <div data-scroll data-scroll-offset="200" class="heading section-video-player__heading js-heading-split">Découvrez l'expérience</div>
                <VideoPlayer />
            </div>
        </div>
    </section>
</template>

<script>
import SplitText from '~/assets/javascript/vendors/SplitText.js';
import VideoPlayer from '~/components/partials/VideoPlayer';

export default {
    components: {
        VideoPlayer
    },
    mounted() {
        const el = this.$el.querySelector('.js-heading-split');

        let splitLines = new SplitText(el, {
            type: 'lines',
            linesClass: 'line line--++',
        }).lines;
        
        for (let i = 0; i < splitLines.length; i++) {
            new SplitText(splitLines[i], {
                type: 'lines',
                linesClass: `animated-line animated-line--${i}`,
            });
        }
    }
}
</script>