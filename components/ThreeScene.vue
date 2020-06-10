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
        },
        destroyScene() {
            this.threeScene.close();
        }
    },
    mounted() {
        this.setup();
    },
    beforeDestroy() {
        this.destroyScene();
    }
}
</script>

<style>
</style>

