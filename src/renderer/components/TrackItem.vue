<template>
    <div :class="elementClass" @contextmenu.prevent="e => showContextMenu(e)">
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
        <ContextMenu
            :visible="contextMenuVisible"
            :options="contextMenu"
            @context-close="contextMenuVisible = false"
            @option-click="contextClick"
        />
    </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import IconButton from '@/components/icon-button.vue'
import { AudioTrack, Playlist } from '~/types/Audio'
import ContextMenu from '@/components/ContextMenu.vue'
import { Option } from '@/types/Client'

export default Vue.extend({
    components: { IconButton, ContextMenu },
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
            playlists: this.$playlist.getPlaylists(),
            contextMenuVisible: false,
            contextPosition: { x: 0, y: 0 },
            contextMenu: []
        }
    },
    computed: {
        elementClass() {
            if (this.contextMenuVisible) {
                return 'track-item context-visible'
            }
            return 'track-item'
        }
    },
    mounted() {
        const context = [] as Option[]
        if (this.menuOptions.includes('add-to-queue')) {
            context.push({ name: 'Add to Queue', slug: 'add-to-queue' })
        }

        if (this.menuOptions.includes('add-to-playlist')) {
            const playlistSlug = [] as Option[]
            for (const playlist of this.$playlist.getPlaylists()) {
                playlistSlug.push({ name: playlist.name, slug: `add-to-playlist/${playlist.id}` })
            }
            context.push({ name: 'Add to Playlist', slug: playlistSlug })
        }
        Vue.set(this, 'contextMenu', context)
    },
    methods: {
        mainClick(e) {
            e.preventDefault()
            this.$emit('main-click', { event: e, element: this })
        },
        playClick(e) {
            e.preventDefault()
            this.$emit('play-click', { event: e, element: this })
        },
        playlistAction(playlistItem: Playlist) {
            const playlist = this.$playlist.getPlaylist(playlistItem.id) as Playlist
            playlist.tracks.push(this.trackItem)
            this.$playlist.updatePlaylist(playlistItem.id, playlist)
            this.$toast.success('Added to playlist!').goAway(3000)
        },
        showContextMenu(e: PointerEvent) {
            this.contextMenuVisible = true
            this.contextPosition.x = e.x
            this.contextPosition.y = e.y
        },
        contextClick(item: Option) {
            if (Array.isArray(item.slug)) return
            if (item.slug.includes('add-to-playlist')) {
                const playlistId = item.slug.split('/')[1]
                const playlist = this.$playlist.getPlaylist(playlistId)
                if (playlist == null) {
                    throw new Error('Trying to add track to playlist that doesn\'t exist')
                }
                playlist.tracks.push(this.trackItem)
                this.$playlist.updatePlaylist(playlistId, playlist)
                this.$toast.success('Added track to ' + playlist.name).goAway(3000)
            }
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
    flex-direction: row;
    column-gap: 1rem;
    align-items: center;
    padding: 6px 1rem;

    border-radius: 6px;

    &:hover {
        background-color: #2a2a2a;
    }

    &.context-visible {
        background-color: #5c5c5c;
    }

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
</style>