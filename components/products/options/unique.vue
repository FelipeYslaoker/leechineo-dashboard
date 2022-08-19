<template>
  <div>
    <v-text-field
      v-model="variantUnique.title"
      outlined
      :disabled="saving"
      dense
      label="Titulo da variante (Opcional)"
      placeholder="Cor"
    ></v-text-field>
    <v-text-field
      v-model="variantUnique.name"
      outlined
      :disabled="saving"
      dense
      label="Nome da variante (Opcional)"
      placeholder="Preta"
    ></v-text-field>
    <v-text-field
      v-model="variantUnique.stock"
      outlined
      :disabled="saving"
      :rules="formRules.stock"
      dense
      type="number"
      label="Estoque*"
      placeholder="56"
    ></v-text-field>
    <v-row>
      <v-col cols="4">
        <v-select
          :items="$store.state.suportedCurrencies"
          :rules="formRules.price.currency"
          v-model="variantUnique.price.currency"
          outlined
          dense
          :disabled="saving"
          label="Moeda*"
        ></v-select>
      </v-col>
      <v-col cols="8">
        <v-text-field
          :rules="formRules.price.value"
          v-model="variantUnique.price.value"
          outlined
          dense
          :disabled="saving"
          label="Preço*"
          placeholder="Preta"
        ></v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["variantUnique", "saving"],
  data() {
    return {
      formRules: {
        stock: [
          (number) => !!number || "Campo obrigatório.",
          (number) =>
            Number(number) > 0 || "O estoque deve ser maior do que zero.",
          (number) => typeof Number(number) === "number" || "Campo inválido.",
        ],
        price: {
          currency: [],
          value: [
            (number) => !!number || "Campo obrigatório.",
            (number) => {
              if (
                this.variantUnique.price.currency === "USD" &&
                Number(String(number).replace(",", ".")) < 1
              )
                return "O preco tem que ser maior do que US$1.0";
              else if (
                this.variantUnique.price.currency === "BRL" &&
                Number(String(number).replace(",", ".")) < 5
              )
                return "O preco tem que ser mair do que R$5,00";
              else return true;
            },
            (number) =>
              !Number.isNaN(Number(String(number).replace(",", "."))) ||
              "Campo inválido.",
          ],
        },
      },
    };
  },
};
</script>

<style>
</style>