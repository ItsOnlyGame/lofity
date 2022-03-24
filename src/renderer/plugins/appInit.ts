import fs from 'fs'
import path from 'path'
import { app } from '@electron/remote'

const appFolder = path.join(app.getPath('appData'), 'lofity')
if (!fs.existsSync(appFolder)) {
    fs.mkdirSync(appFolder)
}
