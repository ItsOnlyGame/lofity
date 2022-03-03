import path from 'path'
import fs from 'fs'
import { Howl } from 'howler'
import Vue from 'vue'
import YTDlpWrap from 'yt-dlp-wrap'
import { app } from '@electron/remote'
import { AudioTrack, TrackData } from '~/types/Audio'

const frequentTracks: { track: AudioTrack, date: null, src: string }[] = []

/**
 * Initializes YTDLp Wrapper for node
 * Downloads the latest wrapper from github
 */
function initYTDLpWrap(): YTDlpWrap {
    const appFolder = path.join(app.getPath('appData'), 'lofity')
    if (!fs.existsSync(appFolder)) {
        fs.mkdirSync(appFolder)
    }

    // TODO: Linux and MacOS support require here (exe)
    const ytDlpFile = path.join(appFolder, 'yt-dlp.exe')
    YTDlpWrap.downloadFromGithub(ytDlpFile)
    return new YTDlpWrap(ytDlpFile)
}

const ytDlpWrap = initYTDLpWrap()

let sound: Howl | null = null
let volume = 0.5
// This is to satisfy the typescript engine
export async function play(trackInfo: AudioTrack, options?: { volume: number }): Promise<TrackData> {
    if (sound != null) {
        sound.stop()
    }

    loadTrack(trackInfo, options)

    return {
        rawSound: sound as Howl,
        info: trackInfo
    }
}

async function getFileUrl(trackInfo: AudioTrack): Promise<string> {
    const cache = frequentTracks.filter(t => t.track.id === trackInfo.id)
    if (cache.length !== 0) {
        const checkLink = async url => (await fetch(url)).ok
        if (await checkLink(cache[0].src)) {
            return cache[0].src
        }
        frequentTracks.splice(frequentTracks.indexOf(cache[0]), 1)
    }
    const options = ['-f', 'bestaudio', '--get-url', trackInfo.url]
    return await ytDlpWrap.execPromise(options)
}

async function loadTrack(trackInfo: AudioTrack, options?: { volume: number }) {
    const url = await getFileUrl(trackInfo)

    frequentTracks.push({ track: trackInfo, date: null, src: url })

    sound = new Howl({
        src: [url],
        html5: true,
        preload: 'metadata'
    })
    sound.play()
    if (options && options.volume) {
        sound.volume(options.volume)
    } else sound.volume(volume)

    // Clear listener after first call.
    sound.on('loaderror', function(error) {
        console.log(error)
    })

    // Clear listener after first call.
    sound.on('playerror', function(error) {
        console.log(error)
    })

    // Clear listener after first call.
    sound.once('load', function() {
        console.log('Playing')
    })

    // Fires when the sound finishes playing.
    sound.on('end', function() {
        console.log('Finished!')
    })
}

export function getHowlTrack(): Howl | null {
    return sound
}

export function setVolume(vol: number) {
    volume = vol
    if (sound == null) return
    sound.volume(volume)
}

export function pause() {
    if (sound == null) return
    if (sound.playing()) {
        sound.pause()
    } else {
        sound.play()
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        $player: {
            play(trackInfo: AudioTrack, options?: { volume: number }): Promise<TrackData>
            setVolume(vol: number): void,
            getHowlTrack(): Howl | null,
            pause(): void
        }
    }
}

Vue.prototype.$player = {
    play, setVolume, getHowlTrack, pause
}
