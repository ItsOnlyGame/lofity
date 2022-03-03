<template>
    <div class="track-item">
        <div>
            <div class="image" @mouseover="imageHover = true" @mouseleave="imageHover = false">
                <img
                    v-if="trackItem.thumbnail"
                    :src="trackItem.thumbnail"
                    width="180"
                    :class="imageHover ? 'hover' : ''"
                >
                <icon-button
                    :icon="'gg-play-button-o'" :class="imageHover ? 'hover' : ''"
                    @click="playClick"
                />
            </div>
            <div class="text" @click="mainClick">
                <p>{{ trackItem.name }}</p>
                <p>{{ trackItem.artists.join(', ') }}</p>
            </div>
        </div>
        <div v-if="menu && menuOptions.length != 0">
            <div class="buttons">
                <icon-button
                    v-if="menuOptions.includes('add-to-playlist')"
                    :icon="'gg-play-list-add'"
                    :text="'Add to playlist'"
                    @click="menuClick('add-to-playlist')"
                />
                <icon-button
                    v-if="menuOptions.includes('add-to-queue')"
                    :icon="'gg-play-list'"
                    :text="'Add to queue'"
                />
            </div>
            <div class="menu-view">
                <div v-if="menuView == 'add-to-playlist'" class="add-to-playlist">
                    <div v-for="(item, index) of playlists" :key="index">
                        <icon-button :text="item.name" @click="playlistAction(item)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import IconButton from '@/components/icon-button.vue'
import { AudioTrack, Playlist } from '~/types/Audio'

export default Vue.extend({
    components: { IconButton },
    props: {
        trackItem: {
            type: Object,
            required: true
        } as PropOptions<AudioTrack>,
        menuOptions: {
            type: Array,
            required: false,
            default() {
                return []
            }
        } as PropOptions<string[]>
    },
    data() {
        return {
            imageHover: false,
            menu: false,
            menuView: null as string | null,
            playlists: this.$playlist.getPlaylists()
        }
    },
    methods: {
        mainClick(e) {
            // Reset menu and the view of it
            this.menuClick(null)

            e.preventDefault()
            this.$emit('main-click', { event: e, element: this })
        },
        playClick(e) {
            // Reset menu and the view of it
            this.menu = false
            this.menuClick(null)

            e.preventDefault()
            this.$emit('play-click', { event: e, element: this })
        },
        openMenu() {
            this.menu = !this.menu
        },
        menuClick(view: string | null) {
            this.menuView = view
        },
        playlistAction(playlistItem: Playlist) {
            const playlist = this.$playlist.getPlaylist(playlistItem.id) as Playlist
            playlist.tracks.push(this.trackItem)
            this.$playlist.updatePlaylist(playlistItem.id, playlist)
            this.$toast.success('Added to playlist!').goAway(3000)
            this.menuClick(null)
        }
    }
})
</script>

<style lang="scss">
@import url('https://css.gg/play-button-o.css');
@import url('https://css.gg/play-list-add.css');
@import url('https://css.gg/play-list.css');

.track-item {
    display: flex;
    flex-direction: column;

    border-radius: 1rem;

    &:hover {
        background-color: #2a2a2a;
    }
}

.track-item > div:first-child {
    display: flex;
    flex-direction: row;
    column-gap: 1rem;
    align-items: center;
    padding: 1rem 1rem;

    &, * {
        cursor: pointer;
    }

    & img {
        width: auto;
        height: 3rem;
    }

    & .image {
        display: grid;
        grid-template: 1fr / 1fr;
        justify-items: center;

        & img {
            grid-area: 1 / 1;
        }

        & img.hover {
            filter: brightness(20%);
        }

        & .icon-button {
            display: none;
            grid-area: 1 / 1;
        }

        & .icon-button.hover {
            display: inherit;
        }

    }

    & .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        row-gap: 4px;
        width: 100%;
        & p {
            margin: 0;

            &:last-child {
                color: rgb(120, 120, 120);
                font-size: 0.7em;
            }
        }
    }
}

.track-item > div:nth-child(2) {
    display: grid;
    grid-template-columns: max-content auto;

    height: auto;
    max-height: 300px;
    padding-bottom: 16px;
    & .buttons {
        border: none;
        border-right: 1px solid #4b4b4b;
    }

    & .menu-view {
        margin: 0 2rem;

        & .add-to-playlist .icon-button {
            margin: 0;
            * {
                margin: 8px 4px;
            }
        }
    }

    & .icon-button {
        margin: 0 2rem;
    }
}
</style>