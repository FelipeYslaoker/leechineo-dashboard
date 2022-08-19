<template>
  <div>
    <div v-if="shippingMethods.length > 0">
      <v-btn
        fab
        bottom
        right
        fixed
        color="primary"
        to="/shipping-methods/manipulate"
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-sheet
        v-for="shippingMethod in shippingMethods"
        :key="shippingMethod._id"
        class="pa-3 ma-3 rounded-lg d-flex flex-wrap"
        color="second"
      >
        <v-sheet class="pa-2 mx-2 my-1 rounded-lg" color="fourth">{{
          shippingMethod.name
        }}</v-sheet>
        <v-sheet class="pa-2 mx-2 my-1 rounded-lg" color="fourth"
          >{{
            shippingMethod.mappings.length
          }}
          mapeametos</v-sheet
        >
        <v-sheet class="pa-2 mx-2 my-1 rounded-lg" color="fourth"
          >Preço padrão:
          {{
            shippingMethod.defaultMapping.price.currency
          }}{{
            shippingMethod.defaultMapping.price.value
          }}</v-sheet
        >
        <v-sheet class="pa-3 mt-3 rounded-lg d-flex justify-space-around" width="100%" color="third">
          <v-btn text color="red" width="45%">
            <v-icon>delete</v-icon>
          </v-btn>
          <v-btn text color="primary" width="45%" :to="`/shipping-methods/manipulate?id=${shippingMethod._id}`">
            <v-icon>edit</v-icon>
          </v-btn>
        </v-sheet>
      </v-sheet>
    </div>
    <empty creationPage="/shipping-methods/manipulate" v-else
      >métodos de envio</empty
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      shippingMethods: [],
    };
  },
  async beforeCreate() {
    try {
      const response = await this.$axios.$get("/shippingMethods/get");
      this.shippingMethods = response;
      console.log(this.shippingMethods);
    } catch (e) {
      console.log(e);
    }
  },
};
</script>

<style>
</style>