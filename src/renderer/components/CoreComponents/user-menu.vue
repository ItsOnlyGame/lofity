<template>
    <div id="user-menu" :key="update">
        <div class="buttons">
            <icon-button :text="'Home'" :icon="'gg-home'" :class="getClass('', '/')" @click="$router.push('/')" />
            <icon-button
                :text="'Search'"
                :icon="'gg-search'"
                :class="getClass('', '/search')"
                @click="$router.push('/search')"
            />
            <icon-button
                :text="'Create playlist'"
                :icon="'gg-math-plus'"
                @click="createPlaylist"
            />
        </div>

        <div class="playlists">
            <div v-for="(item, index) of playlists" :key="item.updateId">
                <div
                    :class="getClass('playlist-button', `/playlist/${item.id}`)"
                    @click="$router.push(`/playlist/${item.id}`)"
                    @contextmenu.prevent="contextMenuVisible.splice(index, 1, true)"
                >
                    <p>{{ item.name }}</p>
                </div>

                <ContextMenu
                    :visible="contextMenuVisible[index]"
                    :options="generateContextMenu(item)"
                    @context-close="contextMenuVisible.splice(index, 1, false)"
                    @option-click="contextClick"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconButton from '../icon-button.vue'
import { AudioTrack, Playlist } from '~/types/Audio'
import { Option } from '~/types/Client'
import ContextMenu from '@/components/ContextMenu.vue'

export default Vue.extend({
    components: { IconButton, ContextMenu },
    data() {
        return {
            playlists: this.$playlist.getPlaylists(),
            contextMenuVisible: [] as Boolean[],
            update: false
        }
    },
    watch: {
        $route() {
            this.update = !this.update
        }
    },
    mounted() {
        for (let i = 0; i < this.playlists.length; i++) {
            Vue.set(this.contextMenuVisible, i, false)
        }
    },
    methods: {
        createPlaylist() {
            const playlist = this.$playlist.newPlaylist()
            this.$router.push(`/playlist/${playlist.id}`)
            this.playlists = this.$playlist.getPlaylists()
        },
        contextClick(item: Option) {
            const slug = item.slug
            if (Array.isArray(slug)) return
            const playlistId = slug.split('/')[1]

            this.$playlist.deletePlaylist(playlistId).finally(() => {
                for (const playlist of this.playlists) {
                    if (playlist.id === playlistId) {
                        this.playlists.splice(this.playlists.indexOf(playlist), 1)
                        break
                    }
                }
            })
        },
        generateContextMenu(item: Playlist): Option[] {
            return [
                { name: 'Delete playlist', slug: 'delete-playlist/' + item.id }
            ]
        },
        getClass(og: string, url: string) {
            if (url === this.$router.currentRoute.path) {
                return og + ' active'
            }
            return og
        }
    }
})
</script>

<style lang="scss">
@import url('https://css.gg/math-plus.css');
@import url('https://css.gg/home.css');
@import url('https://css.gg/search.css');

#user-menu {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
}

span, a, button, .icon-button, .playlist-button p {
    color: #838383;

    &:hover {
        color: #f2f2f2;
    }

    &.active {
        color: #f2f2f2;
    }
}

div.active p {
    color: #f2f2f2;
}

.playlist-button {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 4px;

    p {
        margin: 0;
        cursor: pointer;
    }
}

.buttons {
    border-bottom: 1.5px solid #282828;
    margin: 0 8px;
    padding-bottom: 6px;

    & .icon-button {
        justify-content: flex-start;
        margin: 0 12px;
        width: max-content;
    }
}

.playlists {
    display: flex;
    flex-direction: column;

    align-items: center;
    cursor: default;

    & div a {
        font-size: 0.85em;
    }

    & > * {
        margin: 8px 0;
    }

    & * {
        text-align: center;
    }
}

</style>