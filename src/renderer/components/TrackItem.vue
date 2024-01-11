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
        } as PropOptions<string[]>,
        itemStyle: {
            type: String,
            required: false,
            default() {
                return 'column'
            }
        } as PropOptions<'column' | 'card'>
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
                return 'track-item context-visible ' + this.itemStyle
            }
            return 'track-item ' + this.itemStyle
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

        if (this.menuOptions.includes('remove-from-playlist')) {
            context.push({ name: 'Remove from playlist', slug: 'remove-from-playlist' })
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
            } else if (item.slug.includes('add-to-queue')) {
                this.$player.addToQueue(this.trackItem)
                this.$toast.info(`Added ${this.trackItem.name} to queue`).goAway(3000)
            }
        }
    }
})
</script>

<style lang="scss">
@import url('https://unpkg.com/css.gg@2.0.0/icons/css/play-button-o.css');
@import url('https://unpkg.com/css.gg@2.0.0/icons/css/play-list-add.css');
@import url('https://unpkg.com/css.gg@2.0.0/icons/css/play-list.css');

.track-item.column {
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

.track-item.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 8px;

    padding: 1.2rem 10px;
    border-radius: 8px;
    max-width: 200px;
    height: calc(100% - 2rem);

    background-color: #181818;

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
        width: 200px;
        height: auto;
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
        row-gap: 8px;

        & p {
            display: block;
            margin: 0;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 200px;

            &:first-child {
                font-size: 0.85em;
            }

            &:last-child {
                color: rgb(120, 120, 120);
                font-size: 0.7em;
            }

        }
    }
}

</style>