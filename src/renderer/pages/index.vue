<template>
    <div>
        <div class="section">
            <h3 class="title">Played before</h3>
            <div v-if="history.length !== 0" class="track-history">
                <div v-for="(item, index) of history" :key="index">
                    <TrackItem
                        :track-item="item"
                        :item-style="'card'"
                        :menu-options="['add-to-playlist', 'add-to-queue']"
                        @play-click="play(item)"
                    />
                </div>
            </div>
            <div v-else>
                <p>You should start playing music ;)</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import fs from 'fs'
import path from 'path'
import Vue from 'vue'
import { app } from '@electron/remote'
import { AudioTrack } from '~/types/Audio'
import TrackItem from '@/components/TrackItem.vue'

export default Vue.extend({
    name: 'IndexPage',
    components: { TrackItem },
    layout: 'default',
    data () {
        return {
            history: this.$history.getHistory()
        }
    },
    beforeMount() {
        const cfgFile = path.join(app.getPath('appData'), 'lofity', 'init.cfg')
        if (!fs.existsSync(cfgFile)) {
            this.$router.push('/first-init')
        }
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

.section {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 1rem;
    border-radius: 6px;
}

.title {
    color: white;
    padding: 0;
    margin: 4px 0;
}

.track-history {
    display: inline-flex;
    align-items: stretch;

    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;

    column-gap: 1.5rem;
    padding: 1rem 0;

    & > div {
        width: min-content;
    }

}
</style>