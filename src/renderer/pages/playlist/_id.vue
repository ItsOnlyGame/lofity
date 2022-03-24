<template>
    <div v-if="playlist != null">
        <div class="playlist-info" @click="showEditDialog = true">
            <img :src="require('@/assets/none.jpg')" width="256" height="256">
            <div>
                <h6>PLAYLIST</h6>
                <h1 v-if="playlist != null">{{ playlist.name }}</h1>
                <p>{{ playlist.tracks.length }} tracks</p>
            </div>
        </div>

        <div v-if="playlist.tracks.length !== 0" class="track-list">
            <div v-for="(item, index) of playlist.tracks" :key="index">
                <TrackItem
                    :track-item="item"
                    :menu-options="['add-to-queue', 'remove-from-playlist']"
                    @play-click="play(item)"
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
            @dialog-close="showEditDialog = false"
            @dialog-save="savePlaylistInfo"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TrackItem from '@/components/TrackItem.vue'
import PlaylistEditDialog from '@/components/Playlists/EditDialog.vue'
import { AudioTrack } from '@/types/Audio'

export default Vue.extend({
    components: { TrackItem, PlaylistEditDialog },
    data () {
        return {
            playlist: this.$playlist.getPlaylist(this.$route.params.id),
            showEditDialog: false
        }
    },
    methods: {
        update() {
            console.log('Update playlist')
        },
        play(item: AudioTrack) {
            this.$player.play(item, { volume: this.$store.getters.volume as number }).then(track => {
                this.$store.commit('player/setTrack', track.info)
            })
        },
        savePlaylistInfo(playlistInfo: { name: string, description: string }) {
            if (this.playlist == null) return
            this.playlist.name = playlistInfo.name
            this.playlist.description = playlistInfo.description
            this.$playlist.updatePlaylist(this.$route.params.id, this.playlist)
            this.showEditDialog = false
        }
    }
})
</script>

<style lang="scss">

#content .playlist-info {
    display: flex;
    flex-direction: row;
    column-gap: 1rem;
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