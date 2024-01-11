<template>
    <div id="app">
        <nuxt id="content" class="init" />
    </div>
</template>

<script>
export default {
    name: 'Init'
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
    display: grid;
    width: 100%;
    height: 100%;
    background-color: #121212;
}

#content.init {
    grid-area: 1 / 1 / span 2 / span 2;
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
