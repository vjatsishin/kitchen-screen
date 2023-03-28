<template>
  <div id="app">
    <!-- <SettingsDialog v-if="isSettingsDialog && appType && !isFirstStart" @onClose="onSettingsClose"/> && isAuthenticated && isInited -->
    <!-- <InfoDialog v-if="isFirstStart" @onClose="isFirstStart = false"/> -->
  
    <div>
      <div class="hat">
        <div class="hat-history" @click="displayHistory()">
          <!-- <template v-if="!!isHistory">
            <div class="hat-history-img"/>
            <div>Історія</div>
          </template> -->
          <template>
            <div class="hat-order-img"/>
            <div>Замовлення</div>
          </template>
        </div>

        <div class="hat-workshop">
            Цех:&nbsp;
            <select class="theme-select" v-model="currentWorkshop">
                <option v-for="(workshop, index) in workshops" :value="workshop.id" :key="index">{{workshop.name}}</option>
            </select>
        </div>

        <div class="hat-category">
            Категорія:&nbsp;
            <select class="theme-select" v-model="currentCategory">
                <option v-for="(category, index) in categories" :value="category.id" :key="index">{{category.name}}</option>
            </select>
        </div>

        <div class="hat-right">
          <div class="hat-dark-light" @click="changeTheme()">
            <div class="hat-dark-light-img"/>
            <div v-if="currentTheme == 'dark'">Ніч</div>
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
  import { store } from "@/store/store.js";
  import { setTimeout } from 'timers';
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
        currentTime:"00:00",
        currentWorkshop: "",
        currentCategory: "",
        // workshops: [
        //   {id:"", name: "Всі"},
        //   {id:"1", name: "Бар"},
        //   {id:"2", name: "Кухня"}
        // ],
        // categories: [
        //   {id:"", name: "Всі"},
        //   {id:"1", name: "Напої"},
        //   {id:"2", name: "Страви"}
        // ]
      }
    },
    created(){
      var $this = this;
      store.theme = localStorage.getItem("theme");
      store.workshops = JSON.parse(localStorage.getItem("workshops"))
      store.categories = JSON.parse(localStorage.getItem("categories"))
      this.currentWorkshop = localStorage.getItem("selectedWorkshop") || ""
      this.currentCategory = localStorage.getItem("selectedCategory") || ""
      
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
      // var $this = this;
      this.setTheme();
    },
    computed: {
      isHistory() {
        return store.isHistory;
      },
      currentTheme() {
        return store.theme;
      },
      workshops() {
        let all = [{'id': "", 'name': "Всі"}]
        return [...all||[], ...store.workshops||[]]
      },
      categories() {
        let all = [{'id': "", 'name': "Всі"}]
        return [...all||[], ...store.categories||[]]

      }
    },
    watch: {
      currentWorkshop: function (val, oldVal) {
        store.workshop = val;
        localStorage.setItem("selectedWorkshop", val)
      },
      currentCategory: function (val, oldVal) {
        store.category = val;
        localStorage.setItem("selectedCategory", val)
      },
    },
    methods:{
      changeTheme() {
        if(this.currentTheme == "dark") {
          localStorage.setItem("theme", "light")
          store.theme = "light"
        } else {
          localStorage.setItem("theme", "dark")
          store.theme = "dark"
        }
        this.setTheme();
      },
      setTheme() {
        console.log("setTheme", this.currentTheme)
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
          document.documentElement.style.setProperty('--main-icon-close', getComputedStyle(document.documentElement).getPropertyValue('--icon-close-light'));
          document.documentElement.style.setProperty('--main-reversed-icon-close', getComputedStyle(document.documentElement).getPropertyValue('--icon-close-dark'));
          document.documentElement.style.setProperty('--main-shadow', getComputedStyle(document.documentElement).getPropertyValue('--shadow-dark'));
          document.documentElement.style.setProperty('--main-icon-select', getComputedStyle(document.documentElement).getPropertyValue('--icon-select-light'));
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
          document.documentElement.style.setProperty('--main-icon-close', getComputedStyle(document.documentElement).getPropertyValue('--icon-close-dark'));
          document.documentElement.style.setProperty('--main-reversed-icon-close', getComputedStyle(document.documentElement).getPropertyValue('--icon-close-light'));
          document.documentElement.style.setProperty('--main-shadow', getComputedStyle(document.documentElement).getPropertyValue('--shadow-light'));
          document.documentElement.style.setProperty('--main-icon-select', getComputedStyle(document.documentElement).getPropertyValue('--icon-select-dark'));
        }
      },
      getCurrentTime() {
        let $this = this;
        function getTime () {
          const today = new Date();
          const time = (today.getHours() < 10 ? '0' : '') + today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
          $this.currentTime = time;
        }
        getTime();
        setInterval(() => getTime(), 1000);//1 sec
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
    --icon-close-light: url("assets/icons/main-icons/close_light.png");
    --icon-close-dark: url("assets/icons/main-icons/close_dark.png");
    --icon-select-dark: url("data:image/svg+xml;utf8,<svg fill='black' height='10' width='10' viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'><path d='M505.755,123.592c-8.341-8.341-21.824-8.341-30.165,0L256.005,343.176L36.421,123.592c-8.341-8.341-21.824-8.341-30.165,0s-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251c5.462,0,10.923-2.091,15.083-6.251l234.667-234.667C514.096,145.416,514.096,131.933,505.755,123.592z'/></svg>");
    --icon-select-light: url("data:image/svg+xml;utf8,<svg fill='white' height='10' width='10' viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'><path d='M505.755,123.592c-8.341-8.341-21.824-8.341-30.165,0L256.005,343.176L36.421,123.592c-8.341-8.341-21.824-8.341-30.165,0s-8.341,21.824,0,30.165l234.667,234.667c4.16,4.16,9.621,6.251,15.083,6.251c5.462,0,10.923-2.091,15.083-6.251l234.667-234.667C514.096,145.416,514.096,131.933,505.755,123.592z'/></svg>");

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
    --main-icon-close: var(--icon-close-dark);
    --main-reversed-icon-close: var(--icon-close-light);
    --main-icon-select: var(--icon-select-light);
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
    // font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-family: Helvetica, Arial, sans-serif;
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
    height: 70px;
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

  .hat-workshop {
    cursor:pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 0 0 18px;
    font-size: 18px;
    color: var(--main-background-product-text);
  }

  .hat-category {
    cursor:pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 0 0 18px;
    font-size: 18px;
    color: var(--main-background-product-text);
  }

  .theme-select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: transparent;
    background-image: var(--main-icon-select);
    background-repeat: no-repeat;
    background-position-x: 100%;
    background-position-y: 18px;
    padding: 10px 20px 10px 0;
    border: none;
    color: var(--main-background-product-text);
    cursor: pointer;
  }

  .theme-select option {
    color: black;
  }

  .hat-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 18px 0 auto;
  }

  .hat-dark-light {
    cursor:pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 70px;
    // margin: 0 8px 0 0;
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
    margin-left: 12px;
    color: var(--main-background-product-text);
  }

  .separator {
    background-color: gray;
    width: 1px;
    height: 100%;
  }

  .user {
    width: 35px;
    height: 35px;
    margin: 0.5rem 0.8rem 0px 0px;
    float: right;
  }

  .board {
    position: absolute;
    top:70px;
    padding-top:6px;
    height: calc(100vh - 70px);
    width:100%;
  }

  .cooking-list {
    width: 100%;
  }

  .done-list {
    width: 100%;
  }

</style>

