<template>
    <div>
        <input v-model="query" type="text" placeholder="Artist, songs, or podcasts" @keypress="(e) => search(e)">

        <div v-if="loading" class="loader-div">
            <div v-if="loading" class="loader" />
        </div>

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
            searchResults: [] as AudioTrack[],
            loading: false
        }
    },
    methods: {
        async search(e) {
            if (e.key !== 'Enter') return
            this.searchResults.splice(0, this.searchResults.length)
            this.loading = true
            this.$lofity.search(this.query).then(searchResult => {
                this.searchResults = searchResult
                this.loading = false
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

<style lang="scss" scoped>

#content {
    padding: 2rem 2rem 1rem 3rem;

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

.loader-div {
    display: flex;
    background-color: transparent;
    align-items: center;
    justify-content: center;

    margin: 20vh 0;

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