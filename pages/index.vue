<template>
  <div class="page-home js-scroll-container">
    <div class="js-scroll-content">
      <div class="container page-home__container">
        <h1 class="heading page-home__heading">{{ data.fields.title }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { createClient } from '~/plugins/contentful.js';
const client = createClient();

import page from '~/assets/javascript/mixins/page';

export default {
  data() { return { namespace: 'home' } },
  mixins: [page],
  components: {},
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

