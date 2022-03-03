<template>
    <div class="icon-button" @click="e=>$emit('click', e)">
        <i v-if="icon" :class="icon" />
        <p v-if="text">{{ text }}</p>
    </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: false,
            default: undefined
        } as PropOptions<string>,
        text: {
            type: String,
            required: false,
            default: undefined
        } as PropOptions<string>
    }
})
</script>

<style lang="scss">

.icon-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 10px;

    cursor: pointer;

    * {
        cursor: pointer;
    }
}

.icon-button p {
    color: currentColor;
}

.icon-button i {
    margin: 6px;

}

</style>