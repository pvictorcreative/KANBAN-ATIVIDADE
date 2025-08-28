import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as labs from 'vuetify/labs/components'

export const vuetify = createVuetify({
  components: {
    ...components,
    ...labs
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {},
    sets: {}
  },
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        dark: false,
        colors: {
          background: '#FBFAFF',
          primary: '#7C3AED',
          secondary: '#444444',
          text: '#444444'
        }
      }
    },
    defaults: {
      global: {
        style: {
          color: '#444444',
          fontFamily: 'Poppins, sans-serif'
        }
      }
    }
  }
})
