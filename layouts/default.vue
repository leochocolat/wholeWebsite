<template>
  <div>
    <ThreeScene />
    <nuxt/>
    <StartScreen />
    <Grid />
  </div>
</template>

<script>
import ThreeScene from '~/components/ThreeScene';
import StartScreen from '~/components/StartScreen';
import Grid from '~/components/Grid';

export default {
  components: {
    ThreeScene,
    StartScreen,
    Grid
  }
}
</script>

<style>
</style>

