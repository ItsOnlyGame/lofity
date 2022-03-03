<template>
    <div v-if="playlist != null">
        <div class="playlist-info">
            <img :src="require('@/assets/none.jpg')" width="256" height="256">
            <div>
                <h6>PLAYLIST</h6>
                <h1 v-if="playlist != null">{{ playlist.name }}</h1>
                <p>{{ playlist.tracks.length }} tracks</p>
            </div>
        </div>

        <div>
            <div v-for="(item, index) of playlist.tracks" :key="index">
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    data () {
        return {
            playlist: this.$playlist.getPlaylist(this.$route.params.id)
        }
    },
    methods: {
        update() {
            console.log('Update playlist')
        }
    }
})
</script>

<style lang="scss">

#content .playlist-info {
    display: flex;
    flex-direction: row;
    column-gap: 1rem;
    align-items: center;

    & h1 {
        color: white;
        margin: 1rem 0;
    }

    & h6 {
        color: white;
        margin: 0;
    }
}

</style>