import Vue from 'vue'
import ytsr, { Video } from 'ytsr'
import { AudioTrack } from '~/types/Audio'

export async function search(query: string): Promise<AudioTrack[]> {
    const filters1 = await ytsr.getFilters(query)
    const filter1 = filters1.get('Type')?.get('Video')
    if (!filter1) return []

    const searchResults = await ytsr(filter1.url as string, { limit: 20 })
    const searchItems: AudioTrack[] = []

    console.log(searchResults)

    try {
        for (const item of searchResults.items as Video[]) {
            if (item.type !== 'video') continue

            searchItems.push({
                id: item.id,
                name: item.title,
                artists: [item.author?.name as string],
                thumbnail: item.bestThumbnail.url,
                url: item.url,
                duration: item.duration === null ? '' : item.duration,
                lyrics: null,
                formatPromise: null
            })
        }
    } catch (error) {
        console.error(error)
        return []
    }

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
