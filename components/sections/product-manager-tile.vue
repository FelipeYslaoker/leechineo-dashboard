<template>
  <v-expansion-panels popout>
    <v-expansion-panel class="pa-0 rounded-lg" :style="`background-color: ${$store.state.secondaryBackground};`">
      <v-expansion-panel-header>Produto Vinculado</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="6">
            <v-btn block text color="orange darken-2" @click="unbindProduct">Desvincular</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn block text color="red" @click="deleteProduct">Exluir Item</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-dialog max-width="500px" v-model="showDialog">
            <template v-slot:activator="{ on, attrs }">
              <v-col cols="12">
                <v-btn block text color="primary" v-bind="attrs" v-on="on"
                  >Mudar imagem</v-btn
                >
              </v-col>
            </template>
            <v-card class="rounded-lg" elevation="0">
              <v-card-title
                >Escolha entre as imagens disponiveis para este
                produto:</v-card-title
              >
              <v-card-text>
                <v-row>
                  <v-col
                    cols="3"
                    v-for="image in item.product.images"
                    :key="image"
                  >
                    <v-img
                      @click="choosedImage(item.image, image)"
                      :src="image"
                      width="100px"
                      height="100px"
                      class="rounded-lg ma-2 border"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn block text color="red" @click="showDialog = false"
                  >Cancelar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-card elevation="0">
          <v-card-title>{{ item.product.name }}</v-card-title>
          <v-card-subtitle>{{ item.product.description }}</v-card-subtitle>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  props: ["item", "index"],
  methods: {
    choosedImage(before, after) {
      this.$emit("choosedImage", { index: this.index, before, after });
      this.showDialog = false;
    },
    unbindProduct(){
      this.$emit("unbind", this.index);
    },
    deleteProduct(){
      this.$emit('deleteProduct', this.index);
    }
  },
  data() {
    return {
      showDialog: false,
    };
  },
};
</script>

<style scoped>
.border {
  border: 2px solid orange !important;
}
</style>