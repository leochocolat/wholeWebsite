<template>
  <div class="page-home js-scroll-container">
    <div class="js-scroll-content">
      <SectionExample v-for="(item, index) in 5" :key="index" :id="index" />
    </div>
  </div>
</template>

<script>
import { createClient } from '~/plugins/contentful.js';
const client = createClient();

import page from '~/assets/javascript/mixins/page';

import SectionExample from '~/components/SectionExample';

export default {
  data() { return { namespace: 'home' } },
  mixins: [page],
  components: {
    SectionExample
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

