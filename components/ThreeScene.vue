<template>
  <canvas class="three-scene">
  </canvas>
</template>

<script>
// import ThreeSceneComponent from '~/assets/javascript/components/ThreeSceneComponent';
import ThreeCanvasComponent from '~/assets/javascript/components/ThreeCanvasComponent';

export default {
    methods: {
        setup() {
            this.threeCanvas = new ThreeCanvasComponent({ el: this.$el });
        }
    },
    mounted() {
        this.setup();
    },
    beforeDestroy() {
        this.threeCanvas.close();
    }
}
</script>

<style>
</style>

