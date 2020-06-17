<template>
    <section class="section-boid" data-scroll data-scroll-offset="200">
        <div class="section-boid__video-container">
            <VideoImageRenderer class="section-boid__video" :image="data.fields.image ? data.fields.image : undefined" :video="data.fields.video ? data.fields.video : undefined" />
        </div>
        <div class="section-boid__container container">
            <div class="section-boid__content" data-scroll data-scroll-offset="200" data-scroll-position="elementTop" data-scroll-speed="0.1">
                <div class="section-boid__title heading js-heading-split" >
                    {{ data.fields.title }}
                </div>
                <div class="section-boid__paragraph paragraph">
                    {{ data.fields.description }}
                </div>
            </div>
        </div>
    </section>    
</template>

<script>
import SplitText from '~/assets/javascript/vendors/SplitText.js';
import VideoImageRenderer from '~/components/partials/VideoImageRenderer';

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