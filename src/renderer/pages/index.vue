<template>
    <div>
        <div class="track-history">
            <div v-for="(item, index) of history" :key="index">
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
import { AudioTrack } from '~/types/Audio'
import TrackItem from '@/components/TrackItem.vue'

export default Vue.extend({
    name: 'IndexPage',
    components: { TrackItem },
    data () {
        return {
            history: this.$history.getHistory()
        }
    },
    methods: {
        play(item: AudioTrack) {
            this.$player.play(item, { volume: this.$store.getters.volume as number }).then(track => {
                this.$store.commit('player/setTrack', track.info)
            })
        }
    }
})
</script>

<style scoped>
#content {
    padding: 2rem 2rem 1rem 3rem;
}
</style>