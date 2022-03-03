<template>
    <div id="app">
        <user-menu id="user-menu" />
        <nuxt id="content" />
        <playback-bar id="playback-bar" />
    </div>
</template>

<script>
import PlaybackBar from '@/components/CoreComponents/playback-bar.vue'
import UserMenu from '@/components/CoreComponents/user-menu.vue'

export default {
    name: 'DefaultLayout',
    components: { PlaybackBar, UserMenu }
}
</script>

<style>

:root {
    --Playback-bar-height: 100px;
}

body {
    margin: 0 !important;
}

#app {
    font-family: "Gotham Medium", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin: auto;
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: calc(100vh - 100px) var(--Playback-bar-height);
    grid-template-areas: "menu content" "playback-bar playback-bar";
}

#user-menu {
    grid-area: menu;
    background-color: #000000;
}

#content {
    grid-area: content;
    background-color: #121212;
    overflow-y: auto;
    padding: 2rem 2rem 1rem 3rem;
}

#playback-bar {
    grid-area: playback-bar;
    background-color: #181818;
}

.toasted {
    font-family: Arial, Helvetica, sans-serif;
}

/** Scrollbar style */
::-webkit-scrollbar {
    width: 12px;
    height: 7px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #575757;
}

::-webkit-scrollbar-thumb:hover {
    background: #878787;
}

::-webkit-scrollbar-thumb:active {
    background: #b7b7b7;
}

</style>
