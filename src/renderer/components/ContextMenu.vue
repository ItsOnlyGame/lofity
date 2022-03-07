<template>
    <div
        v-if="visible"
        v-click-outside="close"
        :style="elementPosition"
        class="context-menu"
    >
        <div v-for="(item, index) of options" :key="index">
            <p
                @mouseover="hoverShow(item)"
                @click="optionClick(item)"
            >
                {{ item.name }}
            </p>
            <ContextMenu
                v-if="Array.isArray(item.slug)"
                :visible="item.visible"
                class="subcategory"
                :options="item.slug"
                @option-click="i => optionClick(i)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Option } from '@/types/Client'

export default Vue.extend({
    name: 'ContextMenu',
    props: {
        options: {
            type: Array,
            required: true,
            validator(value: Option[]) {
                const validate = function(options: Option[]) {
                    for (const option of options) {
                        if (Array.isArray(option.slug)) {
                            validate(option.slug)
                        }
                        Vue.set(option, 'visible', false)
                    }
                }

                validate(value)
                return true
            }
        } as PropOptions<Option[]>,
        visible: {
            type: Boolean,
            required: false,
            default: true
        } as PropOptions<Boolean>
    },
    data() {
        return {
            mouseXPos: 0,
            mouseYPos: 0
        }
    },
    computed: {
        elementPosition() {
            // ----------------------- //
            // Removing these lines breaks a few things. I don't know... It's fucking weird
            // eslint-disable-next-line no-unused-expressions
            this.mouseXPos
            // eslint-disable-next-line no-unused-expressions
            this.mouseYPos
            // ----------------------- //

            if (this.$el === undefined) return
            let top = '0px'
            let left = '0px'
            // This could be better
            // Take in account if the element would go out of
            // bounds rather than calculating from the half point
            if (this.mouseYPos > window.innerHeight / 2) {
                top = this.mouseYPos - this.$el.clientHeight + 'px'
            } else {
                top = this.mouseYPos + 'px'
            }

            if (this.mouseXPos > window.innerWidth / 2) {
                left = this.mouseXPos - this.$el.clientWidth + 'px'
            } else {
                left = this.mouseXPos + 'px'
            }
            return { top, left }
        }
    },
    mounted() {
        const _this = this
        const contextClick = function(ev: any) {
            _this.mouseXPos = ev.x
            _this.mouseYPos = ev.y
        }
        document.body.addEventListener('contextmenu', contextClick)
    },
    methods: {
        hoverShow(item: Option) {
            for (const option of this.options) {
                option.visible = false
            }
            item.visible = true
        },
        close() {
            for (const option of this.options) {
                option.visible = false
            }
            this.$emit('context-close')
        },
        optionClick(item) {
            if (Array.isArray(item.slug)) return
            this.$emit('option-click', item)
            this.close()
        }
    }
})
</script>

<style lang="scss">

.context-menu {
    position: fixed;
    z-index: 100;
    min-width: 150px;
    max-width: 300px;
    background-color: #282828;
    padding: 6px;
    border-radius: 4px;
    box-shadow: 0px 0px 25px 0px rgba(0,0,0,0.5);
    & p {
        margin: 0;
        padding: 8px;
        cursor: pointer;
        border-radius: 2px;
    }

    & p:hover {
        background-color: #3e3e3e;
    }

    &.subcategory {
        transform: translateX(calc(100% + 4px));
    }
}

</style>