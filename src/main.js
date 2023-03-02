import Vue from 'vue'
import App from './App.vue'

import Vuex from 'vuex';
Vue.use(Vuex);

// import store from './store/store'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

//v-ripple
import Ripple from 'vue-ripple-directive'
Ripple.zIndex = 55;
Vue.directive('ripple', Ripple);

import VueConstants from 'vue-constants'
Vue.use(VueConstants);

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

// import VueWebsocket from "vue-websocket";
// Vue.use(VueWebsocket, "wss://img-1.skyservice.pro/skysocket/380954749746/7fEyY9DdfF79iddDaaFnyHTAaEzYel/");
import VueNativeSock from 'vue-native-websocket'
Vue.use(VueNativeSock, 'ws://localhost:3380', { //wss://img-1.skyservice.pro/skysocket/380954749746/7fEyY9DdfF79iddDaaFnyHTAaEzYel/
    // store: store,
    connectManually: true,
    reconnection: true, // (Boolean) whether to reconnect automatically (false)
    // reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
    reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
    format: 'json',
})

// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faUserSecret, faUser, faKey } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// library.add(faUserSecret, faUser, faKey)
// Vue.component('font-awesome-icon', FontAwesomeIcon)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUndo, faUndoAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUndo)
library.add(faUndoAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import VueTelInput from 'vue-tel-input'
Vue.use(VueTelInput)

// var Lang = require('vuejs-localization');
// Lang.requireAll(require.context('./lang', true, /\.js$/));
// Vue.use(Lang);

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import { languages, defaultLocale } from './locale/index.js'
const messages = Object.assign(languages)

import FlagIcon from 'vue-flag-icon'
Vue.use(FlagIcon);

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

Vue.config.productionTip = false

export const handleResize = new Vue();

var i18n = new VueI18n({
    locale: defaultLocale,
    fallbackLocale: defaultLocale,
    messages
})

Vue.use(i18n)

// new Vue({
//   store,
//   render: h => h(App),
// }).$mount('#app')
new Vue({
    el: '#app',
    // store,
    i18n,
    render: h => h(App)
})