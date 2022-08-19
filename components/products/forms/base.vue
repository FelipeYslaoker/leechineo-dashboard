<template>
  <div>
    <v-row>
      <v-col cols="12" lg="6">
        <v-carousel
          class="rounded-lg my-3"
          :continuous="false"
          :cycle="false"
          :show-arrows="true"
          delimiter-icon="mdi-minus"
          height="300px"
        >
          <v-carousel-item
            v-for="(image, i) in product.images"
            :key="i"
            :src="image"
          >
            <div class="pa-2">
              <v-btn @click="doImage('left', i)" v-if="i !== 0">
                <v-icon>chevron_left</v-icon>
              </v-btn>
              <v-btn @click="doImage('delete', i)">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-btn
                @click="doImage('right', i)"
                v-if="product.images.length > i + 1"
              >
                <v-icon>chevron_right</v-icon>
              </v-btn>
            </div>
          </v-carousel-item>
          <v-carousel-item v-if="product.images.length < 1">
            <v-sheet color="second" height="300px">
              <centralize>
                <v-btn text @click="onFilesSelected">
                  <md-icon color="md-primary">image</md-icon>
                </v-btn>
              </centralize>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
        <v-sheet
          v-if="product.images.length > 0"
          color="second"
          class="pa-3 rounded-lg"
        >
          <v-btn text block @click="onFilesSelected">
            <md-icon color="md-primary">image</md-icon>
          </v-btn>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <v-text-field
          :disabled="saving"
          outlined
          dense
          :rules="formRules.name"
          placeholder="Camiseta Larga"
          label="Nome do produto*"
          required
          v-model="product.name"
        >
        </v-text-field>
        <v-textarea
          :disabled="saving"
          outlined
          dense
          label="Descrição do produto (Opcional)"
          placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          required
          :rules="formRules.description"
          v-model="product.description"
        >
        </v-textarea>
        <v-sheet
          v-html="product.description"
          color="white"
          class="black--text pa-3 rounded-lg"
        ></v-sheet>
        <!--  -->
        <v-sheet class="my-3 pa-4 rounded-lg">
          <h3>Especificacões</h3>
          <v-sheet class="my-3">
            <div v-for="(specification, i) in product.specifications" :key="i" class="d-flex">
              <v-sheet
                class="ml-3 my-2 pa-2 rounded-lg"
                width="100%"
                color="primary"
              >
                {{specification.title}}
              </v-sheet>
              <v-sheet
                class="ml-3 my-2 pa-2 rounded-lg"
                width="100%"
                color="primary"
              >
                {{specification.description}}
              </v-sheet>
              <v-btn color="red" rounded elevation="0" class="ml-3" @click="deleteSpec(i)">
                <v-icon>delete</v-icon>
              </v-btn>
            </div>
          </v-sheet>
          <div class="d-flex flex-row justify-around">
            <v-text-field
              v-model="spec.title"
              outlined
              dense
              label="Título"
              class="mx-1"
            ></v-text-field>
            <v-text-field
              v-model="spec.description"
              outlined
              dense
              label="Descrição"
              class="mx-1"
            ></v-text-field>
            <v-btn color="primary" rounded elevation="0" class="ml-3" @click="addSpec">
              <v-icon>add</v-icon>
            </v-btn>
          </div>
        </v-sheet>
        <!--  -->
        <input
          type="file"
          id="edit-create-product-file-input"
          accept="image/png, image/jpeg"
          multiple="true"
          style="display: none"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          :items="['BR', 'CN']"
          :value="product.arm"
          placeholder="Armazen"
          outlined
          dense
          v-model="product.arm"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          :items="brands.map((brand) => brand.name)"
          v-model="selectedBrand"
          placeholder="Marca"
          outlined
          dense
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-btn text color="primary" block @click="dialog = true"
          >Categoria</v-btn
        >
        <v-sheet
          :color="$store.state.secondaryColor"
          class="pa-2 rounded-lg"
          v-if="product.category && categories"
        >
          <template v-if="product.category && categories.length > 0">
            {{
              categories.filter(
                (category) => category.id === product.category.category
              )[0].name
            }}
            <template v-if="product.category.subcategory">
              {{
                "/ ↣ / " +
                categories
                  .filter(
                    (category) => category.id === product.category.category
                  )[0]
                  .subCategories.filter(
                    (subCategory) =>
                      subCategory.id === product.category.subcategory
                  )[0].name
              }}
              <template v-if="product.category.subsubcategory">
                {{
                  " / ↣ / " +
                  categories
                    .filter(
                      (category) => category.id === product.category.category
                    )[0]
                    .subCategories.filter(
                      (subCategory) =>
                        subCategory.id === product.category.subcategory
                    )[0]
                    .subSubCategories.filter(
                      (subSubCategory) =>
                        subSubCategory.id === product.category.subsubcategory
                    )[0].name
                }}
              </template>
            </template>
          </template>
          <v-btn
            block
            text
            color="error"
            v-if="product.category && categories"
            @click="chooseCategory(undefined)"
            >Limpar</v-btn
          >
        </v-sheet>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Escolher categoria</v-card-title>
        <v-card-text>
          <v-sheet
            class="pa-3 ma-3 rounded-lg"
            color="second"
            v-for="category in categories"
            :key="category.id"
          >
            <v-icon class="ma-3">{{ category.icon }}</v-icon>
            {{ category.name }}
            <v-expand-transition>
              <div v-show="category.expand">
                <v-sheet
                  class="pa-3 ma-3 rounded-lg"
                  v-for="subCategory in category.subCategories"
                  :key="subCategory.id"
                  color="third"
                >
                  <v-row dense>
                    {{ subCategory.name }}
                  </v-row>
                  <v-sheet
                    class="pa-3 ma-3 rounded-lg"
                    v-for="subSubCategory in subCategory.subSubCategories"
                    :key="subSubCategory.id"
                  >
                    {{ subSubCategory.name }}
                    <v-btn
                      block
                      text
                      @click="
                        chooseCategory({
                          category: category.id,
                          subcategory: subCategory.id,
                          subsubcategory: subSubCategory.id,
                        })
                      "
                    >
                      <v-icon>done</v-icon>
                    </v-btn>
                  </v-sheet>
                  <v-btn
                    block
                    text
                    @click="
                      chooseCategory({
                        category: category.id,
                        subcategory: subCategory.id,
                      })
                    "
                  >
                    <v-icon>done</v-icon>
                  </v-btn>
                </v-sheet>
              </div>
            </v-expand-transition>
            <v-sheet
              class="ma-3 pa-3 rounded-lg"
              color="third"
            >
              <v-row>
                <v-col cols="6">
                  <v-btn
                    block
                    text
                    @click="chooseCategory({ category: category.id })"
                  >
                    <v-icon>done</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    block
                    :disabled="category.subCategories.length === 0"
                    text
                    @click="category.expand = !category.expand"
                  >
                    <v-icon>{{
                      !category.expand ? "expand_more" : "expand_less"
                    }}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-sheet>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Centralize from "~/components/global/Centralize.vue";
