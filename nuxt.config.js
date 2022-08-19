import colors from 'vuetify/es5/util/colors'

export default {//
  router: {
    middleware: 'loginRequired'
  },
  loading: '~/components/LoadingBar.vue',
  // Target: https://go.nuxtjs.dev/config-target
  target: 'server',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s',
    title: 'dashboard',
    htmlAttrs: {
      lang: 'pt-br'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'robots', content: 'noindex' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/globalComponents.ts',
    '@/plugins/v-mask.js',
    '@/plugins/uploadImages.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/firebase',
    '@nuxtjs/auth-next'
  ],
  firebase: {
    config: {
      apiKey: 'AIzaSyAiYJ45hcew1EAiggUhMRGnj7JdDTMnDvc',
      authDomain: 'leechineostore.firebaseapp.com',
      projectId: 'leechineostore',
      storageBucket: 'leechineostore.appspot.com',
      messagingSenderId: '544188101558',
      appId: '1:544188101558:web:865d8742571a7ca3444717',
      measurementId: 'G-Y6K7KR1Q3R'
    },
    // config: {
    //   apiKey: "AIzaSyBr-mNQbSRz5_48gPzmjRjnTMhJt33dDlA",
    //   authDomain: "leechineo-d2c8c.firebaseapp.com",
    //   projectId: "leechineo-d2c8c",
    //   storageBucket: "leechineo-d2c8c.appspot.com",
    //   messagingSenderId: "282095212188",
    //   appId: "1:282095212188:web:3e4d5576032938b1313f59",
    //   measurementId: "G-7S5N2M84PV"
    // },
    services: {
      storage: true,
    }
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          maxAge: 43200
        },
        user: {
          property: 'user'
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          user: { url: '/auth/user', method: 'get' },
          logout: { url: '/auth/logout', method: 'post' }
        }
      }
    }
  },
  axios: {
    baseUrl: process.env.API_URL
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue,
          first: '#303443',
          second: '#2a2e3c',
          third: '#212430',
          fourth: '#181b24',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
