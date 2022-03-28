<template>
    <div>
        <h1 class="text">Welcome to Lofity</h1>
        <p>Lofity was created as a hobby project to play songs from youtube with spotify compatibility</p>
        <p>Lofity requires yt-dlp to play music</p>
        <div v-if="!loading && !finished">
            <button @click="downloadYtdlp">Download yt-dlp</button>
        </div>
        <div v-if="loading" class="loader-div">
            <div v-if="loading" class="loader" />
        </div>
        <div v-else-if="!loading && finished">
            <p>Finished downloading yt-dlp</p>
            <button @click="goHome">Go home</button>
        </div>
    </div>
</template>

<script lang="ts">
import fs from 'fs'
import path from 'path'
import Vue from 'vue'
import { app } from '@electron/remote'

export default Vue.extend({
    layout: 'init',
    data() {
        return {
            loading: false,
            finished: false
        }
    },
    beforeMount() {
        const cfgFile = path.join(app.getPath('appData'), 'lofity', 'init.cfg')
        if (fs.existsSync(cfgFile)) {
            this.$router.push('/')
        }
    },
    methods: {
        downloadYtdlp() {
            this.loading = true
            this.$player.donwloadYtdlp().then(() => {
                this.loading = false
                this.finished = true
            })
            const cfgFile = path.join(app.getPath('appData'), 'lofity', 'init.cfg')
            if (!fs.existsSync(cfgFile)) {
                fs.writeFileSync(cfgFile, 'true', { encoding: 'utf-8' })
            }
        },
        goHome() {
            this.$router.push('/')
        }
    }
})
</script>

<style lang="scss" scoped>
#content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & div {
        display: flex;
        flex-direction: column;
    }
}

.text {
    color: white;
}

button {
    padding: 12px 16px;
    color: white;
    background-color: grey;

    &:hover {
        background-color: rgb(150, 150, 150);
    }
}

.loader-div {
    display: flex;
    background-color: transparent;
    align-items: center;
    justify-content: center;

    width: auto !important;
    //height: 48px !important;
}

.loader {
    position: relative;

    border: 8px solid #9b9b9b; /* Light grey */
    border-top: 8px solid #3498db; /* Blue */
    border-radius: 100%;
    width: 48px !important;
    height: 48px !important;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>