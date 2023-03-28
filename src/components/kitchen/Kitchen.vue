<template>
  <div class="kitchen-background">
    <template>
      <div class="order" v-for="(order, index) in orders" :key="index + '1'">
        <!-- <div class="order-title" v-if="!!order.table && !!order.table.name">Замовлення: {{ order.orderId }} - {{ order.table.name }} - {{ order.dateTime }}</div>
        <div class="order-title" v-else>Замовлення: {{ order.orderId }} - {{ order.dateTime }}</div> -->
        <div class="order-hat">
          <div class="order-title">Замовлення: {{ order.orderId }}</div>
          <div class="order-creation-time">{{ order.dateTime }}</div>
          <div class="order-table" v-if="order.table">Cтіл: {{ order.table.name }}</div>
        </div>
        <div class="products">
          <div v-for="(group, gIndex) in order.productGroups" :key="gIndex + '2'">
            <div class="group" v-if="order.productGroups.length> gIndex">
              <div v-if="gIndex == 0" class="group-name">Перша черга</div>
              <div v-else-if="gIndex == 1" class="group-name">Друга черга</div>
              <div v-else-if="gIndex == 2" class="group-name">Третя черга</div>
              <div v-else-if="gIndex == 3" class="group-name">Четверта черга</div>
              <div v-else-if="gIndex == 4" class="group-name">По готовності</div>
              <div class="group-line"></div>
            </div>
            <div v-for="(product, pIndex) in group.products" :key="pIndex + '3'">
                <div class="product-row" v-if="filterProducts(product)">
                  <div class="product" @click="onProductClick(order.orderId, product)">                                   
                    <div class="product-count" v-if="product.count && product.count > 1">
                      {{ product.count }}</div> 
                    <div class="product-main">
                      <div class="product-name">{{product.name}}</div>
                      <div class="product-timer" v-if="product.cookingTime">{{ formatTime(product.cookingTime) }}</div>
                    </div>
                  </div>
                  <div v-if="product.status == 'new'" :class="['product-btn-status', 'product-btn-new']" @click="setProductStatus(order.orderId, product.uniqueId, 'prepare')">Новий</div>
                  <div v-else-if="product.status == 'prepare'" :class="['product-btn-status', 'product-btn-prepare']" @click="setProductStatus(order.orderId, product.uniqueId, 'ready')">Готується</div>
                  <div v-else-if="product.status == 'ready'" :class="['product-btn-status', 'product-btn-ready']" @click="setProductStatus(order.orderId, product.uniqueId, 'done')">Готово</div>
                  <div v-else-if="product.status == 'done'" :class="['product-btn-status', 'product-btn-done']">Забрали</div>
                </div>
              </div>
          </div>
        </div>
        <div class="order-bottom">
          <div class="order-cancel" @click="cancelOrder(order.orderId)">Скасувати</div>
        </div>
      </div>
    </template>
    <ProductView v-if="isProductView" 
      :orderId="slectedOrderId"
      :product="selectedProductItem" 
      @onClose="isProductView = false" 
      @onStatus="(obj) => setProductStatus(obj.orderId, obj.uniqueId, obj.status)" 
      @onCancel="(obj) => cancelProduct(obj.orderId, obj.uniqueId)"/>
  </div>
</template>

<script>
import axios from 'axios';
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import ProductView from "@/components/kitchen/ProductView"
import { store } from '../../store/store';

let stompClient = null;

