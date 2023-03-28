<template>
  <div>
    <div class="product-view-background" @click="onClose"/>
    
    <div class="product-view-dialog">
      <div class="dialog-hat">
        <div class="dialog-title">{{product.name}}</div>
        <div class="dialog-close" @click="onClose"/>
      </div>
      
      <div class="dialog-content">
        <div class="statuses">Статуси
          <div class="status-new" @click="setStatus('new')">Новий</div>
          <div class="status-prepare" @click="setStatus('prepare')">Готується</div>
          <div class="status-ready" @click="setStatus('ready')">Готово</div>
          <div class="status-done" @click="setStatus('done')">Забрали</div>
          <div class="status-cancel" @click="cancel()">Скасувати</div>
        </div>
      </div>
      <div class="dialog-close-btn" @click="onClose()">Закрити</div>
    </div>
  </div>
</template>

<script>
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
      cancel() {
        this.$emit('onCancel', {'orderId': this.orderId, 'uniqueId':this.product.uniqueId});
        this.onClose();
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
  overflow: hidden;
  white-space: nowrap; /* Don't forget this one */
  text-overflow: ellipsis;
}

.statuses {
  width: 150px;
  text-align: center;
}

.status-new {
  cursor: pointer;
  color:white;
  text-align: center;
  padding: 2px 5px 2px;
  margin: 3px 0 3px;
  background: #cac9c9;
  border-radius: 3px;
}
.status-new:hover {
  background: #cac9c9;
}
.status-prepare {
  cursor: pointer;
  color:white;
  text-align: center;
  padding: 2px 5px 2px;
  margin: 3px 0 3px;
  background: #ffc107;
  border-radius: 3px;
}
.status-prepare:hover {
  background: #ffc107;
}
.status-ready {
  cursor: pointer;
  color:white;
  text-align: center;
  padding: 2px 5px 2px;
  margin: 3px 0 3px;
  background: #D9534F;
  border-radius: 3px;
}
.status-ready:hover {
  background: #D9534F;
}
.status-done {
  cursor: pointer;
  color:white;
  text-align: center;
  padding: 2px 5px 2px;
  margin: 3px 0 3px;
  background: #28A745;
  border-radius: 3px;
}
.status-done:hover {
  background: #28A745;
}

.status-cancel {
  cursor: pointer;
  color: var(--main-background-product-text);
  text-align: center;
  margin: 6px 0 3px;
  background: var(--main-background-product);
  border-radius: 3px;
  border: solid 1px var(--main-background-product-text);
}
.status-cancel:hover {
  background: var(--main-background-product);
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
  left: calc((100% - 230px)/2);
  width: 270px;
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
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  margin: 8px;
}
.dialog-title {
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 18px;
  padding-right: 28px;
  // margin: 8px 8px 0px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dialog-close {
  cursor: pointer;
  position: absolute; 
  right: 0px;
  width: 28px;
  height: 28px;
  /* // float: right; */
  // margin: 6px;
  // padding: 4px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--main-icon-close) center/cover;
}

.dialog-close:hover {
  // background: var(--main-reversed-icon-close) center/cover;
  background-color: lightgray//#BEBEBE;
}
.dialog-content {
  margin: 8px 4px 0 16px;
  overflow-y: auto;
}

.dialog-setting-title {
  padding: 0px;
  margin: 0px 0px 4px;
  font-size: 1.2rem;
}

.dialog-close-btn {
  cursor: pointer;
  color: var(--main-background-product-text);
  width: 100px;
  text-align: center;
  padding: 2px 5px 2px;
  margin: 8px 0 20px 16px;
  background: var(--main-background-product);
  border-radius: 3px;
  border: solid 1px var(--main-background-product-text);
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
