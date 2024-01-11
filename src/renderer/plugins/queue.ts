import { AudioTrack, Playlist } from '~/types/Audio'

export interface TrackQueue {
    tracks: AudioTrack[],
    trackIndex: number
}

export interface PlaylistQueue {
    playlist: Playlist | null,
    trackIndex: number
}

export enum RepeatMode {
    None,
    Queue,
    Track
}

export class Queue {
    queue = { tracks: [], trackIndex: 0 } as TrackQueue
    playlistQueue = { playlist: null, trackIndex: 0 } as PlaylistQueue
    repeat = RepeatMode.None

    addToQueue(audioTrack: AudioTrack): void {
        console.log(audioTrack.name)
        this.queue.tracks.push(audioTrack)
    }

    addPlaylistToQueue(playlist: Playlist, firstTrack: number): void {
        this.playlistQueue.playlist = playlist
        this.playlistQueue.trackIndex = firstTrack
    }

    previous() {
        if (this.playlistQueue.playlist !== null) {
            this.playlistQueue.trackIndex -= 1
            if (this.playlistQueue.trackIndex <= this.playlistQueue.playlist.tracks.length) {
                this.playlistQueue.trackIndex = this.playlistQueue.playlist.tracks.length - 1
            }

            return this.playlistQueue.playlist.tracks[this.playlistQueue.trackIndex]
        }

        return null
    }

    nextTrack(): AudioTrack | null {
        if (this.queue.tracks.length !== 0) {
            if (this.repeat === RepeatMode.None) {
                this.queue.tracks.shift()
            }

            if (this.repeat === RepeatMode.Queue) {
                this.queue.trackIndex += 1
                if (this.queue.trackIndex >= this.queue.tracks.length) {
                    this.queue.trackIndex = 0
                }
            }
            return this.queue.tracks[this.queue.trackIndex] ?? null
        }

        if (this.playlistQueue.playlist !== null) {
            if (this.repeat !== RepeatMode.Track) {
                this.playlistQueue.trackIndex += 1
            }

            if (this.repeat === RepeatMode.Queue) {
                if (this.playlistQueue.trackIndex >= this.playlistQueue.playlist.tracks.length) {
                    this.playlistQueue.trackIndex = 0
                }
            }

            return this.playlistQueue.playlist.tracks[this.playlistQueue.trackIndex] ?? null
        }

        return null
    }

    getQueue(): AudioTrack[] {
        let split1 = [] as AudioTrack[]
        let split2 = [] as AudioTrack[]
        if (this.playlistQueue.playlist !== null) {
            split1 = this.playlistQueue.playlist.tracks.slice(this.playlistQueue.trackIndex) as AudioTrack[]
            if (this.repeat !== RepeatMode.None) {
                split2 = this.playlistQueue.playlist.tracks.slice(0, this.playlistQueue.trackIndex) as AudioTrack[]
            }
        }

        return this.queue.tracks.concat(split1).concat(split2)
    }

    setRepeat(mode: RepeatMode) {
        this.repeat = mode
    }

    clear(queueMode?: 'queue' | 'playlist') {
        if (queueMode && queueMode === 'queue') {
            this.queue.tracks.splice(0, this.queue.tracks.length)
        } else if (queueMode && queueMode === 'playlist') {
            this.playlistQueue.playlist = null
        }

        this.queue.tracks.splice(0, this.queue.tracks.length)
        this.playlistQueue.playlist = null
    }
}