<template>
  <div>
    <div class="product-view-background" @click="onClose"/>
    
    <div class="product-view-dialog">
      <div class="dialog-hat">
        <div class="product-name">{{product.name}}</div>
        <div class="dialog-close" @click="onClose"/>
      </div>
      
      <div class="dialog-content">
        <div class="statuses">Статуси
          <div class="status-new" @click="setStatus('NEW')">Новий</div>
          <div class="status-prepare" @click="setStatus('PREPARE')">Готується</div>
          <div class="status-ready" @click="setStatus('READY')">Готово</div>
          <div class="status-done" @click="setStatus('DONE')">Забрали</div>
        </div>
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
      orderId:String,
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
      setStatus(status) {
        console.log("setStatus", status)
        let uniqueId = this.product.uniqueId;
        this.$emit('onStatus', {'orderId': this.orderId, 'uniqueId':uniqueId, 'status':status});
      },
      onClose() {
        this.$emit('onClose');
      },
    },
    computed: {
        
    },
  }
</script>

<style scoped lang="scss">

.product-name {
  margin-left: 14px;
  font-size: 18px;
  display: inline;
}

.statuses {
  width: 150px;
  text-align: center;
}

.status-new {
  color:white;
  text-align: center;
  padding: 2px 5px 2px;
  margin: 3px 0 3px;
  background: #283ba7;
  border-radius: 3px;
}
.status-new:hover {
  background: #265288;
}
.status-prepare {
  color:white;
  text-align: center;
  padding: 2px 5px 2px;
  margin: 3px 0 3px;
  background: #FFC107;
  border-radius: 3px;
}
.status-prepare:hover {
  background: #eeb509;
}
.status-ready {
  color:white;
  text-align: center;
  padding: 2px 5px 2px;
  margin: 3px 0 3px;
  background: #28A745;
  border-radius: 3px;
}
.status-ready:hover {
  background: #26883d;
}
.status-done {
  color:white;
  text-align: center;
  padding: 2px 5px 2px;
  margin: 3px 0 3px;
  background: gray;
  border-radius: 3px;
}
.status-done:hover {
  background: darkgray;
}

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
  top: 15%;
  //left: calc((100% - 700px)/2);
  left: calc((100% - 450px)/2);
  width: 450px;
  margin: 0 auto;
  z-index: 56;
  background: var(--main-background-product);
  color: var(--main-background-product-text);
  border-radius: 3px;
  box-shadow: 0 1px 3px var(--main-shadow), 0 1px 2px var(--main-shadow);
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
  // text-align: left;
  display: flex;
  width: 100%;
  height: 35px;
  line-height: 40px;
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
  background: var(--main-icon-close) center/cover;
}
.dialog-close:hover {
  background-color: darkgray//#BEBEBE;
}
.dialog-content {
  margin: 8px 4px 0 16px;
  overflow-y: auto;
  height: 180px;
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
