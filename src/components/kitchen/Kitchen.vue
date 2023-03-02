<template>
  <div class="kitchen-background">
    <template>
      <div class="order-table" v-for="(order, index) in orders" :key="index + '1'">
        <div class="order-table" v-if="!!order.table">Замовлення: {{ order.orderId }} - {{order.table}}</div>
        <div class="order-table" v-else>Замовлення: {{ order.orderId }} </div>
        <div class="order">
          <div v-for="(group, gIndex) in order.productGroups" :key="gIndex + '2'">
            <div v-for="(product, pIndex) in group.products" :key="pIndex">
              <!-- <div class="inline-flex"> -->
                <div class="product-row">
                  <div class="product">
                    <div class="product-main" v-ripple="'rgba(255, 255, 255, 0.25)'" @click="onProductClick(order.orderId, product)">
                      <!-- <div class="product-main-item">
                        <div class="product-main-item-description">Час</div>
                        <div class="product-time">{{product.time}}</div>
                      </div> -->
                      <div class="product-main-name">
                        <!-- <div class="product-main-item-description">Назва</div> -->
                        <div class="product-name">{{product.name}}</div>
                      </div>
                      <!-- <div class="product-main-item" v-if="product.cookingTime">
                        <div class="product-main-item-description">Залишковий час</div>
                        <div class="product-clock">00:35</div>
                      </div> -->
                    </div>
                    <div v-if="product.status == 'NEW'" class="product-btn-new" @click="setProductStatus(order.orderId, product.uniqueId, 'PREPARE')">Новий</div>
                    <div v-else-if="product.status == 'PREPARE'" class="product-btn-cooking" @click="setProductStatus(order.orderId, product.uniqueId, 'READY')">Готується</div>
                    <div v-else-if="product.status == 'READY'" class="product-btn-ready" @click="setProductStatus(order.orderId, product.uniqueId, 'DONE')">Готово</div>
                    <div v-else-if="product.status == 'DONE'" class="product-btn-done">Забрали</div>
                  </div>
                  <!-- <div style="width: 100px;">
                    <div class="product-clock2" v-if="product.cookingTime">00:35</div>
                  </div> -->
                </div>
              </div>
              <div v-if="order.productGroups.length - 1 > gIndex" class="group-line"></div>
          </div>
        </div>
      </div>
    </template>
    <ProductView v-if="isProductView" 
      :orderId="slectedOrderId"
      :product="selectedProductItem" 
      @onClose="isProductView = false" 
      @onStatus="(obj) => setProductStatus(obj.orderId, obj.uniqueId, obj.status)" />
  </div>
</template>

<script>

import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import ProductView from "@/components/kitchen/ProductView"

let stompClient = null;

export default {
  components:{
    ProductView,
  },
  computed: {
    // isHistory() {
    //   return store.isHistory;
    // }
  },
  methods: {
    onProductClick(orderId, product) {
      this.slectedOrderId = orderId;
      this.selectedProductItem = product;
      this.isProductView = true;
    }, 
    connect() {
      let $this = this;
      var socket = new SockJS('http://localhost:8082/inner-ws');
      stompClient = Stomp.over(socket);
      stompClient.connect({}, function (frame) {
        stompClient.subscribe('/terminal-topic', function (request) {
          console.log("request", request)
          let reqObj = JSON.parse(request.body);
          console.log("reqObj", reqObj)
          switch(reqObj.command) {
            case "ADD_ORDER": {
              let order = reqObj.order;
              $this.orders[order.orderId] = order;
              $this.$forceUpdate();
              break;
            }
            case "SET_PRODUCT_STATUS": {
              let changeStatus = reqObj.changeStatus
              let orderId = changeStatus.orderId;
              let uniqueProductId = changeStatus.uniqueProductId;
              let status = changeStatus.status;
              let order = $this.orders[orderId];
              let isOrderDone = true;
              order.productGroups.forEach(function(group, gIndex) {
                group.products.forEach(function(product, pIndex) {
                  if(product.uniqueId == uniqueProductId) {
                    order.productGroups[gIndex].products[pIndex].status = status;
                  }
                  if(order.productGroups[gIndex].products[pIndex].status != "DONE") {
                    isOrderDone = false;
                  }
                })
              });
              if(!isOrderDone) {
                $this.orders[orderId] = order;
              } else {
                delete $this.orders[orderId];
              }
              $this.$forceUpdate();
              break;
            }
            case "CANCEL_ORDER": {
              let orderId = reqObj.orderId
              delete $this.orders[orderId];
              $this.$forceUpdate();
              break;
            }
            case "CANCEL_PRODUCT": {
              let changeStatus = reqObj.changeStatus
              let orderId = changeStatus.orderId;
              let uniqueProductId = changeStatus.uniqueProductId;
              let order = $this.orders[orderId];
              order.productGroups.forEach(function(group, gIndex) {
                group.products.forEach(function(product, pIndex) {
                  if(product.uniqueId == uniqueProductId) {
                    // delete order.productGroups[gIndex].products[pIndex];
                    order.productGroups[gIndex].products.splice(pIndex, 1);
                  }
                })
              });
              $this.orders[orderId] = order;
              console.log($this.orders)
              $this.$forceUpdate();
              break;
            }
          }
        });
      });
    },
    cancelOrder(orderId) {
      //todo
    },
    cancelProduct(orderId, uniqueId) {
      //todo
    },
    setProductStatus(orderId, uniqueId, status) {
      console.log("setProductStatus", orderId, uniqueId, status)
      let order = this.orders[orderId];
      let isOrderDone = true;
      order.productGroups.forEach(function(group, gIndex) {
        group.products.forEach(function(product, pIndex) {
          if(product.uniqueId == uniqueId) {
            order.productGroups[gIndex].products[pIndex].status = status;
          }
          if(order.productGroups[gIndex].products[pIndex].status != "DONE") {
            isOrderDone = false;
          }
        })
      });
      if(!isOrderDone) {
        this.orders[orderId] = order;
      } else {
        delete this.orders[orderId];
      }
      this.$forceUpdate();

      stompClient.send("/kitchen-screen/terminal/setProductStatus", JSON.stringify({
          'orderId': orderId,
          'uniqueProductId': uniqueId,
          'status': status
      }), {})
    }
  },
  mounted() {
    this.connect()
  },
  data(){
    return {
      isProductView: false,
      slectedOrderId: "",
      selectedProductItem: {},
      orders: {}
    }
  }
}
</script>

