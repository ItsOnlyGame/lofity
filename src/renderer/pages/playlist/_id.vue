<template>
    <div v-if="playlist != null">
        <div class="playlist-info" @click="showEditDialog = true">
            <img :src="thumbnail" width="196" height="196">
            <div>
                <h6>PLAYLIST</h6>
                <h1 v-if="playlist != null">{{ playlist.name }}</h1>
                <p>{{ playlist.tracks.length }} tracks</p>
                <p v-if="duration !== ''">{{ duration }}</p>
            </div>
        </div>

        <div v-if="playlist.tracks.length !== 0" class="track-list">
            <div v-for="(item, index) of playlist.tracks" :key="index">
                <TrackItem
                    :track-item="item"
                    :menu-options="['add-to-queue', 'remove-from-playlist']"
                    @play-click="playlistPlay(index)"
                />
            </div>
        </div>

        <div v-else class="track-list empty">
            <p>Playlist is empty. You should add more tracks!</p>
        </div>

        <playlist-edit-dialog
            :show="showEditDialog"
            :playlist-name="playlist.name"
            :playlist-description="playlist.description"
            :playlist-image="playlist.thumbnail"
            @dialog-close="showEditDialog = false"
            @dialog-save="savePlaylistInfo"
        />
    </div>
</template>

<script lang="ts">
import fs from 'fs'
import path from 'path'
import { app } from '@electron/remote'
import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import TrackItem from '@/components/TrackItem.vue'
import PlaylistEditDialog from '@/components/Playlists/EditDialog.vue'
import { AudioTrack, Playlist } from '@/types/Audio'

export default Vue.extend({
    components: { TrackItem, PlaylistEditDialog },
    data () {
        return {
            playlist: this.$playlist.getPlaylist(this.$route.params.id) as Playlist | null,
            showEditDialog: false
        }
    },
    computed: {
        thumbnail(): string {
            const none = require('@/assets/none.jpg')
            if (this.playlist === undefined) return none
            if (this.playlist === null) return none
            if (this.playlist.thumbnail === '') return none
            return this.playlist.thumbnail
        },
        duration() {
            if (this.playlist === null) return
            if (this.playlist.tracks.length === 0) {
                return ''
            }
            let durationInSeconds = 0
            for (const track of this.playlist.tracks) {
                const split = track.duration.split(':')
                if (split.length === 3) {
                    const hours = Number(split[0])
                    const minutes = Number(split[1])
                    const seconds = Number(split[2])

                    durationInSeconds += (hours * 3600) + (minutes * 60) + seconds
                } else if (split.length === 2) {
                    const minutes = Number(split[0])
                    const seconds = Number(split[1])

                    durationInSeconds += (minutes * 60) + seconds
                }
            }

            const dateString = new Date(durationInSeconds * 1000).toISOString().substr(11, 8)
            if (dateString.startsWith('00')) {
                return dateString.substring(3)
            }
            return dateString
        }
    },
    methods: {
        update() {
            console.log('Update playlist')
        },
        playlistPlay(index: number) {
            const track = this.$player.playPlaylist(this.playlist as Playlist, index)
            this.$store.commit('player/setTrack', track.info)
        },
        savePlaylistInfo(playlistInfo: { name: string, description: string, thumbnail: string }) {
            if (this.playlist == null) return
            this.playlist.name = playlistInfo.name
            this.playlist.description = playlistInfo.description

            if (playlistInfo.thumbnail !== '') {
                if (this.playlist.thumbnail !== '') {
                    fs.unlinkSync(this.playlist.thumbnail)
                }

                const thumbnailPath = path.join(app.getPath('appData'), 'lofity', 'thumbnails', uuidv4())
                fs.copyFileSync(playlistInfo.thumbnail, thumbnailPath)
                this.playlist.thumbnail = thumbnailPath
            }

            this.$playlist.updatePlaylist(this.$route.params.id, this.playlist)
            this.showEditDialog = false
        }
    }
})
</script>

<style lang="scss" scoped>

#content .playlist-info {
    display: flex;
    flex-direction: row;
    column-gap: 2rem;
    align-items: center;
    padding: 2rem 1rem 1rem 1rem;
    margin: 0 1rem 0 2rem;
    border-bottom: 1.5px solid #282828;

    &, & * {
        cursor: pointer;
    }

    & h1 {
        color: white;
        margin: 1rem 0;
    }

    & h6 {
        color: white;
        margin: 0;
        font-size: 0.9em;
    }
}

#content .track-list {
    margin: 2rem 0;
    padding: 0 2rem 0 3rem;

    &.empty {
        display: flex;
        justify-content: center;
    }
}

</style>