<template>
  <div>
    <v-carousel
      delimiter-icon="mdi-minus"
      height="300px"
      class="rounded-lg"
      :show-arrows="items.length > 0"
      :continuous="false"
    >
      <v-carousel-item v-for="(item, i) in items" :key="i" :src="item.image">
        <v-row class="ma-3" v-if="item.product">
          <v-col cols="12">
            <product-manager-tile
              :index="i"
              :item="item"
              @choosedImage="choosedImage"
              @unbind="unbind"
              @deleteProduct="deleteProduct"
            />
          </v-col>
        </v-row>
        <div class="text-center ma-3" v-else>
          <v-btn color="red" fab @click="deleteProduct(item)">
            <v-icon color="white">delete</v-icon>
          </v-btn>
          <v-sheet color="success" class="rounded-lg ma-5">
            <all-products-dialog color="white" @selected="bindProduct($event, i)">
            Vincular produto
          </all-products-dialog>
          </v-sheet>
        </div>
        <v-row justify="center">
          <v-sheet
            width="200px"
            class="rounded-lg py-2 text-center"
            v-if="items.length > 1"
          >
            <p>Mover:</p>
            <v-row dense>
              <v-col cols="6">
                <v-btn block text @click="moveTo('left', i)" :disabled="i < 1">
                  <v-icon>arrow_back_ios</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  text
                  block
                  @click="moveTo('right', i)"
                  :disabled="i === items.length - 1"
                >
                  <v-icon>arrow_forward_ios</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-sheet>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                color="primary"
                small
                class="mx-2"
                v-on="on"
                v-bind="attrs"
                @click="changeImage(i)"
              >
                <v-icon large>autorenew</v-icon>
              </v-btn>
            </template>
            <span>Trocar imagem</span>
          </v-tooltip>
        </v-row>
      </v-carousel-item>
      <v-carousel-item v-if="items.length < 1">
        <v-sheet color="second" height="300">
          <centralize>
            <v-row>
              <v-col cols="6">
                <v-btn text @click="openFileDialog">
                  <md-icon color="md-primary">image</md-icon>
                </v-btn>
              </v-col>
              <v-col cols="6">
                <all-products-dialog @selected="addProduct">
                  <md-icon color="md-primary">shopping_bag</md-icon>
                </all-products-dialog>
              </v-col>
            </v-row>
          </centralize>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    <v-sheet
      v-if="items.length > 0"
      color="second"
      height="50px"
      class="pa-2 my-2 rounded-lg"
    >
      <v-row>
        <v-col cols="6">
          <v-btn text block @click="openFileDialog">
            <md-icon color="md-primary">image</md-icon>
          </v-btn>
        </v-col>
        <v-col cols="6">
          <all-products-dialog @selected="addProduct">
            <md-icon color="md-primary">shopping_bag</md-icon>
          </all-products-dialog>
        </v-col>
      </v-row>
    </v-sheet>
    <v-sheet class="rounded-bl-lg rounded-br-lg">
      <v-row>
        <v-col cols="3" v-for="(item, i) in items" :key="i">
          <v-img :src="item.image" width="70px" height="70px" class="border my-2 mx-10 rounded-lg">
            <v-sheet v-if="item.product" color="primary" width="10px" height="10px" class="ma-1 rounded-circle"></v-sheet>
          </v-img>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
import allProductsDialog from "~/components/sections/allProductsDialog.vue";
import ProductManagerTile from "./product-manager-tile.vue";
export default {
  components: { allProductsDialog, ProductManagerTile },
  props: ["items"],
  data() {
    return {
      showDialog: false,
    };
  },
  methods: {
    async bindProduct(event, index){
      this.$emit('bindProduct', {id: event, index});
    },
    deleteProduct(event) {
      this.$emit("deleteProduct", event);
    },
    moveTo(side, index) {
      this.$emit("moveTo", { side, index });
    },
    choosedImage(event) {
      this.$emit("changedImage", {
        index: event.index,
        before: event.before,
        after: event.after,
      });
      this.showDialog = false;
    },
    openFileDialog() {
      this.$emit("openFileDialog");
    },
    addProduct(event) {
      this.$emit("addProduct", event);
    },
    unbind(event) {
      this.$emit("unbind", event);
    },
    changeImage(index) {
      console.log("chamando evento");
      this.$emit("changeByGalley", index);
    },
  },
};
</script>

<style>
</style>