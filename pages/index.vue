<template>
  <div class="page-home">
    {{ data.fields }}
  </div>
</template>

<script>
import { createClient } from '~/plugins/contentful.js';
const client = createClient();

export default {
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

