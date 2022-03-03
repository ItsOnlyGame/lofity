import Vue from 'vue'
import ytsr, { Video } from 'ytsr'
import { AudioTrack } from '~/types/Audio'

export async function search(query: string): Promise<AudioTrack[]> {
    const filters1 = await ytsr.getFilters(query)
    const filter1 = filters1.get('Type')?.get('Video')
    if (!filter1) return []

    const searchResults = await ytsr(filter1.url as string, { limit: 20 })

    const searchItems: AudioTrack[] = []
    for (const item of searchResults.items as Video[]) {
        searchItems.push({
            id: item.id,
            name: item.title,
            artists: [item.author?.name as string],
            thumbnail: item.bestThumbnail.url,
            url: item.url,
            formatPromise: null
        })
    }
    console.log(searchItems)
    return searchItems
}

declare module 'vue/types/vue' {
    interface Vue {
        $lofity: {
            search(query: string): Promise<AudioTrack[]>
        }
    }
}
Vue.prototype.$lofity = {
    search
}
