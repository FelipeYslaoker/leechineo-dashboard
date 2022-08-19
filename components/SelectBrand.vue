<template>
  <v-dialog v-model="showDialog" max-width="700">
    <v-card color="first" elevation="0" class="rounded-lg">
      <div v-if="loading" class="ma-3">
          <loading></loading>
      </div>
      <template v-else>
          <v-card-title>Selecionar marca</v-card-title>
          <v-card-text>
              <v-sheet v-for="brand in brands" :key="brand._id" class="pa-2 ma-2 rounded-lg" :color="brand.color">
                  <v-sheet class="rounded pa-2 d-flex justify-space-between align-center" color="first" outlined>
                      <span>{{brand.name}}</span>
                      <v-btn text color="primary" @click="selected(brand)">Selecionar</v-btn>
                  </v-sheet>
              </v-sheet>
          </v-card-text>
          <v-card-actions>
              <v-btn color="red" text @click="showDialog = false">cancelar</v-btn>
          </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["value"],
  async beforeMount() {
    this.loading = true;
    try {
      const response = await this.$axios("/brands/get");
      if (response.data.results) {
        this.brands = response.data.results;
      }
    } catch (e) {
      this.$store.commit("setGlobalDialog", {
        title: "Falha ao carregar marcas",
        content:
          e.response?.data?.message || "Falha ao conectar no banco de dados",
        show: true,
      });
    }
    this.loading = false;
  },
  methods: {
      selected(brand){
          this.$emit('selected', brand)
          this.showDialog = false
      }
  },
  data() {
    return {
      showDialog: false,
      loading: true,
      brands: []
    };
  },
  watch: {
    value() {
      this.showDialog = this.value;
    },
    showDialog() {
      this.$emit("input", this.showDialog);
    },
  },
};
</script>

<style>
</style>