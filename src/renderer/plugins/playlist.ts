/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/export */

import path from 'path'
import fs from 'fs'
import * as fsp from 'fs/promises'
import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { app } from '@electron/remote'
import { AudioTrack, Playlist } from '~/types/Audio'

const applicationPath = path.join(app.getPath('appData'), 'lofity')
if (!fs.existsSync(applicationPath)) fs.mkdirSync(applicationPath)

let playlistCache: Playlist[] = []

export function newPlaylist(): Playlist {
    const playlistFolderPath = path.join(applicationPath, 'playlists')

    const playlist: Playlist = {
        id: uuidv4(),
        name: `New playlist ${getPlaylists().length + 1}`,
        description: '',
        thumbnail: '',
        tracks: [],
        updateId: Date.now().toString()
    }

    if (!fs.existsSync(playlistFolderPath)) {
        fs.mkdirSync(playlistFolderPath)
    }

    const playlistPath = path.join(applicationPath, 'playlists', `${playlist.id}.json`)

    if (fs.existsSync(playlistPath)) {
        const errorString = 'This error should not occur but I am too lazy to make a fix for it now. ' +
            'Either way this should be the most impossible change to happen'

        throw new Error(errorString)
    }
    playlistCache.push(playlist)
    fs.writeFileSync(playlistPath, JSON.stringify(playlist))
    return playlist
}

export function getPlaylists(): Playlist[] {
    if (playlistCache.length !== 0) return playlistCache
    const playlistFolderPath = path.join(applicationPath, 'playlists')

    if (!fs.existsSync(playlistFolderPath)) {
        fs.mkdirSync(playlistFolderPath)
        return []
    }

    const folderContent = fs.readdirSync(playlistFolderPath)
    for (const item of folderContent) {
        if (item.endsWith('.json')) {
            const fileContent = fs.readFileSync(path.join(applicationPath, 'playlists', item), { encoding: 'utf-8' })
            playlistCache.push(JSON.parse(fileContent))
        }
    }

    return playlistCache
}

export function getPlaylist(id: string): Playlist | null {
    const playlistFolderPath = path.join(applicationPath, 'playlists')
    const playlistFilePath = path.join(applicationPath, 'playlists', `${id}.json`)

    if (!fs.existsSync(playlistFolderPath)) {
        fs.mkdirSync(playlistFolderPath)
        return null
    }

    if (!fs.existsSync(playlistFilePath)) {
        return null
    }

    const fileContent = fs.readFileSync(playlistFilePath, { encoding: 'utf-8' })
    return JSON.parse(fileContent) as Playlist
}

export function updatePlaylist(id: string, playlist: Playlist) {
    playlist.updateId = Date.now().toString()

    const playlistPath = path.join(applicationPath, 'playlists', `${id}.json`)
    for (let i = 0; i < playlistCache.length; i++) {
        if (playlistCache[i].id === id) {
            playlistCache.splice(i, 1, playlist)
            break
        }
    }
    fs.writeFileSync(playlistPath, JSON.stringify(playlist))
    return playlist
}

export async function deletePlaylist(id: string): Promise<void> {
    const playlistPath = path.join(applicationPath, 'playlists', `${id}.json`)
    playlistCache = playlistCache.filter(pc => pc.id !== id)
    return fsp.unlink(playlistPath)
}

declare module 'vue/types/vue' {
    interface Vue {
        $playlist: {
            newPlaylist(): Playlist,
            getPlaylist(id: string): Playlist | null,
            getPlaylists(): Playlist[],
            updatePlaylist(id: string, playlist: Playlist): void,
            deletePlaylist(id: string): Promise<void>
        }
    }
}
Vue.prototype.$playlist = {
    newPlaylist, getPlaylist, getPlaylists, updatePlaylist, deletePlaylist
}
