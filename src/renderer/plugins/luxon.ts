import { DateTime } from 'luxon'
import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
    interface Vue {
        $luxon: DateTime
    }
}

const plugin: Plugin = (_context, inject) => {
    inject('$luxon', DateTime)
}

export default plugin