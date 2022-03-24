<template>
    <div v-if="show" class="playlist-edit-dialog">
        <div class="dialog">
            <div class="dialog-header">
                <h4 class="title">Edit details</h4>
                <icon-button :icon="'gg-close'" @click="close" />
            </div>
            <div class="form">
                <img :src="require('@/assets/none.jpg')" width="256" height="256">
                <div class="text-inputs">
                    <input v-model="name" type="text" placeholder="Name your playlist">
                    <input v-model="description" type="text" placeholder="Add a description">
                    <button @click="save">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import IconButton from '@/components/icon-button.vue'

export default Vue.extend({
    name: 'PlaylistEditDialog',
    components: { IconButton },
    props: {
        show: {
            type: Boolean,
            required: true
        } as PropOptions<boolean>,
        playlistName: {
            type: String,
            required: true
        } as PropOptions<string>,
        playlistDescription: {
            type: String,
            required: true
        } as PropOptions<string>
    },
    data() {
        return {
            name: this.playlistName,
            description: this.playlistDescription
        }
    },
    methods: {
        close() {
            this.$emit('dialog-close')
        },
        save() {
            this.$emit('dialog-save', { name: this.name, description: this.description })
        }
    }
})
</script>

<style lang="scss">
@import url('https://css.gg/close.css');

.playlist-edit-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
}

.playlist-edit-dialog .dialog {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;

    background-color: #282828;
    border-radius: 1rem;
    padding: 2rem;

    & .form {
        display: flex;
        flex-direction: row;
    }

    & .dialog-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        & .title {
            margin: 0;
            color: white;
        }
    }
}

.playlist-edit-dialog .dialog .text-inputs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    row-gap: 1rem;

    & input {
        font-size: 0.95em;
        outline: none;

        border: none;
        border-radius: 6px;

        max-width: 300px;

        height: 8px;
        text-indent: 1rem;
        line-height: 2em;

        padding: 1rem 0.5rem;
        margin: 0 1rem;
        width: 300px;

        background-color: #3e3e3e;
        color: white;
        border: 1px solid #3e3e3e;

        &:focus {
            background-color: #333333;
        }
    }

    & button {
        width: 100px;

        border-radius: 3rem;
        margin: 0 1rem;
        color: black;
        padding: 0.7rem 1rem;

        &:hover {
            background-color: rgb(200, 200, 200);
        }

        &:active {
            background-color: rgb(180, 180, 180);
        }
    }
}

</style>