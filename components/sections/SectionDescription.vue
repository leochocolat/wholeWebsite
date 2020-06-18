<template>
    <section class="section-description">
        <div class="section-description__container container">
            <div class="section-description__content">
                <div data-scroll data-scroll-speed="0.2" data-scroll-position="elementTop" data-scroll-offset="200" class="section-description__heading heading js-heading-split">
                    {{ data.fields.title }}
                </div>
            </div>
            <div class="section-description__images-container">
                <div class="section-description__image-container section-description__image-container--left" data-scroll data-scroll-offset="200" data-scroll-speed="0.15" data-scroll-position="elementTop">
                    <img class="section-description__image"
                        :src="data.fields.imageLeft.fields.file.url" 
                        alt=""
                        :width="data.fields.imageLeft.fields.file.details.image.width"
                        :height="data.fields.imageLeft.fields.file.details.image.height" 
                    >
                </div>
                <div class="section-description__image-container section-description__image-container--right" data-scroll data-scroll-offset="200">
                    <img class="section-description__image" :src="data.fields.imageRight.fields.file.url" alt="">
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import SplitText from '~/assets/javascript/vendors/SplitText.js';

export default {
    props: {
        data: {
            type: Object,
            required: false      
        }
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