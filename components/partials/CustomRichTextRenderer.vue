<template>
  <div v-html="getRichText()" class="custom-rich-text-renderer">
  </div>
</template>

<script>
import { INLINES, HYPERLINK } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export default {
  props: {
    document: {
        type: Object,
        required: true
    }
  },
  components: {

  },
  computed: {

  },
  methods: {
      getRichText() {
        const options = {
            renderNode: {
                [INLINES. HYPERLINK]: (node, next) => {
                    return `<a href="${node.data.uri}" target="_blank" rel="noopener">${next(node.content)}</a>`;
                }
            }
        };
        return documentToHtmlString(this.document, options);
      }
  },
  mounted() {
    
  },
}
</script>

<style>
</style>
