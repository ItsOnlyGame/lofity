import fs from 'fs'
import path from 'path'
import { app } from '@electron/remote'
import Vue from 'vue'
import { AudioTrack } from '~/types/Audio'

let playHistory: AudioTrack[] = []

function loadHistory() {
    const appFolder = path.join(app.getPath('appData'), 'lofity')
    const historyPath = path.join(appFolder, 'history.json')

    const historyExists = fs.existsSync(historyPath)
    if (historyExists) {
        const data = fs.readFileSync(historyPath, { encoding: 'utf-8' })
        playHistory = JSON.parse(data) as AudioTrack[]
    }
}

/**
 * Add track to the user playback history
 * @param trackItem Track to add
 */
export function addToHistory(trackItem: AudioTrack) {
    const foundTracks = playHistory.filter(t => t.id === trackItem.id)
    if (foundTracks.length !== 0) return

    playHistory.unshift(trackItem)

    const appFolder = path.join(app.getPath('appData'), 'lofity')
    const historyPath = path.join(appFolder, 'history.json')

    fs.writeFileSync(historyPath, JSON.stringify(playHistory), { encoding: 'utf-8' })
}

export function getHistory() {
    return playHistory
}

loadHistory()

declare module 'vue/types/vue' {
    interface Vue {
        $history: {
            addToHistory(trackItem: AudioTrack): void,
            getHistory(): AudioTrack[]
        }
    }
}

Vue.prototype.$history = {
    addToHistory,
    getHistory
}