export default {
  components:{
    ProductView,
  },
  computed: {
    currentWorkshop() {
      return store.workshop;
    },
    currentCategory() {
      return store.category;
    }
  },
  watch: {
    currentWorkshop(val, oldVal) {
      console.log(`workshop ${val} updated`)
    },
    currentCategory(val, oldVal) {
      console.log(`category ${val} updated`)
    }
  },
  methods: {
    onProductClick(orderId, product) {
      this.slectedOrderId = orderId;
      this.selectedProductItem = product;
      this.isProductView = true;
    }, 
    connect() {
      let $this = this;
      var socket = new SockJS('https://localhost/kitchen-screen/inner-ws');
      stompClient = Stomp.over(socket);
      stompClient.connect({}, function (frame) {
        stompClient.subscribe('/terminal-topic', function (request) {
          console.log("request", request)
          let reqObj = JSON.parse(request.body);
          console.log("reqObj", reqObj)
          switch(reqObj.command) {
            case "add_order": {
              let order = reqObj.order;
              console.log("order", order);
              $this.orders[order.orderId] = order;
              $this.$forceUpdate();
              break;
            }
            case "set_product_status": {
              let changeStatus = reqObj.changeStatus
              let orderId = changeStatus.orderId;
              let uniqueId = changeStatus.uniqueProductId;
              let status = changeStatus.status;
              let order = $this.orders[orderId];
              let isOrderDone = true;
              order.productGroups.forEach(function(group, gIndex) {
                group.products.forEach(function(product, pIndex) {
                  if(product.uniqueId == uniqueId) {
                    //timer
                    if(product.status != status) {
                      if(status == "new") {
                        $this.restoreTimer(orderId, uniqueId);
                      } else if(status == "prepare") {
                        $this.startTimer(orderId, uniqueId);
                      } else if(status == "ready") {
                        $this.stopTimer(orderId, uniqueId);
                      } else if(status == "done") {
                        $this.stopTimer(orderId, uniqueId);
                      }
                    }
                    product.status = status;                  
                  }
                  if(product.status != "done") {
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
            case "cancel_order": {
              let orderId = reqObj.orderId
              delete $this.orders[orderId];
              $this.$forceUpdate();
              break;
            }
            case "cancel_product": {
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
            case "set_workshops": {
              let workshops = reqObj.workshops;
              store.workshops = workshops;
              localStorage.setItem("workshops", JSON.stringify(workshops));
              break;
            }
            case "set_categories": {
              let categories = reqObj.categories;
              store.categories = categories;
              localStorage.setItem("categories", JSON.stringify(categories));
              break;
            }
          }
        });
      });
    },
    cancelOrder(orderId) {
      delete this.orders[orderId];
      this.$forceUpdate();

      stompClient.send("/kitchen-screen/terminal/cancel", orderId, {})
    },
    cancelProduct(orderId, uniqueId) {
      let order = this.orders[orderId];
      order.productGroups.forEach(function(group, gIndex) {
        group.products.forEach(function(product, pIndex) {
          if(product.uniqueId == uniqueId) {
            order.productGroups[gIndex].products.splice(pIndex, 1);
          }
        })
      });
      this.orders[orderId] = order;
      this.$forceUpdate();

      stompClient.send("/kitchen-screen/terminal/cancelProduct", JSON.stringify({
          'orderId': orderId,
          'uniqueProductId': uniqueId
      }), {})
    },
    setProductStatus(orderId, uniqueId, status) {
      var $this = this;
      console.log("setProductStatus", orderId, uniqueId, status)
      let order = this.orders[orderId];
      let isOrderDone = true;
      order.productGroups.forEach(function(group, gIndex) {
        group.products.forEach(function(product, pIndex) {
          if(product.uniqueId == uniqueId) {
            //timer
            if(product.status != status) {
              if(status == "new") {
                $this.restoreTimer(orderId, uniqueId);
              } else if(status == "prepare") {
                $this.startTimer(orderId, uniqueId);
              } else if(status == "ready") {
                $this.stopTimer(orderId, uniqueId);
              } else if(status == "done") {
                $this.stopTimer(orderId, uniqueId);
              }
            }
            product.status = status;
          }
          if(product.status != "done") {
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
    },
    getAll() {
      console.log("getAll")
      axios.get('https://localhost/kitchen-screen/orders/getAll')
        .then(response => {
          this.orders = response.data;
          this.$forceUpdate();
        })
    },
    filterProducts(product) {
      return (this.currentWorkshop == '' || product.workshop.id == this.currentWorkshop) && (this.currentCategory == '' || product.category.id == this.currentCategory);
    },
    startTimer(orderId, uniqueId) {
      let order = this.orders[orderId];
      order.productGroups.forEach(function(group, gIndex) {
        group.products.forEach(function(product, pIndex) {
          if(product.uniqueId == uniqueId) {
            if(!product.isTimerStarted) {
              product.cookingTimeOriginal = product.cookingTime;
              if(product.count > 1) {
                product.cookingTime = product.cookingTime * product.count
              }
              product.isTimerStarted = true;
              var interval = setInterval(() => {
                product.cookingTime--;
              }, 1000);
              product.timerInterval = interval;
              return;
            }
          }
        })
      })
      this.$forceUpdate();
    },
    stopTimer(orderId, uniqueId) {
      let order = this.orders[orderId];
      order.productGroups.forEach(function(group, gIndex) {
        group.products.forEach(function(product, pIndex) {
          if(product.uniqueId == uniqueId) {
            if(product.isTimerStarted) {
              product.isTimerStarted = false;
              clearInterval(product.timerInterval)
              return; 
            }
          }
        })
      })
      this.$forceUpdate();
    },
    restoreTimer(orderId, uniqueId) {
      let order = this.orders[orderId];
      order.productGroups.forEach(function(group, gIndex) {
        group.products.forEach(function(product, pIndex) {
          if(product.uniqueId == uniqueId) {
            if(product.isTimerStarted) {
              if(product.cookingTimeOriginal !== undefined) {
                product.cookingTime = product.cookingTimeOriginal;
              }
              product.isTimerStarted = false;
              clearInterval(product.timerInterval)
              return;
            }
          }
        })
      })
      this.$forceUpdate();
    },
    formatTime(seconds) {
      if(seconds > 0) {
        return new Date(seconds * 1000).toISOString().slice(11, 19);
      } else if(seconds == 0) {
        return "00:00:00"
      } else {
        return "-" + new Date(Math.abs(seconds) * 1000).toISOString().slice(11, 19);
      }
    }
  },
  created() {
    // this.getAll()
  },
  mounted() {
    this.getAll()
    this.connect()
  },
  data(){
    return {
      isProductView: false,
      slectedOrderId: "",
      selectedProductItem: {},
      orders: {},
      ordersTimer: {},
      // currentWorkshop: "",
      // workshops: {}
    }
  }
}
</script>

<style scoped lang="scss">

.kitchen-background {
  display: flex;
  justify-content: flex-start;
  width:100%;
  height: 100%;
  padding: 4px 6px;
  overflow-y: auto;
}

.group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 7px 0;
  // padding-right: 20px;
}

.group-name {
  white-space: nowrap;
  font-size: 14px;
  color: var(--main-background-product-text);
  // flex-basis: auto;
}

.group-line {
  margin-top: 0.6em;
  margin-left: 5px;
  width: 100%;
  color: var(--main-background-product-text);
  border-top: 1px solid gray;
}

// .group-line:after {
//   content: "";
//   display: block;
//   border-bottom: 1px solid black;
//   margin-top: 5px;
// }

.order-line {
    border-bottom: 2px solid gray;
    margin: 0 7px;
    padding-right: 20px;
}

.products {
  // padding: 0 0 0 8px;
  overflow-y: scroll;
  max-height: calc(100vh - 150px);
  padding-right: 20px;
  margin-bottom: 6px;
}

// .order-title {
//   width:500px;
//   line-height: 16px;
//   font-size: 14px;
//   color: var(--main-background-product-description);
//   padding-bottom: 4px;
//   padding-right: 20px;
// }
.order-hat {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 50px;
  color: var(--main-background-product-text);
  // padding-bottom: 4px;
  padding-right: 20px;
}

.order-title {
  font-size: 16px;
}

.order-creation-time {
  font-size: 13px;
}

.order-table {
  order: 1;
  flex-basis: 100%;
  font-size: 13px;
}

.order {
  width:400px;
  margin: 0 12px;
}

.order-bottom {
  // padding: 0 0 0 8px;
  padding-right: 20px;
}

.order-cancel {
  cursor: pointer;
  color: var(--main-background-product-text);
  width: 100%;
  text-align: center;
  padding: 2px 5px 2px;
  // margin: 9px 0 3px;
  background: var(--main-background-product);
  border-radius: 3px;
  border: solid 1px var(--main-background-product-text);
}

.product-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 46px;
  font-size: 18px;
  margin: 0 0 10px 0;
  background: var(--main-background-product);
  border-radius: 3px 4px 4px 3px;
  box-shadow: 0px 2px 3px var(--main-shadow);
}

.product {
  cursor: pointer;
  display: flex;
  height: 46px;
  width: 100%;
  color: var(--main-background-product-text);
}

.product-count {
  cursor: pointer;
  width: 45px;
  height: 46px;
  color: var(--main-background-product-text);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 3px 0 0 3px;
  border-right: solid 1px var(--main-background-product-text);
}

.product-count:hover {
  border-radius: 3px 0 0 3px;
  background:var(--main-background-product-hover);
}

.product-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width:100%;
  padding: 0 8px;
}

.product-main:hover {
  background:var(--main-background-product-hover);
}

.product-name {
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  -webkit-box-orient: vertical;
}

.product-timer {
  // margin: 0 8px;
  color: var(--main-background-product-text);
  font-size: 12px;
  // line-height: 45px;
}

.product-btn-status {
  cursor: pointer;
  width: 120px;
  height: 46px;
  line-height: 46px;
  text-align: center;
}

.product-btn-new {
  color: black;
  background: #cac9c9;
  border-radius: 0 3px 3px 0;
}

.product-btn-new:hover {
  background: #cac9c9;
}

.product-btn-prepare {
  color: white;
  background: #ffc107;
  border-radius: 0 3px 3px 0;
}

.product-btn-prepare:hover {
  background: #ffc107;
}

.product-btn-ready {
  color:white;
  background: #D9534F;
  border-radius: 0 3px 3px 0;
}

.product-btn-ready:hover {
  background: #D9534F;
}

.product-btn-done {
  cursor: default;
  color: #28A745;
  border-radius: 0 3px 3px 0;
}

// .start-timer {
//   cursor: pointer;
//   font-size: 14px;
//   line-height: 45px;
//   width: 25px;
//   margin-left: 4px;
// }

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

