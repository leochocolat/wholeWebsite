<template>
    <footer class="footer" data-scroll data-scroll-offset="100">
        <div class="footer__container container">
            <div class="footer__content">
                <div class="footer__credits footer__credits--dev">
                    <div class="footer__credits-title">
                        Développement
                    </div>
                    <CustomRichTextRenderer :document="data.fields.creditsDevelopment" />
                </div
                ><div class="footer__credits footer__credits--design">
                    <div class="footer__credits-title">
                        Design
                    </div>
                    <CustomRichTextRenderer :document="data.fields.creditsDesign" />
                </div
                ><div class="footer__gobelins-logo-container">
                    <img src="https://www.gobelins.fr/sites/all/themes/custom/gobelins_theme/build/images/logo-gobelins.png" alt="" class="footer__gobelins-logo">
                </div>
            </div>
            <div class="footer__legals">
                {{ data.fields.legals }}
            </div>
        </div>
    </footer>
</template>

<script>
import CustomRichTextRenderer from '~/components/partials/CustomRichTextRenderer';

export default {
    props: {
        data: {
            type: Object,
            required: false      
        }
    },
    components: {
        CustomRichTextRenderer
    },
    mounted() {
        console.log(this.data.fields.legals);
    }
}
</script>