<template>
  <div class="order-sort">
    <Order :order="order"/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
    <Order/>
  </div>
</template>

<script>
  import Order from '@/components/kitchen/Order'

  import axios from 'axios';
  import store from "@/store/store";
  import { mapState } from 'vuex';

  export default {
    data(){
      return {
        order: {
      "id": 1,
      "status": "ready",
      "comment": "Коментарий к заказу",
      "commentPrintBegunok": true,
      "commentPrintCheck": false,
      "client": false,
      "checkout": {
        "orders_id": 1,
        "name": null,
        "time": "22:00:00",
        "date": "21.02.2100",
        "discount": null,
        "products": [
          {
            "id": 1,
            "title": "dada",
            "count": 1,
            "status": "new",
            "mods": [],
            "additionally": [],
            "price": 24,
            "price_out": 200,
            "comment": null
          },
          {
            "id": 2,
            "title": "Шашлык",
            "count": 1,
            "additionally": [],
            "status": "done",
            "mods": [],
            "price": 24,
            "price_out": 200,
            "comment": null
          }
        ]
      }
    },
      }
    },
    computed: {
    },
    components:{
      Order,
    }
  }
</script>

<style scoped lang="scss">
.order-sort {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  // flex-flow: row;
  height: 100%;
  width: calc(100% - 2px);
  user-select: none;
  overflow-y: auto;
}

::-webkit-scrollbar {
  width: 4px;
  height: 100%;
  position: absolute;
  top: 40px;
  margin: 0 4px;
}
 ::-webkit-scrollbar-thumb {
  background: rgba(215, 217, 221, 0.7);
  border-radius: 100px;
}
 ::-webkit-scrollbar-track {
  position: absolute;
}
</style>
