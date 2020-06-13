const config = require('./.contentful.json');
const webpack = require('webpack');

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
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/listeners.client',
  ],
  /*
  ** Build configuration
  */
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        THREE: 'three',
      }),
    ],
    extend (config, ctx) {
      // config.module.rules.push({
      //   test: /\.(glsl|vs|fs)$/,
      //   loader: 'raw-loader'
      // });
      config.module.rules.push({
				test: /\.(glsl|frag|vert)$/,
				use: ['glslify-import-loader', 'raw-loader', 'glslify-loader']
			});
      if (ctx.isClient) {
        config.module.rules.push({
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
          exclude: /(node_modules)/
        });
      }
    },
  },
  env: {
    BASE_URL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
    CTF_SPACE_ID: config.CTF_SPACE_ID,
    CTF_CDA_ACCESS_TOKEN: config.CTF_CDA_ACCESS_TOKEN,
  }
}

