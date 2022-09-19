const image = 'https://debugmc.info/icon.png'
const description = 'Easily debug your minecraft server with easy to use tools! Find information on your server like ping, version, player online and even dns records! Supporting all protocol versions and platforms!'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'debugmc.info',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: description },
      /* Twitter */
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@kashalls' },
      { hid: 'twitter:creator', name: 'twitter:creator', content: '@kashalls' },
      { hid: 'twitter:title', name: 'twitter:title', content: 'debugmc.info' },
      { hid: 'twitter:description', name: 'twitter:description', content: description },
      { hid: 'twitter:image', name: 'twitter:image', content: image },
      /* Open-Graph */
      { hid: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'debugmc.info' },
      { hid: 'og:description', name: 'og:description', content: description },
      { hid: 'og:image', name: 'og:image', content: image },
      /* Others */
      { hid: 'theme-color', name: 'theme-color', content: '#171717' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/Utils.js',
    '~/plugins/capitalizeFirstLetter.js',
    '~/plugins/font-awesome.js',
    '~/plugins/parseMinecraftColor.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    ['nuxt-buefy', { css: false }],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/sentry
    '@nuxtjs/sentry'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  // https://sentry.nuxtjs.org/guide/setup
  sentry: {
    trace: true,
    publishRelease: {
      setCommits: {
        auto: true
      }
    }
  },

  build: {}
}
