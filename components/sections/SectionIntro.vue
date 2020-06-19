<template>
    <section class="section-intro" data-scroll-section>
        <div class="section-intro__container container">
            <div class="section-intro__content">
                <p class="section-intro__paragraph paragraph" data-scroll data-scroll-speed="0.3" data-scroll-delay="0.2" data-scroll-position="top">
                    {{ data.fields.subtitle }}
                </p>
                <div class="section-intro__heading heading" data-scroll data-scroll-speed="0.3" data-scroll-delay="0.05" data-scroll-position="top">
                    <div class="section-intro__heading-split js-heading-split">
                        {{ data.fields.title }}
                    </div>
                </div>
            </div>
            <div class="section-intro__video-container" data-scroll data-scroll-offset="500">
                <VideoImageRenderer class="section-intro__video" :image="data.fields.image ? data.fields.image : undefined" :video="data.fields.video ? data.fields.video : undefined" />
            </div>
        </div>
    </section>
</template>

<script>
import VideoImageRenderer from '~/components/partials/VideoImageRenderer';
import SplitText from '~/assets/javascript/vendors/SplitText.js';

export default {
    props: {
        data: {
            type: Object,
            required: false      
        }
    },
    components: {
        VideoImageRenderer
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