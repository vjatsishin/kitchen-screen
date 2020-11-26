<template>
  <div>
    <div class="product-view-background" @click="onClose"/>
    
    <div class="product-view-dialog">
      <div class="dialog-hat">
        <!-- <label class="dialog-title">Блюдо</label> -->
        <label>{{product.name}}</label>
        <img class="dialog-close" src="@/assets/icons/ic_close.png" @click="onClose"/>
      </div>
      
      <div class="dialog-content">
        <!-- <div v-for="(item, index) in product.modifiers" :key="index">
          {{item.name}}{{item.net}}{{item.gross}}
        </div> -->

        <table style="width:100%; margin:4px 0;">
          <tr>
            <th>Наименование</th>
            <th>Нетто</th>
            <th>Брутто</th>
          </tr>
          <tr v-for="(item, index) in product.modifiers" :key="index">
            <td>{{item.name}}</td>
            <td>{{item.net}}</td>
            <td>{{item.gross}}</td>
          </tr>
        </table>

        <div style="width:100%; margin:4px 0;">
          <b>Рецепт</b>
          <div>{{product.reciept}}</div>
        </div>
      </div>  
      <div style="height: 35px; padding: 8px 2rem;">
        <button class="dialog-save btn btn-primary" @click="onClose">{{$t("close")}}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import store from "@/store/store";
  import { mapState } from 'vuex';

  export default {
    props: {
      product:Object,
    },
    data(){
      return {

      }
    },
    created() {
      console.log("product:", this.product)
    },
    methods: {
      onClose() {
        this.$emit('onClose');
      },
    },
    computed: {
        
    },
  }
</script>

<style scoped lang="scss">

.product-view-background {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  z-index: 2;
  background-color: black;
  /* opacity: 0.7; */
  opacity: 0.4;
}
.product-view-dialog {
  user-select:none;
  position: fixed;
  top: 10%;
  left: calc((100% - 700px)/2);
  width: 700px;
  // min-height: 100px;
  // min-height: 200px;
  // height: 300px;
  z-index: 3;
  background-color: white;
  color: black;
  border-radius: 3px;
  /* // border-radius: 25px; */
  /* // border-radius: 15px; */
  /* // box-shadow: 5px 5px 5px; */
  box-shadow: 0 1px 3px rgba(0,0,0,0.24), 0 1px 2px rgba(0,0,0,0.48);
  animation: 250ms ease-in-out 0s 1 slideInFromBottom;
}
@keyframes slideInFromBottom {
  0% {
    transform: translateY(200%);
  }
  100% {
    transform: translateY(0%);
  }
}
.dialog-hat {
  text-align: left;
  width: 100%;
  height: 55px;
  line-height: 55px;
  font-size: 20px;
}
.dialog-title {
  font-size: 2.0rem;
  padding: 0px;
  margin: 8px 0px 0px;
}
.dialog-close {
  position: absolute; 
  right: 0px;
  width: 28px;
  height: 28px;
  /* // float: right; */
  margin: 6px;
  padding: 4px;
  border-radius: 50%;
}
.dialog-close:hover {
  background: #BEBEBE;
}
.dialog-content {
  /* // display: flex;
  // flex-direction: column;
  // justify-content: flex-start; */
  padding: 8px 2rem;
  /* text-align:left !important; */
  overflow-y: auto;
  height: 200px;
  // max-height: calc(80vh - 55px - 51px);
}
.dialog-setting-title {
  padding: 0px;
  margin: 0px 0px 4px;
  font-size: 1.2rem;
}

::-webkit-scrollbar {
  width: 4px;
  height: 100%;
  position: absolute;  
}
 ::-webkit-scrollbar-thumb {
  background: rgba(47, 49, 54, 0.7);
  border-radius: 100px;
}
 ::-webkit-scrollbar-track {
  position: absolute;
}

</style>
