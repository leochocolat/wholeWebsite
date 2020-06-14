<template>
  <div class="container grid">
    <div class="grid-regular">
      <div class="regular" v-for="item in 25" :key="item"></div>
    </div>
    <div class="grid-narrow">
      <div class="narrow" v-for="item in 9" :key="item"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {

  },
  components: {

  },
  computed: {

  },
  methods: {
    setupEventListeners() {
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Control') {
            document.querySelector('.grid').classList.add('enable')
        }
      });
      window.addEventListener('keyup', (e) => {
          if (e.key === 'Control') {
              document.querySelector('.grid').classList.remove('enable')
          }
      });
    }
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.setupEventListeners();
    } else {
      this.$el.remove();
    }
  },
}
</script>

<style>
</style>