export default {
  components: { Centralize },
  props: ["saving", "product"],
  data() {
    return {
      files: [],
      spec: {
        title: '',
        description: ''
      },
      categories: [],
      selectedBrand: "",
      selectedArm: "",
      showDialog: false,
      brands: [],
      dialog: false,
      formRules: {
        images: [],
        name: [
          (text) => !!text || "Campo obrigatório.",
          (text) => text.length >= 2 || "No mínimo dois caracteres.",
        ],
        description: [
          (text) => !text || text.length >= 2 || "No mínimo dois caracteres.",
        ],
      },
    };
  },
  watch: {
    selectedBrand() {
      this.product.brand = this.brands.filter(
        (brand) => brand.name === this.selectedBrand
      )[0];
    },
  },
  async created() {
    this.selectedBrand = (this.product.brand || {}).name;
    try {
      const categoryResponse = await this.$axios.$get("/categories/get");
      const brandsResponse = await this.$axios.$get("/brands/get");
      this.brands = brandsResponse.results;
      if (categoryResponse.results) {
        this.categories = categoryResponse.results.map((category) => {
          return { expand: false, ...category };
        });
      }
    } catch (e) {}
  },
  methods: {
    chooseCategory(params) {
      this.product.category = params;
      this.dialog = false;
    },
    onFilesSelected() {
      const fileInput = document.querySelector(
        "#edit-create-product-file-input"
      );
      fileInput.addEventListener("input", (input) => {
        for (const file of input.target.files) {
          const url = URL.createObjectURL(file);
          this.$emit("onFilesSelected", { url, file });
        }
        input.target.value = "";
      });
      fileInput.click();
    },
    doImage(action, index) {
      this.$emit("doImage", { action, index });
    },
    addSpec(){
      this.$emit('addSpec',{ ...this.spec});
      this.spec.title = ''
      this.spec.description = ''
    },
    deleteSpec(index){
      this.$emit('deleteSpec', index)
      this.$forceUpdate()
    },
  },
};
</script>

<style>
</style>