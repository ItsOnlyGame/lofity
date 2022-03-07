<template>
    <div>
        <input v-model="query" type="text" placeholder="Artist, songs, or podcasts" @keypress="(e) => search(e)">

        <div class="track-list">
            <div v-for="(item, index) of searchResults" :key="index">
                <TrackItem
                    :track-item="item"
                    :menu-options="['add-to-playlist', 'add-to-queue']"
                    @play-click="play(item)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AudioTrack } from '@/types/Audio'
import TrackItem from '@/components/TrackItem.vue'

export default Vue.extend({
    components: { TrackItem },
    data () {
        return {
            query: '',
            searchResults: [] as AudioTrack[]
        }
    },
    methods: {
        async search(e) {
            if (e.key !== 'Enter') return
            this.$lofity.search(this.query).then(searchResult => {
                this.searchResults = searchResult
            })
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

#content {
    & input {
        font-size: 0.90em;
        outline: none;

        border: none;
        border-radius: 2rem;

        width: 40vw;
        max-width: 300px;

        height: 8px;
        text-indent: 1rem;
        line-height: 2em;

        padding: 1rem 0.5rem;
        margin: 0 3vw;
    }
}

.track-list {
    display: flex;
    flex-direction: column;
    margin: 2rem 3vw;
}

</style>