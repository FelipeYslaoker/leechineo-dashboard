<template>
  <div>
    <db-error v-if="error"></db-error>
    <loading v-else-if="loading.all"></loading>
    <empty v-else-if="brands.length < 1" creationPage="/brands/manipulate"
      >marcas</empty
    >
    <v-container v-else>
      <v-row>
        <v-col v-for="brand in brands" :key="brand._id">
          <v-sheet :color="brand.color" class="pa-3 rounded-lg">
            {{ brand.name }}
            <v-btn text @click="openURL(brand.url)">
              <v-icon>open_in_new</v-icon>
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <v-btn fab fixed right bottom to="/brands/manipulate" :color="brands[0].color" v-if="brands.length > 0">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brands: [],
      error: null,
      loading: {
        all: false,
      },
    };
  },
  methods: {
    openURL(url){
      open(url, '_blank');
    }
  },
  async created() {
    this.loading.all = true;
    try {
      const response = await this.$axios("/brands/get");
      if (response.data.results) {
        this.brands = response.data.results;
      }
    } catch (e) {
      this.error = "db_error";
    }
    this.loading.all = false;
  },
};
</script>

<style>
</style>