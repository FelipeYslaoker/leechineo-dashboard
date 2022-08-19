<template>
  <div>
    <loading v-if="loading.all"></loading>
    <div v-else>
      <v-form ref="form">
        <v-sheet
          class="rounded-lg ma-3 pb-10 pt-5 px-3"
          color="second"
        >
          <h2 class="mb-2">Escolha um ícone</h2>
          <choose-icon-dialog
            @onChoosedIcon="category.icon = $event.ligature"
          ></choose-icon-dialog>
          <v-row>
            <v-col cols="12" md="6">
              <v-row dense>
                <v-col cols="10">
                  <v-text-field
                    :rules="rules.icon"
                    v-model="category.icon"
                    dense
                    outlined
                    label="Ícone"
                  ></v-text-field>
                </v-col>
                <v-sheet
                  width="40px"
                  height="40px"
                  class="pa-2 mt-1 ml-2 rounded-lg"
                  color="third"
                >
                  <v-icon v-if="category.icon">{{ category.icon }}</v-icon>
                </v-sheet>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <v-sheet color="#212430" class="pa-3 rounded-lg">
                    <p>
                      Ou escolha um icone a partir da
                      <a href="https://fonts.google.com/icons" target="_blank">
                        galeria de icones do Google</a
                      >
                      e copie seu identificador, conforme a imagem.
                    </p>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-img
                max-height="250px"
                src="/choose_category_icon.png"
                class="choose-icon-category"
              ></v-img>
            </v-col>
          </v-row>
        </v-sheet>
        <v-sheet
          class="rounded-lg ma-3 py-10 px-3"
          color="second"
        >
          <v-row class="mx-2 mb-2">
            <h3>Categoria</h3>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Nome"
                :rules="rules.name"
                v-model="category.name"
                :value="category.name"
                outlined
                dense
              ></v-text-field>
              <sub-category
                v-for="(subCategory, i) in category.subCategories"
                :key="i"
                :subCategory="subCategory"
                :identificator="i"
                @onDelete="deleteSubCategory"
              />
              <v-btn @click="addSubCategory" text block color="primary"
                >Adicionar Sub-categoria</v-btn
              >
            </v-col>
          </v-row>
        </v-sheet>
        <v-btn color="primary" block class="rounded-lg" @click="saveCategory"
          >Salvar</v-btn
        >
      </v-form>
    </div>
  </div>
</template>

<script>
import subCategory from "~/components/categories/sub-category.vue";
import uniqid from "uniqid";
import ChooseIconDialog from "~/components/global/ChooseIconDialog.vue";

export default {
  components: { subCategory, ChooseIconDialog },
  data() {
    return {
      loading: {
        all: false,
      },
      rules: {
        icon: [(icon) => icon.length > 2 || "ícone obrigatório."],
        name: [(name) => name.length > 2 || "Nome obrigatório"],
      },
      category: {
        icon: "",
        id: `category-${uniqid()}`,
        name: "",
        subCategories: [],
      },
    };
  },
  async beforeMount(){
    this.loading.all = true;
    if(!this.$nuxt.$route.query.id) return this.loading.all = false;
    try {
      const response = await this.$axios(`/categories/get?id=${this.$nuxt.$route.query.id}`);
      this.category = response.data;
    } catch (e) {
      this.$store.commit('setGlobalDialog', {
          title: 'Falha ao carregar categorias',
          content: e.response?.data?.message || 'Erro ao conectar no banco de dados',
          show: true
        });
    }
    this.loading.all = false;
  },
  methods: {
    async saveCategory() {
      if (!this.$refs.form.validate()) return;
      this.loading.all = true;
      try {
        if(this.$nuxt.$route.query.id){
          await this.$axios.$post(`/categories/save?id=${this.$nuxt._route.query.id}`, this.category);
        } else {
          await this.$axios.$post('/categories/save', this.category);
        }
      } catch (e) {
        console.log(e);
      }
      this.loading.all = false;
      this.$router.push({ path: "/categories" });
    },
    deleteSubCategory(event) {
      this.category.subCategories.splice(event.identificator, 1);
    },
    addSubCategory() {
      this.category.subCategories.push({
        name: "",
        id: `sub-category-${uniqid()}`,
        subSubCategories: [],
      });
    },
  },
};
</script>

<style scoped>
.choose-icon-category {
  border: 1px solid #2a2e3c;
  border-radius: 10px;
}
</style>