<template>
    <div class="playlist-edit-dialog">
        <div class="dialog">
            <p>Some text</p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
    name: 'PlaylistEditDialog'
})
</script>

<style lang="scss">

.playlist-edit-dialog {
    display: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
}

</style>