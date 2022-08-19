<template>
  <v-dialog v-model="showDialog" max-width="700">
    <v-card
      color="first"
      elevation="0"
      class="rounded-lg"
    >
      <v-card-title>Selecionar moeda</v-card-title>
      <v-card-text>
          <v-text-field v-if="!loading" outlined dense label="Pesquisar..." v-model="searchString" placeholder="USD"></v-text-field>
          <loading v-if="loading"></loading>
          <div v-else>
              <v-sheet v-for="currency, i in filtered" :key="i" class="pa-3 ma-3 rounded-lg d-flex justify-space-between flex-wrap" outlined color="second">
                  <div class="d-flex">
                      <v-sheet color="third" class="rounded-lg pa-3 mr-2">
                      {{currency.name}}
                  </v-sheet>
                  <v-sheet color="third" class="rounded-lg pa-3 mx-2">
                      {{currency.code}}
                  </v-sheet>
                  </div>
                  <v-btn text color="primary" @click="selected(currency.code)">Selecionar</v-btn>
              </v-sheet>
          </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  async beforeMount() {
    this.loading = true;
    try {
      const response = await this.$axios("/currencies/get");
      this.currencies = [{
          name: 'Dólar americano',
          code: 'USD'
      }, ...response.data];
    } catch (e) {
      this.$store.commit("setGlobalDialog", {
        title: "Falha ao carregar moedas",
        content:
          e.response?.data?.message || "Falha ao conectar no banco de dados",
        show: true,
      });
      this.showDialog = false;
    }
    this.loading = false;
  },
  props: {
    value: Boolean,
  },
  data() {
    return {
      showDialog: this.value,
      currencies: [],
      searchString: '',
      loading: false,
    };
  },
  methods: {
      selected(currency){
          this.$emit('selected', currency)
          this.showDialog = false
      }
  },
  computed: {
      filtered(){
          const regex = new RegExp(`\\B${this.searchString.replaceAll(' ', '').toLowerCase()}|${this.searchString.replaceAll(' ', '').toLowerCase()}\\B`)
          const filtered = this.currencies.filter(currency => regex.test(currency.name.replaceAll(' ', '').toLowerCase()) || regex.test(currency.code.toLowerCase()) || this.searchString.toLowerCase() === currency.code.toLowerCase() || this.searchString.replaceAll(' ', '').toLowerCase() === currency.name.replaceAll(' ', '').toLowerCase())
          return filtered
      }
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
