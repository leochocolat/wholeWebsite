<template>
  <div class="page-home js-scroll-container">
    <div class="js-scroll-content">
      <SectionIntro :data="sectionIntro" />
      <SectionDescription :data="sectionDescription" />
      <!-- <SectionExample data-scroll data-scroll-call="sea" data-scroll-repeat="true" :id="99" /> -->
      <SectionVideoPlayer :data="sectionDemonstration" />
      <Footer :data="footer" />
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
import SectionIntro from '~/components/sections/SectionIntro';
import SectionDescription from '~/components/sections/SectionDescription';

export default {
  data() { return { namespace: 'home' } },
  mixins: [page],
  components: {
    SectionExample,
    Footer,
    SectionVideoPlayer,
    SectionIntro,
    SectionDescription
  },
  asyncData({ env }) {
    return Promise.all([
      client.getEntries({
        'content_type': 'sectionIntro',
      }),
      client.getEntries({
        'content_type': 'sectionDescription',
      }),
      client.getEntries({
        'content_type': 'sectionDemonstration',
      }),
      client.getEntries({
        'content_type': 'footer',
      }),
    ]).then(([sectionIntro, sectionDescription, sectionDemonstration, footer]) => {
      return {
        sectionIntro: sectionIntro.items[0],
        sectionDescription: sectionDescription.items[0],
        sectionDemonstration: sectionDemonstration.items[0],
        footer: footer.items[0],
      }
    }).catch(console.error)
  }
}
</script>

<style>
</style>

