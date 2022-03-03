<template>
    <div>
        <p>test</p>
    </div>
</template>

<script>

export default {
    name: 'IndexPage',
    data () {
        return {
            externalContent: ''
        }
    },
    methods: {
        openURL (url) {
            window.open(url)
        }
    }
}
</script>