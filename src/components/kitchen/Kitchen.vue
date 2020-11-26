<template>
  <div class="kitchen-background">
    <template v-if="!isHistory">
      <template v-for="(item, index) in orders">
        <div class="order-table" :key="index + '1'">{{item.table}}</div>
        <div class="order" :key="index + '2'">
          <template v-for="(item2, index2) in item.products">
            <!-- <div class="inline-flex"> -->
              <div class="product-row" :key="index2">
                <div class="product">
                  <div class="product-main" v-ripple="'rgba(255, 255, 255, 0.25)'" @click="onProductClick(item2)">
                    <div class="product-main-item">
                      <div class="product-main-item-description">Время</div>
                      <div class="product-time">{{item2.time}}</div>
                    </div>
                    <div class="product-main-name">
                      <div class="product-main-item-description">Наименование</div>
                      <div class="product-name">{{item2.name}}</div>
                    </div>
                    <!-- <div class="product-main-item" v-if="item2.cookingTime">
                      <div class="product-main-item-description">Остаточное время</div>
                      <div class="product-clock">00:35</div>
                    </div> -->
                  </div>
                  <div v-if="item2.status == 'new'" class="product-btn-cooking">Готовить</div>
                  <div v-else-if="item2.status == 'cooking'" class="product-btn-done">Готово</div>
                </div>
                <div style="width: 100px;">
                  <div class="product-clock2" v-if="item2.cookingTime">00:35</div>
                </div>
              </div>
          </template>
        </div>
      </template>
    </template>
    <template v-else-if="isHistory">
      <template v-for="(item, index) in historyOrders">
        <div class="order-table" :key="index + '1'">{{item.table}}</div>
          <div class="order" :key="index + '2'">
          <div class="product-history" v-for="(item2, index2) in item.products" :key="index2">
            <!-- <div class="inline-flex"> -->
              <div class="product-history-main" v-ripple="'rgba(255, 255, 255, 0.25)'" @click="onProductClick(item2)">
                <div class="product-main-item">
                  <div class="product-main-item-description">Время</div>
                  <div class="product-time">{{item2.time}}</div>
                </div>
                <div class="product-history-main-name">
                  <div class="product-main-item-description">Наименование</div>
                  <div class="product-name">{{item2.name}}</div>
                </div>
              </div>
          </div>
        </div>
      </template>
    </template>
    <ProductView v-if="isProductView" :product="selectedProductItem" @onClose="isProductView = false" />
  </div>
</template>

