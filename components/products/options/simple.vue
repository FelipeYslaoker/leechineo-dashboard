<template>
  <div>
    <v-text-field
      label="Titulo das variantes (Opcional)"
      dense
      outlined
      :disabled="saving"
      placeholder="Cor"
      v-model="variantSimple.title"
    >
    </v-text-field>
    <v-row align="center" justify="center">
      <h4>Opções</h4>
    </v-row>
    <div v-for="(option, i) in variantSimple.options" :key="i">
      <v-expand-transition>
        <v-card
          v-show="option.showOption"
          class="rounded-lg my-4"
          :color="option.color"
          elevation="0"
        >
          <v-card-title>
            <v-row>
              <v-col cols="6" lg="3">
                <v-text-field
                  outlined
                  :disabled="saving"
                  dense
                  v-model="option.name"
                  :rules="formRules.name"
                  label="Nome*"
                  placeholder="64 Polegadas"
                ></v-text-field>
              </v-col>
              <v-col cols="6" lg="3">
                <v-text-field
                  outlined
                  :disabled="saving"
                  v-model="option.stock"
                  dense
                  :rules="formRules.stock"
                  type="number"
                  label="Estoque*"
                  placeholder="56"
                ></v-text-field>
              </v-col>
              <v-col cols="6" lg="3">
                <v-select
                  :disabled="saving"
                  :items="$store.state.suportedCurrencies"
                  outlined
                  v-model="option.price.currency"
                  dense
                  label="Moeda*"
                ></v-select>
              </v-col>
              <v-col cols="6" lg="3">
                <v-text-field
                  outlined
                  dense
                  :disabled="saving"
                  v-model="option.price.value"
                  :rules="formRules.price"
                  label="Preço*"
                  placeholder="Preta"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-actions>
            <v-btn
              color="red"
              text
              @click="action('delete', i)"
              :disabled="variantSimple.options.length < 3 || saving"
              >Apagar</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="action('moveUp', i)"
              :disabled="i === 0 || saving"
            >
              <v-icon class="mx-2" color="primary">mdi-arrow-up-thick</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="action('moveDown', i)"
              :disabled="i === variantSimple.options.length - 1 || saving"
            >
              <v-icon class="mx-2" color="primary">mdi-arrow-down-thick</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
      <v-row
        v-if="variantSimple.options.length - 1 === i"
        justify="center"
        align="center"
      >
        <v-btn
          color="primary"
          bottom
          fixed
          fab
          elevation="0"
          :disabled="saving"
          @click="addOption('simple')"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  props: ['saving', 'variantSimple'],
  methods: {
    action(event, i) {
      this.$emit("event", { event, id: i });
    },
    addOption(type){
      this.$emit('addOption', type);
    },
  },
  data() {
    return {
      expand: true,
      formRules: {
        name: [(text) => !!text || "Campo obrigatório."],
        stock: [
          (number) => !!number || "Campo obrigatório.",
          (number) =>
            Number(number) > 0 || "O estoque deve ser maior do que zero.",
          (number) => typeof Number(number) === "number" || "Campo inválido.",
        ],
        price: [
          (number) => !!number || "Campo obrigatório.",
          // (number) => {
          //   if (
          //     this.option.price.currency === "USD" &&
          //     Number(number.replace(",", ".")) < 1
          //   )
          //     return "O preco tem que ser maior do que US$1.0";
          //   else if (
          //     this.option.price.currency === "BRL" &&
          //     Number(number.replace(",", ".")) < 5
          //   )
          //     return "O preco tem que ser mair do que R$5,00";
          //   else return true;
          // },
          (number) =>
            !Number.isNaN(Number(number.replace(",", "."))) ||
            "Campo inválido.",
        ],
      },
      suportedCurrencies: ["BRL", "USD"],
    };
  },
};
</script>

<style>
</style>