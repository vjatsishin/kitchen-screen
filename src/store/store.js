import Vue from 'vue';

export var store = Vue.observable({
    orders: [],
    isHistory: false,
    window: {
        width: 0,
        height: 0,
    },
});