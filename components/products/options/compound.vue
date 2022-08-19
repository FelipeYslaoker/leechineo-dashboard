<template>
  <div>
    <v-text-field
      label="Titulo das variantes (Opcional)"
      dense
      outlined
      :disabled="saving"
      placeholder="Cor"
      v-model="variantCompound.title"
    >
    </v-text-field>
    <v-row align="center" justify="center">
      <h4>Opções</h4>
    </v-row>
    <v-card color="second" class="rounded-lg mt-4" elevation="0">
      <v-card-title>Atributos</v-card-title>
      <v-card-text>
        <v-row
          dense
          v-for="(atribute, i) in variantCompound.atributes"
          :key="i"
        >
        <v-col cols="7">
          <v-text-field
            outlined
            dense
            v-model="variantCompound.atributes[i]"
            :label="`${i + 1}º atributo`"
            :disabled="saving"
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
          <v-sheet max-height="40px" color="third" class="rounded-lg">
            <v-btn
            icon
            color="red"
            @click="removeAtribute(i)"
            :disabled="variantCompound.atributes.length <= 2 || saving"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="move('moveUp', variantCompound.atributes, i)"
            :disabled="i === 0 || saving"
          >
            <v-icon class="mx-2" color="primary">mdi-arrow-up-thick</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="move('moveDown', variantCompound.atributes, i)"
            :disabled="i === variantCompound.atributes.length - 1 || saving"
          >
            <v-icon class="mx-2" color="primary">mdi-arrow-down-thick</v-icon>
          </v-btn>
          </v-sheet>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="primary" @click="addAtribute" :disabled="saving"
          >Adicionar</v-btn
        >
      </v-card-actions>
    </v-card>
    <div v-for="(option, i) in variantCompound.options" :key="i">
      <v-expand-transition class="mb-5">
        <v-card
          v-show="option.showOption"
          class="rounded-lg my-4"
          :color="option.color"
          elevation="0"
        >
          <v-card-title>
            <v-row dense>
              <v-col
                v-for="(atribute, i) in variantCompound.atributes"
                :key="i"
                cols="6"
                md="3"
              >
                <v-text-field
                  :disabled="saving"
                  dense
                  outlined
                  :label="`${atribute || i + 1 + 'º atributo'}`"
                  v-model="option.names[i]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-row>
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
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="red"
              text
              @click="action('delete', i)"
              :disabled="variantCompound.options.length < 3 || saving"
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
              :disabled="i === variantCompound.options.length - 1 || saving"
            >
              <v-icon class="mx-2" color="primary">mdi-arrow-down-thick</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
      <v-row
        v-if="variantCompound.options.length - 1 === i"
        justify="center"
        align="center"
      >
        <v-btn
          color="primary"
          bottom
          fab
          elevation="0"
          @click="addOption('compound')"
          fixed
          :disabled="saving"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  props: ['variantCompound', 'saving'],
  methods: {
    action(event, index) {
      this.$emit("event", { event, id: index, type: "compound" });
    },
    removeAtribute(index){
      this.$emit('removeAtribute', index);
    },
    move(action, item, index){
      this.$emit('moveAtribute', {action, item, index});
    },
    addAtribute(){
      this.$emit('addAtribute');
    },
    addOption(type){
      this.$emit('addOption', type);
    }
  },
  data() {
    return {
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