<template>
    <div class="playback-bar">
        <div class="track-info">
            <img :src="thumbnail">
            <div>
                <p class="title">{{ title }}</p>
                <p class="artist">{{ artists }}</p>
            </div>
        </div>

        <div class="track-state">
            <div class="actions">
                <icon-button :icon="'gg-sync'" />
                <icon-button :icon="'gg-play-backwards'" />
                <icon-button v-if="pause" :icon="'gg-play-pause-o'" @click="playpause" />
                <icon-button v-else :icon="'gg-play-button-o'" @click="playpause" />
                <icon-button :icon="'gg-play-forwards'" />
                <icon-button :icon="'gg-repeat'" />
            </div>
            <div class="seek-bar">
                <p>{{ seek }}</p>
                <SeekProgress :value="seekValue" :max="durationValue" @update="preSeek" @setUpdate="setSeek" />
                <p>{{ duration }}</p>
            </div>
        </div>

        <div class="track-other">
            <icon-button :icon="'gg-format-justify'" />
            <icon-button :icon="'gg-volume'" />
            <SeekProgress :value="volumeValue" :max="1" @update="setVolume" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Howl } from 'howler'
import { DateTime } from 'luxon'
import IconButton from '@/components/icon-button.vue'
import SeekProgress from '@/components/SeekProgress.vue'
import { AudioTrack } from '~/types/Audio'

export default Vue.extend({
    components: { IconButton, SeekProgress },
    data() {
        return {
            seek: '0:00',
            duration: '0:00',
            seekValue: 0,
            durationValue: 0,
            volumeValue: this.$store.getters['player/volume'] as number,
            mouseDown: false,
            pause: true,
            trackInfo: null as AudioTrack | null,
            howlerSound: null as Howl | null
        }
    },
    computed: {
        thumbnail() {
            if (this.trackInfo == null) return require('@/assets/none.jpg')
            return this.trackInfo.thumbnail
        },
        title() {
            if (this.trackInfo == null) return ''
            return this.trackInfo.name
        },
        artists() {
            if (this.trackInfo == null) return ''
            return this.trackInfo.artists.join(', ')
        }
    },
    mounted() {
        this.$player.eventEmitter.on('loadTrack', (trackInfo: AudioTrack) => {
            this.trackInfo = trackInfo
        })

        this.$player.eventEmitter.on('loadSound', (howlerSound: Howl) => {
            this.howlerSound = howlerSound
        })

        window.addEventListener('mousedown', () => this.mouseDown = true, false)
        window.addEventListener('mouseup', () => this.mouseDown = false, false)

        const _this = this
        setInterval(() => {
            if (_this.mouseDown) return
            if (_this.howlerSound == null) {
                _this.seek = '0:00'
                _this.duration = '0:00'
                return
            }

            // Calculate seek position every 300ms
            _this.seek = DateTime.fromSeconds(Math.round(_this.howlerSound.seek())).toFormat("m':'ss")
            _this.seekValue = Math.round(_this.howlerSound.seek())
            _this.duration = DateTime.fromSeconds(Math.round((_this.howlerSound).duration())).toFormat("m':'ss")
            _this.durationValue = Math.round((_this.howlerSound).duration())
        }, 300)
    },
    methods: {
        setSeek(value: number) {
            this.seekValue = value
            if (this.howlerSound == null) return
            this.howlerSound.seek(value)
        },
        preSeek(value: number) {
            this.seek = DateTime.fromSeconds(value).toFormat("m':'ss")
        },
        setVolume(value: number) {
            this.volumeValue = value
            this.$player.setVolume(this.volumeValue)
        },
        playpause() {
            this.$player.pause()
            this.pause = !this.pause
        }
    }
})
</script>

<style lang="scss">
@import url('https://css.gg/play-pause-o.css');
@import url('https://css.gg/play-button-o.css');
@import url('https://css.gg/play-backwards.css');
@import url('https://css.gg/play-forwards.css');
@import url('https://css.gg/sync.css');
@import url('https://css.gg/repeat.css');
@import url('https://css.gg/volume.css');
@import url('https://css.gg/format-justify.css');

.playback-bar {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: var(--Playback-bar-height);

    column-gap: 1rem;

    justify-items: start;
    align-items: center;
    height: var(--Playback-bar-height);
    overflow: hidden;
}

.playback-bar .track-info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    row-gap: 0.5em;

    min-width: 20vw;
    height: var(--Playback-bar-height);

    overflow: hidden;

    & > img {

        height: calc(var(--Playback-bar-height) - 1rem);
        //width: 50%;
        margin: 1rem;
        border-radius: 4px;
    }

    & * {
        margin: 0;
    }

    & .title {
        font-size: 0.8em;
    }

    & .artist {
        color: rgb(120, 120, 120);
        font-size: 0.7em;
    }

}

.playback-bar .track-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 6px;

    width: 100%;
    height: 100%;

    & .actions {
        display: flex;
        flex-direction: row;
        column-gap: 2rem;

        justify-content: center;
        align-items: center;

        & > :nth-child(2), & > :nth-child(4) {
            --ggs: 1.4;
        }

        & > :nth-child(3) {
            --ggs: 1.6;
        }

        & > :nth-child(1), & > :nth-child(5) {
            --ggs: 1.2;
        }
    }

    & .seek-bar {
        display: flex;
        flex-direction: row;
        align-items: center;

        column-gap: 8px;

        & p {
            margin: 0;
            color: #b3b3b3;
            font-size: 0.8em;
            width: 32px;
        }

        & .progress-wrapper {
            height: 6px;
            width: 30vw;
        }
    }

}

.playback-bar .track-other {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 100%;

    column-gap: 1rem;

    & .progress-wrapper {
        height: 6px;
        width: 200px;
        margin-right: 16px;
    }

    & :nth-child(1).icon-button {
        --ggs: 1.2;
        height: 28px;
        align-items: flex-start;
    }

    & :nth-child(2).icon-button {
        --ggs: 1.2;
        height: 20px;
        width: 32px;
        align-items: flex-start;
    }
}

</style>
