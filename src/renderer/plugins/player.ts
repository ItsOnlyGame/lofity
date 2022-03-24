import path from 'path'
import fs from 'fs'
import events from 'events'
import { Howl } from 'howler'
import Vue from 'vue'
import YTDlpWrap from 'yt-dlp-wrap'
import { app } from '@electron/remote'
import { addToHistory } from './history'
import { AudioTrack, TrackData } from '~/types/Audio'

const frequentTracks: { track: AudioTrack, date: null, src: string }[] = []
const eventEmitter = new events.EventEmitter()

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
    if (!fs.existsSync(ytDlpFile)) {
        YTDlpWrap.downloadFromGithub(ytDlpFile)
    }
    return new YTDlpWrap(ytDlpFile)
}

// Init required values
const ytDlpWrap = initYTDLpWrap()
let sound: Howl | null = null
let volume = 0.5
const sessionHistory: AudioTrack[] = []
const trackQueue: AudioTrack[] = []

/**
 * Play a track.
 * Ignores the queue but keeps it in the background for when this track ends
 * @param trackInfo AudioTrack object
 * @param options Play options, like volume
 * @returns Returns a TrackData object
 */
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

// Adds a track to the queue
export function queue(trackInfo: AudioTrack): void {
    trackQueue.push(trackInfo)
}

/**
 * Fetches the track url using yt-dlp
 * @param trackInfo The track in question
 * @returns Track playback url
 */
async function getUrl(trackInfo: AudioTrack): Promise<string> {
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

/**
 * Load track to howler
 * @param trackInfo Track in question
 * @param options Play options, like volume
 */
async function loadTrack(trackInfo: AudioTrack, options?: { volume: number }) {
    eventEmitter.emit('loadTrack', trackInfo)
    const url = await getUrl(trackInfo)

    frequentTracks.push({ track: trackInfo, date: null, src: url })
    addToHistory(trackInfo)

    sound = new Howl({
        src: [url],
        html5: true,
        preload: 'metadata'
    })
    sound.play()
    eventEmitter.emit('loadSound', sound)

    // Set volume on play
    if (options && options.volume) {
        sound.volume(options.volume)
    } else sound.volume(volume)

    sound.on('loaderror', function(error) {
        console.log(error)
    })

    sound.on('playerror', function(error) {
        console.log(error)
    })

    sound.on('end', function() {
        if (trackQueue.length !== 0) {
            const t = trackQueue.shift()
            if (t === undefined) return
            loadTrack(t)
        }
    })
}

/**
 * Function returs howl sound object if it's not null
 * @returns Howl sound object
 */
export function getHowlTrack(): Howl | null {
    return sound
}

// Sets volume for player
export function setVolume(vol: number) {
    volume = vol
    if (sound == null) return
    sound.volume(volume)
}

// Pauses player
export function pause(): void {
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
            getHowlTrack(): Howl | null,
            queue(trackInfo: AudioTrack): void,
            eventEmitter: events.EventEmitter,
            setVolume(vol: number): void,
            pause(): void
        }
    }
}

Vue.prototype.$player = {
    play, setVolume, getHowlTrack, pause, queue, eventEmitter
}
