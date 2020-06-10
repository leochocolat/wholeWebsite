<template>
  <canvas class="three-scene">
  </canvas>
</template>

<script>
import ThreeSceneComponent from '~/assets/javascript/components/ThreeSceneComponent';

export default {
    methods: {
        setup() {
            this.threeScene = new ThreeSceneComponent({ el: this.$el });
        }
    },
    mounted() {
        this.setup();
    },
    beforeDestroy() {
        this.threeScene.close();
    }
}
</script>

<style>
</style>

