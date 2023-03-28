import Vue from 'vue';

export var store = Vue.observable({
    // orders: [],
    isHistory: false,
    theme: "",
    workshop: "",
    workshops: [],
    category: "",
    categories: [],
    window: {
        width: 0,
        height: 0,
    },
});