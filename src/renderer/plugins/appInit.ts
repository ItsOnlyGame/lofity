import fs from 'fs'
import path from 'path'
import { app } from '@electron/remote'

const appFolder = path.join(app.getPath('appData'), 'lofity')
if (!fs.existsSync(appFolder)) {
    fs.mkdirSync(appFolder)
}

const playlistFolder = path.join(app.getPath('appData'), 'lofity', 'playlists')
if (!fs.existsSync(playlistFolder)) {
    fs.mkdirSync(playlistFolder)
}

const thumbnailFolder = path.join(app.getPath('appData'), 'lofity', 'thumbnails')
if (!fs.existsSync(thumbnailFolder)) {
    fs.mkdirSync(thumbnailFolder)
}
