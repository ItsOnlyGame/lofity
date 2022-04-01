<template>
    <div keep-alive>
        <div class="header">
            <h1 class="title">Lyrics</h1>
            <input v-model="query" type="text" placeholder="Song title (google searchable)" @keypress="(e) => search(e)">
        </div>
        <div v-if="state === State.Search">
            <p>Search for lyrics</p>
        </div>
        <div v-else-if="state === State.Results" class="lyrics-div">
            <h4>Query: "{{ query }}"</h4>
            <p>{{ lyrics }}</p>
        </div>

        <div v-if="state === State.Loading" class="loader-div">
            <p>Searching...</p>
            <div class="loader" />
        </div>

        <div v-if="state === State.NoResults">
            <p>No lyrics were found.</p>
            <p>You could try changing the query</p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import lyricsFinder from 'lyrics-finder'

enum State {
    Search,
    Loading,
    NoResults,
    Results
}

export default Vue.extend({
    data () {
        return {
            State,
            currentTrack: this.$player.getCurrentTrack(),
            query: 'twenty one pilots ruby',
            lyrics: '',
            lastQuery: '',
            state: State.Search
        }
    },
    async activated() {
        this.currentTrack = this.$player.getCurrentTrack()
        if (this.currentTrack !== null && (this.lyrics === '' || this.currentTrack.name !== this.lastQuery)) {
            this.query = this.currentTrack.name
            this.getLyrics(this.currentTrack.name)
        }
    },
    methods: {
        async search(e) {
            if (e.key !== 'Enter') return
            this.getLyrics(this.query)
        },
        async getLyrics(query: string): Promise<void> {
            this.state = State.Loading
            const lyrics = await lyricsFinder(query)
            this.lastQuery = query

            this.state = lyrics === '' ? State.NoResults : State.Results
            this.lyrics = lyrics
        }
    }
})
</script>

<style lang="scss" scoped>

#content {
    padding: 2rem 2rem 1rem 3rem;

    & input {
        font-size: 0.90em;
        outline: none;

        border: none;
        border-radius: 2rem;

        width: 40vw;
        max-width: 400px;

        height: 8px;
        text-indent: 1rem;
        line-height: 2em;

        padding: 1rem 0.5rem;
        margin: 0;
    }
}

.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 5vw;
}

.lyrics-div {
    & p {
        white-space: pre-line;
        font-size: 85%;
    }
}

.title, h4 {
    color: white;
}

.loader-div {
    display: flex;
    flex-direction: column-reverse;
    background-color: transparent;
    align-items: center;
    justify-content: center;

    margin: 20vh 0;

    width: auto !important;
    //height: 48px !important;
}

.loader {
    position: relative;

    border: 8px solid #9b9b9b; /* Light grey */
    border-top: 8px solid #3498db; /* Blue */
    border-radius: 100%;
    width: 48px !important;
    height: 48px !important;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

</style>