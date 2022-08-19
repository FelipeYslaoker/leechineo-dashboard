<template>
  <v-dialog v-model="showDialog" max-width="700">
    <v-card color="first" elevation="0" class="rounded-lg">
      <loading v-if="loading"></loading>
      <template v-else>
        <v-card-title>Selecionar método de envio</v-card-title>
        <v-card-text>
            <v-sheet v-for="shippingMethod, i in shippingMethods" :key="i" class="rounded-lg ma-2 pa-2 d-flex justify-space-between flex-wrap" color="second">
                <div class="d-flex">
                    <v-sheet class="pa-1 ma-1 rounded" color="primary">{{shippingMethod.name}}</v-sheet>
                    <v-sheet class="pa-1 ma-1 rounded" color="primary">{{shippingMethod.defaultMapping.price.currency}}{{shippingMethod.defaultMapping.price.value}}</v-sheet>
                    <v-sheet class="pa-1 ma-1 rounded" color="primary">{{shippingMethod.defaultMapping.time.min}} - {{shippingMethod.defaultMapping.time.max}}</v-sheet>
                </div>
                <v-btn text color="primary" @click="shippingMethod.showMappings = !shippingMethod.showMappings">{{shippingMethod.showMappings ? 'ocultar mapeamentos' : 'mostrar mapeamentos'}}</v-btn>
                <v-expand-transition>
                    <v-sheet width="100%" class="rounded-lg ma-2 pa-2" color="third" v-show="shippingMethod.showMappings">
                    <v-subheader>Mapeamentos</v-subheader>
                    <v-sheet v-for="mapping, i in shippingMethod.mappings" :key="i" class="ma-2 pa-2 rounded-lg" color="fourth">
                        {{mapping.location}} / {{mapping.regionRadius}} / {{mapping.price.currency}}{{mapping.price.value}} / {{mapping.time.max}} / {{mapping.time.min}}
                    </v-sheet>
                </v-sheet>
                </v-expand-transition>
                <v-btn color="primary" elevation="0" class="rounded my-3" block @click="selected(shippingMethod)">Selecionar</v-btn>
            </v-sheet>
        </v-card-text>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  async beforeMount() {
    this.loading = true;
    try {
      const response = await this.$axios.$get("/shippingMethods/get");
      this.shippingMethods = response.map(shippingMethod => {
          shippingMethod.showMappings = false
          return shippingMethod
      });
    } catch (e) {
      this.$store.commit("setGlobalDialog", {
        title: "Falha ao carregar métodos de envio",
        content:
          e.response?.data?.message || "Falha ao conectar no banco de dados",
        show: true,
      });
      this.showDialog = false;
    }
    this.loading = false;
  },
  methods: {
      selected(shippingMethod){
          this.$emit('selected', shippingMethod)
          this.showDialog = false
      }
  },
  data() {
    return {
      loading: false,
      shippingMethods: [],
      showDialog: this.value,
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