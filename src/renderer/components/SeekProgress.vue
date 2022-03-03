<template>
    <div
        ref="listenTo" :class="mouseDown ? 'progress-wrapper active' : 'progress-wrapper'"
        @click="getClickPosition" @mousedown="detectMouseDown"
    >
        <div :style="'width:'+elementWidth+'px'" class="progress" />
    </div>
</template>

<script lang='ts'>
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
    name: 'SeekProgress',
    props: {
        value: {
            type: Number,
            required: true
        } as PropOptions<number>,
        max: {
            type: Number,
            required: true
        } as PropOptions<number>
    },
    data() {
        return {
            mouseDown: false,
            elementWidth: 0,
            lastSeekWidth: 0,
            newPosition: 0
        }
    },
    mounted() {
        window.addEventListener('mouseup', this.detectMouseUp, false)
        this.windowResize()
    },
    methods: {
        getClickPosition(e: PointerEvent | MouseEvent) {
            const target = this.$refs.listenTo as Element
            if (target == null) return

            // get the seek width
            const wrapperWidth = target.getBoundingClientRect().x + target.clientWidth
            const wrapperStartX = target.getBoundingClientRect().x

            // Mouse position on window
            const seekWidth = e.pageX
            this.lastSeekWidth = seekWidth

            // Map the new position based on the width and max-width of the element
            this.newPosition = (seekWidth - wrapperStartX) / (wrapperWidth - wrapperStartX) * this.max
            this.elementWidth = this.newPosition / this.max * target.clientWidth

            if (this.newPosition > this.max) {
                this.newPosition = this.max
            } else if (this.newPosition < 0) {
                this.newPosition = 0
            }

            if (this.elementWidth > target.clientWidth) {
                this.elementWidth = target.clientWidth
            } else if (this.elementWidth < 0) {
                this.elementWidth = 0
            }

            this.$emit('update', this.newPosition)
        },
        detectMouseDown(e) {
            // prevent browser from moving objects, following links etc
            e.preventDefault()

            // start listening to mouse movements
            window.addEventListener('mousemove', this.getClickPosition, false)
            this.mouseDown = true
        },
        detectMouseUp() {
            if (!this.mouseDown) return
            // stop listening to mouse movements
            window.removeEventListener('mousemove', this.getClickPosition, false)

            this.mouseDown = false
            this.$emit('setUpdate', this.newPosition)
        },
        windowResize() {
            const _this = this
            setInterval(() => {
                if (_this.mouseDown) return
                const target = _this.$refs.listenTo as Element
                if (target == null) return

                _this.elementWidth = _this.value / _this.max * target.clientWidth

                if (_this.elementWidth > target.clientWidth) {
                    _this.elementWidth = target.clientWidth
                } else if (this.elementWidth < 0) {
                    _this.elementWidth = 0
                }
            }, 300)
        }
    }
})
</script>

<style lang="scss">
.progress-wrapper {
    display: block;
    position: relative;
    background-color: #535353;
        border-radius: 1rem;

    .progress {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        background-color: #b3b3b3;
        border-radius: 1rem;
    }

    &.active .progress {
        background-color: #1db954;
    }
}
</style>