export default defineNuxtConfig({
    css: [
        'vuetify/styles',
        '@/assets/styles/main.scss',
    ],
    build: {
        transpile: ['vuetify']
    },
    plugins: [
        '@/plugins/vuetify'
    ],
    modules: ['@pinia/nuxt'],
});
