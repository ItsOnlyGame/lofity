<template>
    <div>
        <p @contextmenu.prevent="visible = !visible">test</p>
        <ContextMenu ref="menu" :visible="visible" :options="contextMenu" @context-close="visible = false" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ContextMenu from '@/components/ContextMenu.vue'

export default Vue.extend({
    name: 'IndexPage',
    components: { ContextMenu },
    data () {
        return {
            externalContent: '',
            visible: false,
            test: [
                { name: 'test', slug: 'test_click' },
                {
                    name: 'test',
                    slug: [{ name: 'sub', slug: 'sub' }],
                    visible: false
                },
                { name: 'test', slug: 'test_click' }
            ],
            contextMenu: [
                { name: 'test', slug: 'test_click' },
                {
                    name: 'test',
                    slug: [{ name: 'sub', slug: 'sub' }]
                },
                { name: 'test', slug: 'test_click' },
                { name: 'test', slug: 'test_click' },
                {
                    name: 'test',
                    slug: [
                        { name: 'sub', slug: 'sub' },
                        { name: 'sub', slug: 'sub' },
                        {
                            name: 'sub',
                            slug: [
                                { name: 'sub', slug: 'sub' },
                                { name: 'sub', slug: 'sub' }
                            ]
                        },
                        { name: 'sub', slug: 'sub' },
                        { name: 'sub', slug: 'sub' }
                    ]
                },
                { name: 'test', slug: 'test_click' },
                { name: 'test', slug: 'test_click' }
            ]
        }
    }
})
</script>