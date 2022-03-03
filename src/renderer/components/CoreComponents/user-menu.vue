<template>
    <div id="user-menu">
        <div class="buttons">
            <icon-button :text="'Home'" :icon="'gg-home'" @click="$router.push('/')" />
            <icon-button :text="'Search'" :icon="'gg-search'" @click="$router.push('/search')" />
            <icon-button :text="'Create playlist'" :icon="'gg-math-plus'" @click="createPlaylist" />
        </div>

        <div class="playlists">
            <div v-for="(item, index) of playlists" :key="index">
                <NuxtLink :to="`/playlist/${item.id}`">{{ item.name }}</NuxtLink>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconButton from '../icon-button.vue'

export default Vue.extend({
    components: { IconButton },
    data() {
        return {
            playlists: this.$playlist.getPlaylists()
        }
    },
    methods: {
        createPlaylist() {
            const playlist = this.$playlist.newPlaylist()
            this.$router.push(`/playlist/${playlist.id}`)
            this.playlists.push(playlist)
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

span, a, button, .category-title, .icon-button {
    color: #838383;

    &:hover {
        color: #f2f2f2;
    }
}

.buttons {
    border-bottom: 1px solid #282828;
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

    align-items: stretch;
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