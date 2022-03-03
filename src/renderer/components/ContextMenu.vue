<template>
    <div v-if="visible" class="context-menu">
        <div v-for="(item, index) of options" :key="index">
            <p @click="$emit('option-click', item)">{{ item.name }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

interface Option {
    name: string,
    slug: string
}

export default Vue.extend({
    props: {
        options: {
            type: Object,
            required: true
        } as PropOptions<Option>
    },
    data() {
        return {
            visible: false
        }
    },
    methods: {
        showMenu() {
            this.visible = !this.visible
        }
    }
})
</script>

<style lang="scss">

.context-menu {
    position: fixed;
    z-index: 100;
    min-width: 150px;
    background-color: #282828;
    padding: 6px;
    border-radius: 4px;

    & p {
        margin: 0;
        padding: 8px;
        cursor: pointer;
        border-radius: 2px;
    }

    & p:hover {
        background-color: #3e3e3e;
    }
}

</style>