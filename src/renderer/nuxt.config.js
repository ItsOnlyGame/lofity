/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
    ssr: false,
    target: 'static',
    head: {
        title: 'lofity',
        meta: [{ charset: 'utf-8' }]
    },
    loading: false,
    buildModules: [
        '@nuxt/typescript-build',
        '@nuxt/image'
    ],
    modules: [
        '@nuxtjs/toast'
    ],
    plugins: [
        '../../node_modules/rfs/scss.scss',
        '~/assets/fonts.scss',
        '~/assets/buttons.scss',
        '~/plugins/player.ts',
        '~/plugins/lofity.ts',
        '~/plugins/luxon.ts',
        '~/plugins/playlist.ts'
    ]
}
