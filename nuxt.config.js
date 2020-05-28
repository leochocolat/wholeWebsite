const config = require('./.contentful.json')

module.exports = {
  head: {
    title: 'Whole',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar
  */
  loading: { color: 'transparent', width: 0, height: 0 },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/app.scss'
  ],
  /*
  ** Build configuration
  */
  build: {
    extend (config, ctx) {
      
    }
  },
  env: {
    BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
    CTF_SPACE_ID: config.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: config.CTF_CDA_ACCESS_TOKEN,
  }
}

