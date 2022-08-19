<template>
  <v-sheet color="transparent">
    <v-container v-if="item.product && product" class="product">
      <v-img
        class="product-image"
        :aspect-ratio="6 / 9"
        :src="item.image"
        max-height="350"
      />
      <h3 class="product-name">
        {{ product.name }}
      </h3>
      <h3 class="product-price" v-if="product.variants">
        R${{
          product.variants.type === "unique"
            ? $store.getters["products/getPrice"](product.variants)
                .toFixed(2)
                .replace(".", ",")
            : $store.getters["products/getPrice"](product.variants).max.toFixed(
                2
              ) ===
              $store.getters["products/getPrice"](product.variants).min.toFixed(
                2
              )
            ? `${$store.getters["products/getPrice"](product.variants)
                .min.toFixed(2)
                .replace(".", ",")}`
            : `${$store.getters["products/getPrice"](product.variants)
                .min.toFixed(2)
                .replace(".", ",")} - ${$store.getters["products/getPrice"](
                product.variants
              )
                .max.toFixed(2)
                .replace(".", ",")}`
        }}
      </h3>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  props: ["item"],
  async beforeMount() {
    if (!this.item.product) {
      return;
    }
    console.log(this.item);
    const response = await this.$axios(`product/get?id=${this.item.product}`);
    this.product = response.data.product;
    console.log(this.product);
  },
  data() {
    return {
      product: {
        name: "",
      },
      
    };
  },
   
};
</script>

<style scoped>
.product {
  cursor: pointer;
}
.product-image {
  border-radius: 8px !important;
}
.product-name {
  color: #4ba12a;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 700;
}
.product-price {
  color: #2c7a9e;
  font-weight: 600;
}
</style>