<script>
import axios from 'axios';
import { store } from "@/store/store.js";
import ProductView from "@/components/kitchen/ProductView"
export default {
  components:{
    ProductView,
  },
  data(){
    return {
      isProductView: false,
      selectedProductItem: {},
      orders: [
        {
          uuid: "", //уникальный id заказа в формате uuid
          name: "",
          time: "",
          date: "",
          table: "Стол: 22",
          products: [
            {
              name: "Семечки",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:26",
              cookingTime: "",
              modifiers: [
                {
                  name:"лушпайки",
                  net:"200",
                  gross:"200",
                },
                {
                  name:"сердцевинка",
                  net:"200",
                  gross:"200",
                },
              ],
              compositions: [],
              reciept: "fahfdsfhs;dfh ыфвар ывфа выарфы в ашрывжватв dsfh dsaf sf sdafh sdfh h fdpdshfpsahfpsd hfpsdfh sfphs dfhs sh fsdhsdfsdhf shf spfh sdfh spfh  spfjd dfs jfdsofjsdlfjdsof jsofdj sdof  osdjf [osdfj ds[j sd[ аарп мшвы яанрпйц хрпючят  мялоыви я выз шаявызш вызщар выз вашз   азпв азптвап",
            },
            {
              name: "Пива",
              status: "cooking", //статус приготовления продукта (new || cooking || done)
              time: "15:26",
              cookingTime: "148822555",
              modifiers: [],
              compositions: [],
            },
          ]
        },
        {
          uuid: "", //уникальный id заказа в формате uuid
          name: "",
          time: "",
          date: "",
          table: "Стол: 44",
          products: [
            {
              name: "Грінки Флінт",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:26",
              cookingTime: "",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Сухарики ыфва авыф авыоа тав пы в а выаоы вташ ва шов",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:26",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
          ]
        },
        {
          uuid: "", //уникальный id заказа в формате uuid
          name: "",
          time: "",
          date: "",
          table: "Стол: 44",
          products: [
            {
              name: "Торт Наполеон",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:45",
              cookingTime: "",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
          ]
        },
      ],

      historyOrders: [
        {
          uuid: "", //уникальный id заказа в формате uuid
          name: "",
          time: "",
          date: "",
          table: "Стол: 22",
          products: [
            {
              name: "Семечки",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:26",
              cookingTime: "",
              modifiers: [
                {
                  name:"лушпайки",
                  net:"200",
                  gross:"200",
                },
                {
                  name:"сердцевинка",
                  net:"200",
                  gross:"200",
                },
              ],
              compositions: [],
              reciept: "fahfdsfhs;dfh ыфвар ывфа выарфы в ашрывжватв dsfh dsaf sf sdafh sdfh h fdpdshfpsahfpsd hfpsdfh sfphs dfhs sh fsdhsdfsdhf shf spfh sdfh spfh  spfjd dfs jfdsofjsdlfjdsof jsofdj sdof  osdjf [osdfj ds[j sd[ аарп мшвы яанрпйц хрпючят  мялоыви я выз шаявызш вызщар выз вашз   азпв азптвап",
            },
            {
              name: "Пива",
              status: "cooking", //статус приготовления продукта (new || cooking || done)
              time: "15:26",
              cookingTime: "148822555",
              modifiers: [],
              compositions: [],
            },
          ]
        },
        {
          uuid: "", //уникальный id заказа в формате uuid
          name: "",
          time: "",
          date: "",
          table: "Стол: 44",
          products: [
            {
              name: "Грінки Флінт",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:26",
              cookingTime: "",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Сухарики ыфва авыф авыоа тав пы в а выаоы вташ ва шов f f f f",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:26",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
          ]
        },
        {
          uuid: "", //уникальный id заказа в формате uuid
          name: "",
          time: "",
          date: "",
          table: "Стол: 44",
          products: [
            {
              name: "Торт Наполеон",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:45",
              cookingTime: "",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
            {
              name: "Бисквит",
              status: "new", //статус приготовления продукта (new || cooking || done)
              time: "15:46",
              cookingTime: "228",
              modifiers: [],
              compositions: [],
            },
          ]
        },
      ],
    }
  },
  computed: {
    isHistory() {
      return store.isHistory;
    }
  },
  methods: {
    // getFormatedTime(sec) {
    //   var hours = Math.floor(sec / 60);
    //   var minutes = Math.floor(sec) - (hours * 60);
    //   var seconds = Math.floor(sec) - (hours * 60) - (minutes * 60);
    //   if(hours > 0) {
    //     return hours + ":" + minutes + ":" + seconds;
    //   } else {
    //     return minutes + ":" + seconds;
    //   }
    // },
    // getFormatedTime(ms) {
    //   if(ms) {
    //     var today = new Date(parseInt(ms));
    //     var h = today.getHours();
    //     var m = today.getMinutes();
    //     var s = today.getSeconds();
    //     console.log("h", h)
    //     console.log("m", m)
    //     console.log("s", s)
    //     return h > 0 ? h + ":" : "" + m + ":" + s;
    //   }
    // },
    onProductClick(item) {
      this.selectedProductItem = item;
      this.isProductView = true;
    }
  },
}
</script>

<style scoped lang="scss">

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
  height: 16px;
  // width:650px;
  max-width:650px;
  min-width:500px;
  line-height: 16px;
  font-size: 12px;
  // color: #404040;
  color: var(--main-background-product-description);
  margin: auto;
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

.product-btn-done {
  width: 120px;
  height: 46px;
  line-height: 46px; 
  color:white;
  background: #28A745;
  border-radius: 0 3px 3px 0;
}

.product-btn-done:hover {
  background: #26883d;
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

