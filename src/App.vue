<template>
  <div id="app">

    <!-- <SettingsDialog v-if="isSettingsDialog && appType && !isFirstStart" @onClose="onSettingsClose"/> && isAuthenticated && isInited -->

    <!-- <InfoDialog v-if="isFirstStart" @onClose="isFirstStart = false"/> -->
    
    <div>
      <div class="hat">
        <div class="hat-history" @click="displayHistory()">
          <template v-if="!isHistory">
            <div class="hat-history-img"/>
            <div>История</div>
          </template>
          <template v-else-if="isHistory">
            <div class="hat-order-img"/>
            <div>Заказы</div>
          </template>
        </div>

        <div class="hat-right">
          <div class="hat-dark-light" @click="changeTheme()">
            <div class="hat-dark-light-img"/>
            <div v-if="currentTheme == 'dark'">Ночь</div>
            <div v-else>День</div>
          </div>
          <div class="hat-current-time">
            {{currentTime}}
          </div>

        </div>
      </div>
      <div class="board">
          <Kitchen />
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'  
  import Kitchen from './components/kitchen/Kitchen'

  import { handleResize } from "@/main.js";

  import axios from 'axios';
  import { store } from "@/store/store.js";
  import { setTimeout } from 'timers';

  import { webviewCheck } from '@/components/webviewCheck.js';

  import getUserLocale from 'get-user-locale';
  const userLocale = getUserLocale();

  import { languages } from './locale/index.js'

  const vm = new Vue()

  export default {
    components: {
      Kitchen,
    },
    data(){
      return {
        time:0,
        currentTheme:"light", //dark||light
        currentTime:"00:00",
      }
    },
    created(){
      var $this = this;
      // console.log("this.isFirstStart", this.isFirstStart)
      // if(this.isFirstStart === null) {
      //   this.isFirstStart = true;
      // }
      // console.log("this.isFirstStart", this.isFirstStart)

      store.window.width = window.innerWidth;
      store.window.height = window.innerHeight;
      window.addEventListener('resize',this.handleResize);

      if(this.language) {
        $this.$i18n.locale = this.language;
      } else {
        console.warn("lang", userLocale)
        if(userLocale) {
          if (typeof languages[userLocale.replace("-", "_")] !== "undefined") {
            $this.$i18n.locale = userLocale
          } else {
            $this.$i18n.locale = userLocale.substring(0, 2)
          }
        }
      }

      this.getCurrentTime();
    },
    mounted(){
      var $this = this;
      if(this.isServer) {
        // this.getMyIP();
        // this.enableSkySocket(true);
      } else {
        if(!this.serversIP || this.serversIP == "") {

        } else {
          vm.$connect('ws://' + this.serversIP + ":3382", {
            store: store,
            connectManually: true,
            reconnection: true, // (Boolean) whether to reconnect automatically (false)
            // reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
            reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
            format: 'json',
          });
        }
      }
    },
    computed: {
      isHistory() {
        return store.isHistory;
      }
    },
    methods:{
      changeTheme() {
        if(this.currentTheme == "dark") {
          this.currentTheme = "light"
        } else {
          this.currentTheme = "dark"
        }
        this.setTheme();
      },
      setTheme() {
        if(this.currentTheme == "dark") {
          document.documentElement.style.setProperty('--main-background', getComputedStyle(document.documentElement).getPropertyValue('--background-dark'));
          document.documentElement.style.setProperty('--main-background-hat', getComputedStyle(document.documentElement).getPropertyValue('--background-hat-dark'));
          document.documentElement.style.setProperty('--main-background-product', getComputedStyle(document.documentElement).getPropertyValue('--background-product-dark'));
          document.documentElement.style.setProperty('--main-background-product-hover', getComputedStyle(document.documentElement).getPropertyValue('--background-product-hover-dark'));
          document.documentElement.style.setProperty('--main-background-product-text', getComputedStyle(document.documentElement).getPropertyValue('--background-product-text-dark'));
          document.documentElement.style.setProperty('--main-background-product-description', getComputedStyle(document.documentElement).getPropertyValue('--background-product-description-light'));
          document.documentElement.style.setProperty('--main-icon-history', getComputedStyle(document.documentElement).getPropertyValue('--icon-history-light'));
          document.documentElement.style.setProperty('--main-icon-order', getComputedStyle(document.documentElement).getPropertyValue('--icon-list-light'));
          document.documentElement.style.setProperty('--main-icon-sun-moon', getComputedStyle(document.documentElement).getPropertyValue('--icon-moon-light'));
          document.documentElement.style.setProperty('--main-shadow', getComputedStyle(document.documentElement).getPropertyValue('--shadow-dark'));
          
        } else {//light
          document.documentElement.style.setProperty('--main-background', getComputedStyle(document.documentElement).getPropertyValue('--background-light'));
          document.documentElement.style.setProperty('--main-background-hat', getComputedStyle(document.documentElement).getPropertyValue('--background-hat-light'));
          document.documentElement.style.setProperty('--main-background-product', getComputedStyle(document.documentElement).getPropertyValue('--background-product-light'));
          document.documentElement.style.setProperty('--main-background-product-hover', getComputedStyle(document.documentElement).getPropertyValue('--background-product-hover-light'));
          document.documentElement.style.setProperty('--main-background-product-text', getComputedStyle(document.documentElement).getPropertyValue('--background-product-text-light'));
          document.documentElement.style.setProperty('--main-background-product-description', getComputedStyle(document.documentElement).getPropertyValue('--background-product-description-dark'));
          document.documentElement.style.setProperty('--main-icon-history', getComputedStyle(document.documentElement).getPropertyValue('--icon-history-dark'));
          document.documentElement.style.setProperty('--main-icon-order', getComputedStyle(document.documentElement).getPropertyValue('--icon-list-dark'));
          document.documentElement.style.setProperty('--main-icon-sun-moon', getComputedStyle(document.documentElement).getPropertyValue('--icon-sun-dark'));
          document.documentElement.style.setProperty('--main-shadow', getComputedStyle(document.documentElement).getPropertyValue('--shadow-light'));
        }
      },
      getCurrentTime() {
        let $this = this;
        function getTime () {
          console.log("getTime")
          const today = new Date();
          const time = (today.getHours() < 10 ? '0' : '') + today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
          $this.currentTime = time;
        }
        getTime();
        setInterval(() => getTime(), 10000);//10 sec
      },
      displayHistory() {
        store.isHistory = !this.isHistory;
      },
      handleResize() {
        try {
          androidFixMono('headerContiner', 'leftContainer', 'curtain', 'cur-x');
        } catch(err){}
        store.window.width = window.innerWidth;
        store.window.height = window.innerHeight;
        if(this.time) clearTimeout(this.time);
          this.time = setTimeout(function() {
            handleResize.$emit('handleResize');
          }, 500);
      },
    },
  }
