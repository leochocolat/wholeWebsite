<template>
  <div>
    <ThreeScene />
    <nuxt/>
    <Loader />
  </div>
</template>

<script>
import ThreeScene from '~/components/ThreeScene';
import Loader from '~/components/Loader';

export default {
  components: {
    ThreeScene,
    Loader
  }
}
</script>

<style>
</style>

