import Vue from 'vue'

Vue.directive('click-outside', {
    bind(el: any, binding: any, vnode: any) {
        el.clickOutsideEvent = function (event: any) {
            // here I check that click was outside the el and his childrens
            if (!(el === event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event)
            }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
        document.body.addEventListener('contextmenu', el.clickOutsideEvent, true)
    },

    unbind(el: any) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
        document.body.removeEventListener('contextmenu', el.clickOutsideEvent)
    }
})