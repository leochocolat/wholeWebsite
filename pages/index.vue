<template>
  <div class="page-home js-scroll-container">
    <div class="js-scroll-content">
      <SectionExample v-for="(item, index) in 2" :key="index" :id="index" />
      <SectionExample data-scroll data-scroll-call="sea" data-scroll-repeat="true" :id="99" />
      <SectionVideoPlayer />
      <Footer />
    </div>
  </div>
</template>

<script>
import { createClient } from '~/plugins/contentful.js';
const client = createClient();

import page from '~/assets/javascript/mixins/page';

import Footer from '~/components/partials/Footer';
import SectionExample from '~/components/SectionExample';
import SectionVideoPlayer from '~/components/sections/SectionVideoPlayer';

export default {
  data() { return { namespace: 'home' } },
  mixins: [page],
  components: {
    SectionExample,
    Footer,
    SectionVideoPlayer
  },
  asyncData({ env }) {
    return Promise.all([
      client.getEntries({
        'content_type': 'pageHome',
      })
    ]).then(([homeEntries]) => {
      return {
        data: homeEntries.items[0]
      }
    }).catch(console.error)
  }
}
</script>

<style>
</style>

