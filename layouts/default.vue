<template>
  <div>
    <ThreeScene />
    <nuxt/>
    <Navbar />
    <StartScreen />
    <Grid />
  </div>
</template>

<script>
import ThreeScene from '~/components/ThreeScene';
import StartScreen from '~/components/StartScreen';
import Grid from '~/components/Grid';
import Navbar from '~/components/partials/Navbar';

export default {
  components: {
    ThreeScene,
    StartScreen,
    Grid,
    Navbar
  }
}
</script>

<style>
</style>

