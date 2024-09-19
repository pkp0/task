// plugins/vuetify.ts
import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as directives from 'vuetify/directives'
import * as components from 'vuetify/components'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        components,
        directives,
        ssr: true,
        icons: {
            defaultSet: 'mdi',
        },
    });

    nuxtApp.vueApp.use(vuetify)
})