<style scoped lang="scss">

.group-line {
    border-bottom: 2px dashed gray;
    margin: auto;
    margin-bottom: 7px;
    width: 99%;
}

.kitchen-background {
  // background:  #707070;
  // background: 	#D3D3D3;
  // background: var(--main-background);
  width:100%;
  height: 100%;
  // color: #F5F5F5;
  // zoom: 1.0;
  overflow-y: auto;
}

.order {
  // width:650px;
  max-width:650px;
  min-width:500px;
  margin: auto;
  padding: 0 16px;
}

.order-table {
  // height: 16px;
  // width:650px;
  max-width:650px;
  min-width:500px;
  line-height: 16px;
  font-size: 13px;//12
  // color: #404040;
  color: var(--main-background-product-description);
  margin: 0 auto 2px;
  padding: 0 16px;
}

.product-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  // margin: 0 16px;
}

.product {
  display: flex;
  flex-direction: row;
  height: 46px;
  width: 100%;
  // line-height: 46px;
  font-size: 18px;
  text-align: center;
  margin: 0 0 7px 0;
  // background: #888888;
  background: var(--main-background-product);
  border-radius: 3px 4px 4px 3px;
  box-shadow: 0px 2px 3px var(--main-shadow);// #A9A9A9//#303030;//black;
}

.product-main {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  // color: #404040;
  color: var(--main-background-product-text);
  // line-height: 46px;
  width: calc(100% - 75px);
  transition: 0.2s;
  cursor: pointer;
}

.product-main:hover {
  border-radius: 3px 0 0 3px;
  background:var(--main-background-product-hover);//#A9A9A9;
}

.product-history {
  display: flex;
  flex-direction: row;
  height: 46px;
  // line-height: 46px;
  font-size: 18px;
  text-align: center;
  margin: 0 0 5px 0;
  // background: #888888;
  background: var(--main-background-product);
  border-radius: 3px 4px 4px 3px;
  box-shadow: 0px 2px 3px var(--main-shadow);// #A9A9A9//#303030;//black;
}

.product-history-main {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 46px;
  // color: #404040;
  color: var(--main-background-product-text);
  // line-height: 46px;
  width: 100%;
  transition: 0.2s;
  cursor: pointer;
}

.product-history-main:hover {
  border-radius: 3px 4px 4px 3px;
  background:var(--main-background-product-hover);//#A9A9A9;
}

.product-main-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 8px;
}
.product-main-name {
  // position: relative; 
  // left: 33%;
  // transform: translateX(-50%);
  width:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 8px;
}
.product-history-main-name {
  width:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 8px;
}
.product-main-item-description {
  white-space: nowrap;
  font-size: 10px;
  color: var(--main-background-product-description);
}

.product-name {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  -webkit-box-orient: vertical;
}
.product-time {
  text-align: left;
  // margin: 0 8px;
}
.product-clock {
  text-align: left;
  // margin: 0 8px;
}

.product-btn-cooking {
  width: 120px;
  height: 46px;
  line-height: 46px;
  // text-align: left;
  color:white;
  background: #FFC107;
  border-radius: 0 3px 3px 0;
}

.product-btn-cooking:hover {
  background: #eeb509;
}

.product-btn-ready {
  width: 120px;
  height: 46px;
  line-height: 46px; 
  color:white;
  background: #28A745;
  border-radius: 0 3px 3px 0;
}

.product-btn-ready:hover {
  background: #26883d;
}

.product-btn-new {
  width: 120px;
  height: 46px;
  line-height: 46px; 
  color:white;
  background: #283ba7;
  border-radius: 0 3px 3px 0;
}

.product-btn-new:hover {
  background: #265288;
}

.product-btn-done {
  width: 120px;
  height: 46px;
  line-height: 46px; 
  color: gray;
  border-radius: 0 3px 3px 0;
}

.product-clock2 {
  margin: 0 8px;
  color: var(--main-background-product-text);
  font-size: 18px;
  line-height: 45px;
}

::-webkit-scrollbar {
  width: 4px;
  height: 100%;
  position: absolute;
  // margin: 0 4px;
  padding: 0 4px;
}
::-webkit-scrollbar-thumb {
  // background: rgba(215, 217, 221, 0.7);
  background:#909090;
  border-radius: 100px;
  padding: 0 4px;
}
::-webkit-scrollbar-track {
  position: absolute;
}
</style>

