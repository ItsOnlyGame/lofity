<template>
    <div v-if="playlist != null">
        <div class="playlist-info">
            <img :src="require('@/assets/none.jpg')" width="256" height="256">
            <div>
                <h6>PLAYLIST</h6>
                <h1 v-if="playlist != null">{{ playlist.name }}</h1>
                <p>{{ playlist.tracks.length }} tracks</p>
            </div>
        </div>

        <div class="track-list">
            <div v-for="(item, index) of playlist.tracks" :key="index">
                <TrackItem
                    :track-item="item"
                    :menu-options="['add-to-queue']"
                    @play-click="play(item)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TrackItem from '@/components/TrackItem.vue'
import { AudioTrack } from '@/types/Audio'

export default Vue.extend({
    components: { TrackItem },
    data () {
        return {
            playlist: this.$playlist.getPlaylist(this.$route.params.id)
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
}

</style>