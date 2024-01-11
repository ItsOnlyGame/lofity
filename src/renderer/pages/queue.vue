<template>
    <div>
        <h1 class="title">Queue</h1>
        <div v-if="currentTrack !== null" class="track-list">
            <h4>Currently playing</h4>
            <TrackItem
                :track-item="currentTrack"
                :menu-options="['add-to-playlist', 'add-to-queue']"
                @play-click="play(currentTrack)"
            />
            <br>
            <div v-if="queue.length > 0">
                <h4>Next in queue</h4>
                <div v-for="(item, index) of queue" :key="index">
                    <TrackItem
                        :track-item="item"
                        :menu-options="['add-to-playlist', 'add-to-queue']"
                        @play-click="play(item)"
                    />
                </div>
            </div>
        </div>
        <div v-else-if="queue.length === 0">
            <p>Nothing in queue</p>
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
            currentTrack: this.$player.getCurrentTrack()
        }
    },
    computed: {
        queue(): AudioTrack[] {
            return this.$player.getQueue().slice(1)
        }
    },
    mounted() {
        console.log(this.$player.getCurrentTrack())
        console.log(this.$player.getQueue().slice(1))
    },
    methods: {
        play(item: AudioTrack) {
            const track = this.$player.play(item)
            this.$store.commit('player/setTrack', track.info)
        }
    }
})
</script>

<style lang="scss" scoped>

#content {
    padding: 2rem 2rem 1rem 3rem;
}

.title, h4 {
    color: white;
}

.track-list {
    display: flex;
    flex-direction: column;
    margin: 1rem 1rem;
    padding: 0;
}

</style>