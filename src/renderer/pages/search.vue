<template>
    <div>
        <input v-model="query" type="text" placeholder="Artist, songs, or podcasts" @change="search" @keypress="search">

        <div class="track-list">
            <div v-for="(item, index) of searchResults" :key="index">
                <TrackItem
                    :track-item="item"
                    :menu-options="['add-to-playlist']"
                    @main-click="openItemMenu"
                    @play-click="play(item)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import VueSimpleContextMenu from 'vue-simple-context-menu'
import { AudioTrack } from '@/types/Audio'
import TrackItem from '@/components/TrackItem.vue'

export default Vue.extend({
    components: { TrackItem },
    data () {
        return {
            query: 'Gettomasa',
            searchResults: [] as AudioTrack[]
        }
    },
    methods: {
        async search() {
            const searchResult = await this.$lofity.search(this.query)
            this.searchResults = searchResult
        },
        async play(item: AudioTrack) {
            const track = await this.$player.play(item, { volume: this.$store.getters.volume as number })
            this.$store.commit('player/setTrack', track.info)
        },
        openItemMenu(e) {
            e.element.openMenu()
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
    }
}

.track-list {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    margin: 2rem 5vw;
}

</style>