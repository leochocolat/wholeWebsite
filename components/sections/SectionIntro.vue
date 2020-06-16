<template>
    <section class="section-intro">
        <div class="section-intro__container container">
            <div class="section-intro__content">
                <p class="section-intro__paragraph paragraph" data-scroll data-scroll-speed="0.3" data-scroll-delay="0.2" data-scroll-position="top">
                    Participez à un grand voyage
                </p>
                <div class="section-intro__heading heading" data-scroll data-scroll-speed="0.3" data-scroll-delay="0.05" data-scroll-position="top">
                    <div class="section-intro__heading-split js-heading-split">
                        Inspiré des déplacements collectifs et aventures des animaux migratoires.
                    </div>
                </div>
            </div>
            <div class="section-intro__video-container" data-scroll data-scroll-offset="500">
                <img class="section-intro__video" src="https://images.unsplash.com/photo-1525838983331-f8bd3c000585?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80" alt="">
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