<template>
  <v-form ref="form">
    <v-sheet
      class="pa-2 ma-2 rounded-lg"
      color="second"
    >
      <v-text-field
        outlined
        dense
        label="Nome"
        v-model="name"
        :rules="formRules.name"
      ></v-text-field>
      <v-sheet
        class="pa-2 ma-2 rounded-lg"
        color="third"
      >
        <v-subheader>Configurações padrões</v-subheader>
        <v-sheet
          class="pa-2 ma-2 rounded-lg"
          color="fourth"
        >
          <v-subheader>Preço</v-subheader>
          <v-row dense>
            <v-col cols="6">
              <v-select
                label="Moeda"
                outlined
                dense
                :items="currencies"
                v-model="defaultMapping.price.currency"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                outlined
                dense
                label="Valor"
                v-model="defaultMapping.price.value"
                type="number"
                :rules="formRules.price"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-sheet>
        <v-sheet
          class="pa-2 ma-2 rounded-lg"
          color="fourth"
        >
          <v-subheader>Tempo</v-subheader>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Min"
                outlined
                dense
                type="number"
                v-model="defaultMapping.time.min"
                :rules="formRules.price"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Max"
                outlined
                dense
                type="number"
                v-model="defaultMapping.time.max"
                :rules="formRules.price"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-sheet>
      </v-sheet>
      <v-sheet
        v-for="(mapping, i) in mappings"
        :key="i"
        class="pa-2 ma-2 rounded-lg"
        color="third"
      >
        <v-text-field
          outlined
          dense
          label="CEP"
          v-model="mappings[i].location"
          :rules="formRules.location"
        ></v-text-field>
        <v-radio-group row v-model="mappings[i].regionRadius">
          <v-radio label="Cidade" value="city"></v-radio>
          <v-radio label="Estado" value="state"></v-radio>
          <v-radio label="Região" value="region"></v-radio>
        </v-radio-group>
        <v-sheet
          class="pa-2 ma-2 rounded-lg"
          color="fourth"
        >
          <v-subheader>Preço</v-subheader>
          <v-row dense>
            <v-col cols="6">
              <v-select
                label="Moeda"
                outlined
                dense
                :items="currencies"
                v-model="mappings[i].price.currency"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                outlined
                dense
                label="Valor"
                v-model="mappings[i].price.value"
                type="number"
                :rules="formRules.price"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-sheet>
        <v-sheet
          class="pa-2 ma-2 rounded-lg"
          color="fourth"
        >
          <v-subheader>Tempo</v-subheader>
          <v-row>
            <v-col cols="6">
              <v-text-field
                label="Min"
                outlined
                dense
                type="number"
                v-model="mappings[i].time.min"
                :rules="formRules.price"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Max"
                outlined
                dense
                type="number"
                v-model="mappings[i].time.max"
                :rules="formRules.price"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-sheet>
        <v-btn block text color="red" @click="deleteMapping(i)">
          <v-icon>delete</v-icon>
        </v-btn>
      </v-sheet>
      <v-btn text block color="primary" @click="addMapping"
        >Adicionar mapeamento</v-btn
      >
    </v-sheet>
    <v-sheet class="px-10" color="transparent">
      <v-btn
        color="primary"
        rounded
        elevation="0"
        block
        class="my-3"
        @click="save"
        >Salvar</v-btn
      >
    </v-sheet>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      formRules: {
        name: [(text) => text.length > 0 || "Campo obrigatório"],
        price: [
          (number) =>
            (typeof Number(String(number).replace(",", ".")) === "number" &&
              Number(String(number).replace(",", ".")) >= 0 &&
              String(number).replace(",", ".").length > 0) ||
            "Número inválido",
        ],
        location: [(text) => text.length > 0 || "Campo obrigatório"],
      },
      name: "",
      mappings: [],
      defaultMapping: {
        location: "default",
        time: {
          min: 0,
          max: 1,
        },
        price: {
          currency: "USD",
          value: 0,
        },
      },
      currencies: ["BRL", "USD"],
    };
  },
  async beforeMount() {
    if (this.$nuxt.$route.query.id) {
      this.$nuxt.$loading.start();
      try {
        const response = await this.$axios.$get(
          `/shippingMethods/get?id=${this.$nuxt.$route.query.id}`
        );
        const defaultMapping = response.defaultMapping;
        const mappings = response.mappings;
        this.defaultMapping = defaultMapping;
        this.mappings = mappings;
        this.name = response.name;
      } catch (e) {
        console.log(e);
      }
      this.$nuxt.$loading.finish();
    }
  },
  methods: {
    addMapping() {
      this.mappings.push({
        location: "",
        regionRadius: "region",
        price: {
          currency: "USD",
          value: 0,
        },
        time: {
          min: 0,
          max: 1,
        },
      });
    },
    deleteMapping(i) {
      this.mappings.splice(i, 1);
    },
    async save() {
      if (!this.$refs.form?.validate()) return;
      const shippingMethod = {
        name: this.name,
        defaultMapping: {
            price: {
                currency: this.defaultMapping.price.currency,
                value: Number(String(this.defaultMapping.price.value).replace(',', '.'))
            },
            time: {
                min: Number(String(this.defaultMapping.time.min).replace(',', '.')),
                max: Number(String(this.defaultMapping.time.max).replace(',', '.'))
            }
        },
        mappings: [...this.mappings.map(mapping => {
            return {
                location: `${mapping.location}`,
                regionRadius: mapping.regionRadius,
                price: {
                    currency: mapping.price.currency,
                    value: Number(String(mapping.price.value).replace(',', '.'))
                },
                time: {
                    min: Number(String(mapping.time.min).replace(',', '.')),
                    max: Number(String(mapping.time.max).replace(',', '.'))
                }
            }
        })],
      };
      const id = this.$nuxt.$route.query.id;
      if (id) {
          shippingMethod._id = id;
      }
      this.$nuxt.$loading.start();
      try {
        await this.$axios.$post("/shippingMethods/save", shippingMethod);
        this.$nuxt.$router.push("/shipping-methods");
      } catch (e) {
        console.log(e);
      }
      this.$nuxt.$loading.finish();
    },
  },
};
</script>

<style>
</style>