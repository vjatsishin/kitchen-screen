import Vue from 'vue';

export var store = Vue.observable({
    isHistory: false,
    window: {
        width: 0,
        height: 0,
    },
});