import path from 'path'
import fs from 'fs'
import events from 'events'
import { Howl } from 'howler'
import Vue from 'vue'
import YTDlpWrap from 'yt-dlp-wrap'
import { app } from '@electron/remote'
import { addToPlaybackHistory } from './history'
import { Queue, RepeatMode } from './queue'
import { AudioTrack, Playlist, TrackData } from '~/types/Audio'

const frequentTracks: { track: AudioTrack, date: null, src: string }[] = []

class Player {
    private volume = 0.5
    private ytdlp: YTDlpWrap
    private howl = null as Howl | null
    private queueManager = new Queue()
    public eventListener = new events.EventEmitter()
    private loadPromise = null as Promise<void> | null

    constructor() {
        const file = path.join(app.getPath('appData'), 'lofity', 'yt-dlp.exe')
        this.ytdlp = new YTDlpWrap(file)
    }

    /**
     * Initializes YTDLp Wrapper for node
     * Downloads the latest wrapper from github
     */
    async donwloadYtdlp(): Promise<void> {
        const appFolder = path.join(app.getPath('appData'), 'lofity')
        if (!fs.existsSync(appFolder)) {
            fs.mkdirSync(appFolder)
        }

        // TODO: Linux and MacOS support require here (exe)
        const ytDlpFile = path.join(appFolder, 'yt-dlp.exe')
        if (!fs.existsSync(ytDlpFile)) {
            return YTDlpWrap.downloadFromGithub(ytDlpFile)
        }
        return undefined
    }

    /**
     * Play a track.
     * Ignores the queue but keeps it in the background for when this track ends
     * @param track AudioTrack object
     * @returns Returns a TrackData object
     */
    play(track: AudioTrack): TrackData {
        if (this.howl != null) {
            this.howl.stop()
            this.queueManager.clear('playlist')
            this.queueManager.skip()
        }

        if (this.loadPromise) {
            this.loadPromise.then(() => {
                if (this.howl != null) {
                    this.howl.stop()
                }
            })
        }
        this.loadPromise = this.loadTrack(track)

        this.queueManager.addToQueue(track)

        return {
            rawSound: this.howl as Howl,
            info: track
        }
    }

    playPlaylist(playlist: Playlist, firstTrack: number): TrackData {
        if (this.howl != null) {
            this.howl.stop()
            this.queueManager.clear('playlist')
        }

        this.queueManager.addPlaylistToQueue(playlist, firstTrack)
        this.loadTrack(playlist.tracks[firstTrack])

        return {
            rawSound: this.howl as Howl,
            info: playlist.tracks[firstTrack]
        }
    }

    addToQueue(trackInfo: AudioTrack): void {
        this.queueManager.addToQueue(trackInfo)
    }

    /**
     * Load track to howler
     * @param trackInfo Track in question
     */
    private async loadTrack(trackInfo: AudioTrack): Promise<void> {
        this.eventListener.emit('loadTrack', trackInfo)
        const url = await this.getUrl(trackInfo)
        frequentTracks.push({ track: trackInfo, date: null, src: url })
        addToPlaybackHistory(trackInfo)

        this.howl = new Howl({
            src: [url],
            html5: true,
            preload: 'metadata'
        })
        this.howl.play()
        this.howl.volume(this.volume)

        this.eventListener.emit('loadSound', this.howl)

        const _this = this
        this.howl.on('loaderror', function(error) {
            console.log(error)
        })

        this.howl.on('playerror', function(error) {
            console.log(error)
        })

        this.howl.on('end', function() {
            const nextTrack = _this.queueManager.nextTrack()
            console.log(nextTrack)
            if (nextTrack === null) return
            _this.loadTrack(nextTrack)
        })
    }

    setVolume(volume: number): void {
        this.volume = volume
        if (this.howl !== null) {
            this.howl.volume(volume)
        }
    }

    setRepeatMode(mode: RepeatMode): void {
        this.queueManager.setRepeat(mode)
    }

    pause(): void {
        if (this.howl == null) return
        if (this.howl.playing()) {
            this.howl.pause()
        } else {
            this.howl.play()
        }
    }

    /**
     * Function returs howl sound object if it's not null
     * @returns Howl sound object
     */
    currentHowlSound(): Howl | null {
        return this.howl
    }

    getCurrentTrack(): AudioTrack | null {
        return this.queueManager.getQueue()[0] || null
    }

    /**
     * Fetches the track url using yt-dlp
     * @param trackInfo The track in question
     * @returns Track playback url
     */
    private async getUrl(trackInfo: AudioTrack): Promise<string> {
        const cache = frequentTracks.filter(t => t.track.id === trackInfo.id)
        if (cache.length !== 0) {
            const checkLink = async url => (await fetch(url)).ok
            if (await checkLink(cache[0].src)) {
                return cache[0].src
            }
            frequentTracks.splice(frequentTracks.indexOf(cache[0]), 1)
        }
        const options = ['-f', 'bestaudio', '--get-url', trackInfo.url]
        return await this.ytdlp.execPromise(options)
    }

    public getQueue() {
        return this.queueManager.getQueue()
    }
}

const player = new Player()

declare module 'vue/types/vue' {
    interface Vue {
        $player: Player
    }
}

Vue.prototype.$player = player