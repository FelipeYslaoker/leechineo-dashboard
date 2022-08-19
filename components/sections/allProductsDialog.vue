<template>
  <div>
    <v-dialog v-model="showDialog" max-width="600" class="rounded-lg">
      <template v-slot:activator="{ on, attrs }">
        <v-btn block text :color="color || 'primary'" v-bind="attrs" v-on="on"
          >
            <slot name="default"/>
          </v-btn
        >
      </template>
      <v-card class="rounded-lg">
        <v-card-text v-if="loading">
          <v-sheet width="300px" height="300px"><loading></loading></v-sheet>
        </v-card-text>
        <v-card-text v-else-if="error">
          <v-sheet width="300px" height="300px"><db-error ></db-error></v-sheet>
        </v-card-text>
        <v-card-text v-else-if="allProducts.length < 1">
          <v-sheet width="300px" height="300px">
            <centralize>
        <div class="text-center">
          <md-icon size="60" color="md-primary">pets</md-icon>
        </div>
        <h1 class="text-center primary--text font-weight-light">
          Sem produtos.
        </h1>
        <v-btn text block color="primary" class="mt-2" to="/products/create">Adicionar</v-btn>
      </centralize>
          </v-sheet>
        </v-card-text>
        <template v-else>
          <v-card-title>Lista de produtos</v-card-title>
          <v-card-text>
            <v-row class="mt-3 mb-2">
              <v-text-field
                outlined
                class="rounded-lg ml-2"
                dense
                label="Buscar..."
                v-model="searchText"
              >
                <v-icon
                  slot="append"
                  @click="
                    searchText = '';
                    search();
                  "
                  >mdi-close</v-icon
                >
              </v-text-field>
              <v-btn icon class="mx-2" @click="search">
                <md-icon color="md-primary">search</md-icon>
              </v-btn>
            </v-row>
            <v-simple-table v-if="allProducts.length > 0">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left"></th>
                    <th class="text-left">Nome</th>
                    <th class="text-left">ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in allProducts" :key="product.urlNumber">
                    <td @click="notifyListener(product.urlNumber)">
                      <v-img
                        :src="product.images[0]"
                        width="50px"
                        height="50px"
                        class="my-2 rounded-lg"
                      ></v-img>
                    </td>
                    <td @click="notifyListener(product.urlNumber)">
                      {{ product.name }}
                    </td>
                    <td @click="notifyListener(product.urlNumber)">
                      {{ product.urlNumber }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-else></div>
            <v-pagination
              v-if="allProducts.length > 0"
              class="mt-2"
              v-model="page"
              :length="Math.ceil(totalItems / 5)"
            ></v-pagination>
          </v-card-text>
          <v-card-actions>
            <v-btn block text color="red" @click="showDialog = false"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DbError from "../errors/db-error.vue";
import Loading from "../global/loading.vue";
export default {
  components: { Loading, DbError },
  props: ['color'],
  data() {
    return {
      showDialog: false,
      allProducts: [],
      page: 1,
      totalItems: 1,
      error: undefined,
      searchText: "",
      loading: true,
    };
  },
  async beforeCreate() {
    try {
      const response = await this.$axios("/product/get?page=1&limit=5");
      this.allProducts = response.data.results || [];
      this.totalItems = Number(response.data.totalItems) || 0;
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.error = "db_error";
    }
  },
  methods: {
    notifyListener(selectedProduct) {
      this.$emit("selected", selectedProduct);
      this.showDialog = false;
    },
    async search() {
      this.loading = true;
      try {
        const response = await this.$axios(
          `/product/get?page=1&limit=5&search=${encodeURI(this.searchText)}`
        );
        this.page = 1;
        this.allProducts = response.data.results || [];
        this.totalItems = Number(response.data.totalItems) || 0;
      } catch (e) {
        this.error = "db_error";
      }
      this.loading = false;
    },
  },
  watch: {
    async page(newValue) {
      this.loading = true;
      try {
        const response = await this.$axios(
          `/product/get?page=${newValue}&limit=5`
        );
        this.allProducts = response.data.results || [];
        this.totalItems = Number(response.data.totalItems) || 0;
      } catch (e) {
        this.error = "db_error";
      }
      this.loading = false;
    },
  },
};
</script>

<style>
</style>