<template>
  <div>
    <loading v-if="loading"></loading>
    <db-error v-else-if="error"></db-error>
    <div v-else-if="products.length < 1">
      <centralize>
        <div class="text-center">
          <md-icon size="60" color="md-primary">pets</md-icon>
        </div>
        <h1 class="text-center primary--text font-weight-light">
          Sem produtos.
        </h1>
      </centralize>
      <v-btn fab color="primary" to="/products/manipulate" fixed bottom right>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div v-else>
      <v-simple-table class="rounded-xl" :style="`background-color: ${$store.state.secondaryBackground}`">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left"></th>
              <th class="text-left">Nome</th>
              <th class="text-left">Tipo de variante</th>
              <th class="text-left">ID</th>
              <th class="text-left">Visibilidade</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product._id">
              <td
                @click="
                  $nuxt._router.push({
                    path: '/products/manipulate',
                    query: { id: product.urlNumber },
                  })
                "
              >
                <v-img
                  :src="product.images[0]"
                  width="50px"
                  height="50px"
                  class="rounded-lg my-3"
                ></v-img>
              </td>
              <td
                @click="
                  $nuxt._router.push({
                    path: '/products/manipulate',
                    query: { id: product.urlNumber },
                  })
                "
              >
                {{ product.name }}
              </td>
              <td
                @click="
                  $nuxt._router.push({
                    path: '/products/manipulate',
                    query: { id: product.urlNumber },
                  })
                "
              >
                {{ variantTypeName(product.variants.type) }}
              </td>
              <td
                @click="
                  $nuxt._router.push({
                    path: '/products/manipulate',
                    query: { id: product.urlNumber },
                  })
                "
              >
                {{ product.urlNumber }}
              </td>
              <td>
                <v-icon v-if="product.visibility === 'private'"
                  >mdi-lock</v-icon
                >
                <v-icon v-else>mdi-earth</v-icon>
                <v-btn
                  text
                  color="primary"
                  icon
                  @click="changePrivacy(product.urlNumber)"
                >
                  <v-icon> mdi-cached </v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-btn
        fab
        fixed
        bottom
        right
        to="/products/manipulate"
        color="primary"
        elevation="0"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="Math.ceil(totalProducts / 10)"
          :total-visible="7"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Product from "@/components/products/product.vue";
import DbError from "~/components/errors/db-error.vue";
import Loading from "~/components/global/loading.vue";

export default {
  methods: {
    variantTypeName(type) {
      switch (type) {
        case "unique":
          return "Única";
        case "simple":
          return "Simples";
        case "compound":
          return "Composta";
        default:
          return "Invalid";
      }
    },
    async changePrivacy(productId) {
      try {
        const response = await this.$axios.put("/product/change-privacy", {
          id: productId,
        });
        const product = this.products.filter(
          (product) => product.urlNumber === productId
        )[0];
        const productIndex = this.products.indexOf(product);
        this.products[productIndex].visibility =
          response.data["new-visibility"];
      } catch (e) {
        console.log(e);
      }
    },
  },
  components: { Product, DbError, Loading },
  data() {
    return {
      page: 1,
      totalProducts: 0,
      products: [],
      loading: true,
      error: undefined,
    };
  },
  head() {
    return {
      title: "Produtos",
    };
  },
  watch: {
    async page(newValue) {
      this.loading = true;
      try {
        const response = await this.$axios(
          `/product/getAll?page=${newValue}&limit=10`
        );
        this.products = response.data.results;
        this.totalProducts = response.data.totalItems;
      } catch (e) {
        this.error = "db_error";
      }
      this.loading = false;
    },
  },
  async beforeCreate() {
    try {
      const response = await this.$axios.get("/product/getAll?page=1&limit=10");
      this.products = response.data.results || [];
      this.totalProducts = response.data.totalItems;
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.error = "db_error";
    }
  },
};
</script>

<style>
</style>