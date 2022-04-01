import fs from 'fs'
import path from 'path'
import { app } from '@electron/remote'
import Vue from 'vue'
import { AudioTrack } from '~/types/Audio'

let playHistory: AudioTrack[] = []
let searchHistory: string[] = []

function loadHistory() {
    const appFolder = path.join(app.getPath('appData'), 'lofity')
    const playbackHistoryPath = path.join(appFolder, 'playback_history.json')

    let exists = fs.existsSync(playbackHistoryPath)
    if (exists) {
        const data = fs.readFileSync(playbackHistoryPath, { encoding: 'utf-8' })
        playHistory = JSON.parse(data) as AudioTrack[]
    }

    const searchHistoryPath = path.join(appFolder, 'search_history.json')

    exists = fs.existsSync(searchHistoryPath)
    if (exists) {
        const data = fs.readFileSync(searchHistoryPath, { encoding: 'utf-8' })
        searchHistory = JSON.parse(data) as string[]
    }
}

/**
 * Add track to the user playback history
 * @param trackItem Track to add
 */
export function addToPlaybackHistory(trackItem: AudioTrack) {
    const foundTracks = playHistory.filter(t => t.id === trackItem.id)
    if (foundTracks.length !== 0) return

    playHistory.unshift(trackItem)

    const appFolder = path.join(app.getPath('appData'), 'lofity')
    const historyPath = path.join(appFolder, 'playback_history.json')

    fs.writeFileSync(historyPath, JSON.stringify(playHistory), { encoding: 'utf-8' })
}

export function getPlaybackHistory() {
    return playHistory
}

/**
 * Add a query to search history
 * @param query Query used to seach
 */
export function addToSearchHistory(query: string) {
    const foundTracks = searchHistory.filter(q => q === query)
    if (foundTracks.length !== 0) return

    searchHistory.unshift(query)

    const appFolder = path.join(app.getPath('appData'), 'lofity')
    const historyPath = path.join(appFolder, 'search_history.json')

    fs.writeFileSync(historyPath, JSON.stringify(searchHistory), { encoding: 'utf-8' })
}

export function getSearchHistory() {
    return searchHistory
}

loadHistory()

declare module 'vue/types/vue' {
    interface Vue {
        $history: {
            addToPlaybackHistory(trackItem: AudioTrack): void,
            getPlaybackHistory(): AudioTrack[]

            addToSearchHistory(query: string): void,
            getSearchHistory(): string[]
        }
    }
}

Vue.prototype.$history = {
    addToPlaybackHistory,
    getPlaybackHistory,

    addToSearchHistory,
    getSearchHistory
}