</script>

<style lang="scss">

  :root {
    //values
    --background-light: #F8F8F8;
    --background-dark: #2F3136;
    --background-hat-light: white;
    --background-hat-dark: #252525;//#282828;//black;
    --background-product-light: #FFFFFF;
    --background-product-dark: #373A3F;
    --background-product-hover-light: #a9a9a963;// white; //
    --background-product-hover-dark: #A9A9A9;//black; //
    --background-product-text-light: #000000;
    --background-product-text-dark: #FFFFFF; //
    --background-product-description-light: #e2e2e2; //
    --background-product-description-dark: #A1A1A1;
    --shadow-light: #A9A9A9;
    --shadow-dark: black;

    --icon-sun-light: url("assets/icons/main-icons/sun_light.png");
    --icon-sun-dark: url("assets/icons/main-icons/sun_dark.png");
    --icon-moon-light: url("assets/icons/main-icons/moon_light.png");
    --icon-moon-dark: url("assets/icons/main-icons/moon_dark.png");
    --icon-history-light: url("assets/icons/main-icons/history_light.png");
    --icon-history-dark: url("assets/icons/main-icons/history_dark.png");
    --icon-list-light: url("assets/icons/main-icons/list_light.png");
    --icon-list-dark: url("assets/icons/main-icons/list_dark.png");

    //main values
    --main-background: var(--background-light);
    --main-background-hat: var(--background-hat-light);
    --main-background-product: var(--background-product-light);
    --main-background-product-hover: var(--background-product-hover-light);
    --main-background-product-text: var(--background-product-text-light);
    --main-background-product-description: var(--background-product-description-dark);
    --main-shadow: var(--shadow-light);

    --main-icon-sun-moon: var(--icon-sun-dark);
    --main-icon-history: var(--icon-history-dark);
    --main-icon-order: var(--icon-list-dark);
  }

  html,body{
    width:100%;
    height:100%;
    padding:0px;
    margin:0px;
  }

  body::before {
    background: var(--main-background);
    // background-image: url("./assets/fon_day.jpg");
    /* background-size: cover; */
    /* background-repeat: no-repeat; */

    background-size: cover;
    content: ' ';
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    will-change: transform;
    z-index: -1;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #2c3e50;

    /* height: 100%; */
    width: 100%;
    margin: 0px;
    user-select: none; 
  }

  .hat {
    position: fixed;
    top: 0px;
    left: 0px;
    display:flex;
    flex-direction:row;
    width: 100%;
    height: 40px;
    background-color: var(--main-background-hat);//#484848;
    box-shadow: 0px 1px 3px var(--main-shadow)// #A9A9A9;
  }

  .hat-history {
    cursor:pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 0 0 18px;
    color: var(--main-background-product-text);
  }

  .hat-history-img {
    width: 22px;
    height: 22px;
    margin: 0 6px 0 0;
    background: var(--main-icon-history) center/cover;
  }

  .hat-order-img {
    width: 22px;
    height: 22px;
    margin: 0 6px 0 0;
    background: var(--main-icon-order) center/cover;
  }

  .hat-right {
    position: absolute;
    right: 0;
    display:flex;
    flex-direction:row;
    margin: 0 18px 0 0;
  }
  .hat-dark-light {
    cursor:pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 8px 0 0;
    color: var(--main-background-product-text);
  }

  .hat-dark-light-img {
    width: 22px;
    height: 22px;
    margin: 9px 6px 9px 0;
    background: var(--main-icon-sun-moon) center/cover;
  }

  .hat-current-time {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 0 0 18px;
    color: var(--main-background-product-text);
  }

  .separator {
    background-color: gray;
    width: 1px;
    height: 100%;
  }

  /* .hat:hover {
    opacity: 1;
  } */

  /* @keyframes hatOpacity {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  } */

  .menu {
    /* margin: 0.25rem; */
  }

  /* .settings {
    width: 35px;
    height: 35px;
    margin: 0.5rem 0.8rem 0px 0px;
    float: right;
  } */

  .user {
    width: 35px;
    height: 35px;
    margin: 0.5rem 0.8rem 0px 0px;
    float: right;
  }

  /* .background {
    height: 100%;
    width: 100%;
    margin: 0;
  } */

  /* .connection-status {
    margin: 0.5rem 0.8rem 0px 0px;
    float: right;

    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #424242;
    box-shadow: 0px 1px 3px;
  } */

  .board {
    /* width: 70rem; */
    /* width: calc(100% - 200px); */
    /* height: calc(100vh - 250px); */
    position: absolute;
    top:40px;
    padding-top:6px;
    height: calc(100vh - 40px);
    width:100%;
    /* width:100vw; */
    /* min-width: 20rem; */
    /* margin: 3.5rem auto 0px; */
    /* padding: 100px auto; */
    
    display: flex;
    justify-content: space-between;
  }

  .cooking-list {
    width: 100%;
  }

  .done-list {
    width: 100%;
  }

</style>

