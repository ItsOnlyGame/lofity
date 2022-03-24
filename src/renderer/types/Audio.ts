import { Howl } from 'howler'

export interface YtDlpFormat {
    quality: number,
    resolution: string | 'audio only',
    url: string
}

export interface YtDlpVideoInfo {
    channel: string,
    title: string,
    original_url: string,
    formats: YtDlpFormat[],
    thumbnail: string
}

export type AudioTrack = {
    id: string,
    name: string,
    artists: string[],
    url: string
    thumbnail: string | null,
    formatPromise: null | Promise<YtDlpFormat>
}

export type TrackData = {
    rawSound: Howl,
    info: AudioTrack
}

export type Playlist = {
    id: string,
    name: string,
    description: string,
    tracks: AudioTrack[],
    updateId: string
}