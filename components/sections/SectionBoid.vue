<template>
    <section class="section-boid" data-scroll data-scroll-offset="200">
        <div class="section-boid__video-container">
            <video class="section-boid__video" autoplay loop playsinline>
                <source :src="`https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm`" type="video/webm">
            </video>
        </div>
        <div class="section-boid__container container">
            <div class="section-boid__content" data-scroll data-scroll-offset="200" data-scroll-position="elementTop" data-scroll-speed="0.1">
                <div class="section-boid__title heading js-heading-split" >
                    Une ode à la nature
                </div>
                <div class="section-boid__paragraph paragraph">
                    Whole combine art, technologie et données scientifiques pour sensibiliser le public à ce fragile écosystème en encourageant les interactions sociales et la collaboration.
                </div>
            </div>
        </div>
    </section>    
</template>

<script>
import SplitText from '~/assets/javascript/vendors/SplitText.js';

export default {
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