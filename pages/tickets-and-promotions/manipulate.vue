<template>
  <div>
    <v-form ref="ticketForm">
      <v-sheet
        class="pa-3 rounded-lg ma-2"
        color="second"
      >
        <v-text-field
          label="Cupom*"
          outlined
          dense
          :disabled="!!($nuxt.$route.query.id)"
          :rules="formRules.name"
          v-model="ticket.name"
        ></v-text-field>
        <v-row>
          <v-col cols="8">
            <v-text-field
              label="Valor do desconto"
              outlined
              dense
              type="number"
              :rules="formRules.discount"
              v-model="ticket.discount.value"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-radio-group row v-model="ticket.discount.type">
              <v-radio label="%" value="percent"></v-radio>
              <v-radio label="R$" value="currency"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-select
          label="Moeda"
          outlined
          dense
          :items="currencies.available"
          v-model="currencies.selected"
          v-if="ticket.discount.type === 'currency'"
        ></v-select>
        <v-radio-group row v-model="ticket.type">
          <v-radio label="Carrinho" value="cart"></v-radio>
          <v-radio label="Produtos" value="products"></v-radio>
        </v-radio-group>
        <all-products-dialog
          v-if="ticket.type === 'products'"
          color="primary"
          @selected="productSelected"
          >Escolher produto</all-products-dialog
        >
        <div v-if="ticket.type === 'products'">
          <v-sheet
            v-for="product in ticket.products"
            :key="product.urlNumber"
            class="rounded-lg pa-3 ma-3"
          >
            <v-row>
              <v-col cols="2" class="align-center justify-center">
                <v-img
                  :src="product.images[0]"
                  width="50px"
                  height="50px"
                  class="my-2 rounded-lg"
                ></v-img>
              </v-col>
              <v-col>
                <v-sheet
                  height="100%"
                  class="d-flex justify-center align-center"
                  color="transparent"
                  >{{ product.name }}</v-sheet
                >
              </v-col>
            </v-row>
          </v-sheet>
        </div>
      </v-sheet>
    </v-form>
    <v-form ref="ruleForm">
      <v-sheet
        class="pa-3 ma-2 rounded-lg"
        color="second"
      >
        <v-row v-if="rulesList.length > 0">
          <v-col :cols="rules.selected === 'Na primeira compra' ? 12 : 6">
            <v-select
              outlined
              dense
              label="Adicionar regras"
              :items="rulesList.map((rule) => rule.name)"
              v-model="rules.selected"
            ></v-select>
          </v-col>
          <v-col cols="6" v-if="!(rules.selected === 'only-first-purchase')">
            <v-text-field
              outlined
              dense
              v-if="rules.selected === 'A partir de X compras'"
              label="A partir de quantas"
              type="number"
              :rules="formRules.rules.onlyFromXPurchase"
              v-model="
                rules.available.filter(
                  (rule) => rule.name === rules.selected
                )[0].value
              "
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-if="rules.selected === 'Apenas com X compras'"
              label="Quantas comparas"
              type="number"
              :rules="formRules.rules.onlyWithXPurchase"
              v-model="
                rules.available.filter(
                  (rule) => rule.name === rules.selected
                )[0].value
              "
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-if="rules.selected === 'Permitir apenas se a data for XX/XX/XX'"
              label="Qual data?"
              placeholder="XX/XX/XX"
              v-mask="'##/##/##'"
              :rules="formRules.rules.date"
              v-model="
                rules.available.filter(
                  (rule) => rule.name === rules.selected
                )[0].value
              "
            ></v-text-field>
            <v-row
              v-if="
                rules.selected === 'Permitir entre as datas XX/XX/XX e XX/XX/XX'
              "
            >
              <v-col cols="6">
                <v-text-field
                  outlined
                  dense
                  label="Data inicial"
                  v-mask="'##/##/##'"
                  placeholder="XX/XX/XX"
                  :rules="formRules.rules.date"
                  v-model="
                    rules.available.filter(
                      (rule) => rule.name === rules.selected
                    )[0].value.initialDate
                  "
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  outlined
                  dense
                  label="Data final"
                  placeholder="XX/XX/XX"
                  v-mask="'##/##/##'"
                  :rules="formRules.rules.date"
                  v-model="
                    rules.available.filter(
                      (rule) => rule.name === rules.selected
                    )[0].value.finalDate
                  "
                ></v-text-field
              ></v-col>
            </v-row>
            <v-text-field
              outlined
              dense
              v-if="rules.selected === 'Permitir X vezes'"
              label="Quantas vezes?"
              type="number"
              :rules="formRules.rules.onlyXTimes"
              v-model="
                rules.available.filter(
                  (rule) => rule.name === rules.selected
                )[0].value
              "
            ></v-text-field>
            <v-text-field
              outlined
              dense
              v-if="
                rules.selected ===
                'Permitir se a conta tiver sido criada ha X dias'
              "
              label="Quantos dias?"
              type="number"
              :rules="formRules.rules.onlyXdaysAfterAccountCreated"
              v-model="
                rules.available.filter(
                  (rule) => rule.name === rules.selected
                )[0].value
              "
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn block text color="primary" @click="addRule">Adicionar</v-btn>
          </v-col>
        </v-row>
        <v-sheet
          class="px-3 py-2 rounded-lg my-2"
          v-for="(rule, i) in rules.added"
          color="third"
          :key="rule.id"
        >
          <v-row>
            <v-col cols="10" v-if="rule.id === 'only-first-purchase'">{{
              rule.name
            }}</v-col>
            <v-col cols="10" v-else-if="rule.id === 'only-from-x-and-x-date'"
              >{{ rule.name }}: {{ rule.value.initialDate }} e
              {{ rule.value.finalDate }}</v-col
            >
            <v-col cols="10" v-else>{{ rule.name }}: {{ rule.value }}</v-col>
            <v-col>
              <v-btn outlined block color="red" @click="deleteRule(i)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-sheet>
        <v-alert type="error" v-show="rules.error" transition="scale-transition"
          >Adicione pelo menos uma regra.</v-alert
        >
      </v-sheet>
    </v-form>
    <v-sheet
      width="100%"
      color="transparent"
      class="text-center d-flex justify-center"
    >
      <v-sheet color="transparent" class="pa-3" width="60%">
        <v-btn @click="save" block color="primary" elevation="0">Salvar</v-btn>
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script>
import allProductsDialog from "@/components/sections/allProductsDialog.vue";
export default {
  components: { allProductsDialog },
  async beforeMount(){
    if (this.$nuxt.$route.query.id) {
      this.$nuxt.$loading.start()
      const response = await this.$axios.$get(`/ticket/get?id=${this.$nuxt.$route.query.id}`)
      await this.setTicket(response.ticket)
      this.$nuxt.$loading.finish()
    }
  },
  computed: {
    rulesList() {
      const rules = [];
      const itemsToRemove = [];
      if (this.rules.added.length < 1) return this.rules.available;
      this.rules.available
        .filter((rule) => !this.rules.added.includes(rule))
        .forEach((rule) => rules.push(rule));
      for (const addedRule of this.rules.added) {
        if (addedRule.eliminate) {
          rules.forEach((rule) => {
            if (addedRule.eliminate.includes(rule.id)) {
              itemsToRemove.push(rule);
            }
          });
        }
      }
      itemsToRemove.forEach((rule) => rules.splice(rules.indexOf(rule), 1));
      return rules;
    },
  },
  methods: {
    async setTicket(ticket){
      this.ticket.name = ticket.name;
      this.ticket.type = ticket.type;
      this.ticket.discount.type = ticket.discount.type;
      this.ticket.discount.currency = ticket.discount.currency;
      this.ticket.discount.value = ticket.discount.value;
      if(ticket.type === 'products') {
        for (const id of ticket.products) {
          const response = await this.$axios.$get(`/product/get?id=${id}`)
          if (!(this.ticket.products.includes(response.product))) {
            this.ticket.products.push(response.product)
          }
        }
      }
      for (const ticketRule of ticket.rules) {
        const rule = this.rules.available.filter(rule => rule.id === ticketRule.id)[0]
        if (!(this.rules.added.includes(rule))) {
          rule.value = ticketRule.value
          this.rules.added.push(rule)
        }
      }
    },
    isDateValid(date1) {
      const date = new Date();
      const day = date.getDate().toString().padStart(2, 0);
      const month = (date.getMonth() + 1).toString().padStart(2, 0);
      const year = date.getFullYear();
      const date2 = Date.parse(`${year}-${month}-${day}`);
      return !(date1 < date2);
    },
    async productSelected(product) {
      this.$nuxt.$loading.start();
      const response = await this.$axios.$get(`/product/get?id=${product}`);
      this.$nuxt.$loading.finish();
      this.ticket.products.push(response.product);
    },
    addRule() {
      if (!this.$refs.ruleForm.validate()) return;
      if (this.rules.error) this.rules.error = false;
      const rule = this.rules.available.filter(
        (rule) => rule.name === this.rules.selected
      )[0];
      this.rules.added.push(rule);
      if (this.rulesList.length > 0) {
        this.rules.selected = this.rulesList[0].name;
      }
    },
    async save() {
      if (this.rules.added.length < 1) return (this.rules.error = true);
      if (!this.$refs.ticketForm.validate()) return;
      const ticket = {
        name: this.ticket.name,
        discount: {
          value: this.ticket.discount.value,
          type: this.ticket.discount.type,
        },
        type: this.ticket.type,
        rules: this.rules.added.map((rule) => ({
          id: rule.id,
          value: rule.value,
        })),
      };
      if (this.ticket.type === "products") {
        ticket.products = this.ticket.products.map(product => product.urlNumber);
      }
      if (this.ticket.discount.type === "currency") {
        ticket.discount.currency = this.ticket.discount.currency;
      }
      this.$nuxt.$loading.start()
      try {
        if (this.$nuxt.$route.query.id) {
          ticket._id = this.$nuxt.$route.query.id
          await this.$axios.$put('/ticket/update', ticket)
        } else {
          await this.$axios.$post('/ticket/create', ticket)
        }
        this.$nuxt.$router.push('/tickets-and-promotions')
      } catch (e) {
        this.$store.commit('setGlobalDialog', {
          title: 'Erro ao salvar o cupom',
          content: e.response?.data?.message || 'Falha ao conectar no banco de dados.',
          show: true
        });
      }
      this.$nuxt.$loading.finish()
    },
    deleteRule(index) {
      this.rules.added.splice(index, 1);
    },
  },
  watch: {
    ticket: {
      deep: true,
      handler(newValue){
        this.ticket.name = newValue.name.toUpperCase()
      }
    }
  },
  data() {
    return {
      ticket: {
        name: "",
        discount: {
          value: 1,
          type: "percent",
          currency: "USD",
        },
        type: "cart",
        products: [],
        rules: [],
      },
      currencies: {
        available: ["BRL", "USD"],
        selected: "USD",
      },
      rules: {
        error: false,
        selected: "Na primeira compra",
        added: [],
        available: [
          {
            name: "Na primeira compra",
            id: "only-first-purchase",
            eliminate: [
              "only-from-x-purchase",
              "only-with-x-purchase",
              "only-x-times",
            ],
          },
          {
            name: "A partir de X compras",
            id: "only-from-x-purchase",
            eliminate: ["only-first-purchase", "only-with-x-purchase"],
            value: 1,
          },
          {
            name: "Apenas com X compras",
            id: "only-with-x-purchase",
            eliminate: ["only-first-purchase", "only-x-times"],
            value: 1,
          },
          {
            name: "Permitir apenas se a data for XX/XX/XX",
            id: "only-from-x-date",
            eliminate: ["only-from-x-and-x-date"],
            value: "",
          },
          {
            name: "Permitir entre as datas XX/XX/XX e XX/XX/XX",
            id: "only-from-x-and-x-date",
            eliminate: ["only-from-x-date"],
            value: {
              initialDate: "",
              finalDate: "",
            },
          },
          {
            name: "Permitir X vezes",
            id: "only-x-times",
            eliminate: ["only-first-purchase", "only-with-x-purchase"],
            value: 1,
          },
          {
            name: "Permitir se a conta tiver sido criada ha X dias",
            id: "only-x-days-after-account-created",
            value: 0,
          },
        ],
      },
      formRules: {
        name: [
          (text) => text.length > 0 || "Campo requerido",
          text => /[A-Za-z0-9]$/.test(text) || 'Apenas numeros e letras permitidos'
        ],
        discount: [(number) => number > 0 || "Valor inválido"],
        rules: {
          onlyFromXPurchase: [
            (number) =>
              number > 1 || "O valor mínimo de compras deve ser maior que 1",
          ],
          onlyWithXPurchase: [
            (number) =>
              number > 1 || "O valor mínimo de compras deve ser maior que 1",
          ],
          date: [
            (date) => date.length === 8 || "Data inválida",
            (date) =>
              this.isDateValid(
                Date.parse(
                  `20${date.slice(-2)}-${date.slice(3, 5)}-${date.slice(0, 2)}`
                )
              ) || "Data inválida",
          ],
          onlyXTimes: [
            (number) =>
              number > 0 || "O valor mínimo de compras deve ser maior que 0",
          ],
          onlyXdaysAfterAccountCreated: [
            (number) =>
              number > 0 || "O valor mínimo de compras deve ser maior que 0",
          ],
        },
      },
    };
  },
};
</script>

<style>
</style>
