<template>
  <v-dialog v-model="showDialog" max-width="700">
    <v-card
      color="first"
      elevation="0"
      class="rounded-lg"
    >
      <v-card-title>Selecionar categoria</v-card-title>
      <v-card-text>
        <v-sheet
          :class="`px-3 my-2 rounded-lg ${category ? '' : 'pt-3'}`"
          color="third"
        >
          <v-subheader v-show="category">Categoria</v-subheader>
          <v-select
            placeholder="Categoria"
            clearable
            outlined
            dense
            :items="categories.map((category) => category.name)"
            v-model="category"
          ></v-select>
        </v-sheet>
        <v-sheet
          :class="`px-3 my-2 rounded-lg ${subCategory ? '' : 'pt-3'}`"
          color="third"
          v-if="category"
        >
          <v-subheader v-show="subCategory">SubCategoria</v-subheader>
          <v-select
            clearable
            placeholder="SubCategoria"
            outlined
            dense
            :items="
              categories
                .filter((ctgry) => ctgry.name === category)[0]
                .subCategories.map((subCategory) => subCategory.name)
            "
            v-model="subCategory"
          ></v-select>
        </v-sheet>
        <v-sheet
          :class="`px-3 my-2 rounded-lg ${subSubCategory ? '' : 'pt-3'}`"
          color="third"
          v-if="subCategory && category"
        >
          <v-subheader v-show="subSubCategory">SubSubCategoria</v-subheader>
          <v-select
            placeholder="SubSubCategoria"
            clearable
            outlined
            dense
            :items="
              categories
                .filter((ctgry) => ctgry.name === category)[0]
                .subCategories.filter(
                  (subCtgry) => subCtgry.name === subCategory
                )[0]
                .subSubCategories.map((subSubCategory) => subSubCategory.name)
            "
            v-model="subSubCategory"
          ></v-select>
        </v-sheet>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="primary" @click="submit">Concluir</v-btn>
        <v-btn text color="red" @click="showDialog = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
async function loadAsyncData(Vue) {
  try {
    const response = await Vue.$axios.$get("/categories/get");
    Vue.categories = response.results || [];
  } catch (e) {}
}
export default {
  props: ["value", "defaultCategory"],
  async created() {
    await loadAsyncData(this);
  },
  data() {
    return {
      showDialog: this.value,
      categories: [],
      category: this.defaultCategory?.category || "",
      subCategory: this.defaultCategory?.subCategory || "",
      subSubCategory: this.defaultCategory?.subSubCategory || "",
    };
  },
  methods: {
    submit() {
      if (!this.category) {
        this.subCategory = "";
        this.subSubCategory = "";
      }
      if (!this.subSubCategory) {
        this.subSubCategory = "";
      }
      const category = this.category
        ? this.categories.filter(
            (category) => category.name === this.category
          )[0]
        : "";
      const subCategory = this.subCategory
        ? category.subCategories.filter(
            (subCategory) => subCategory.name === this.subCategory
          )[0]
        : "";
      const subSubCategory = this.subSubCategory
        ? subCategory.subSubCategories.filter(
            (subSubCategory) => subSubCategory.name === this.subSubCategory
          )[0]
        : "";
      const productCategory = {};
      if (category) {
        productCategory.category = category.id;
        productCategory.categoryName = category.name;
      }
      if (subCategory) {
        productCategory.subCategory = subCategory.id;
        productCategory.subCategoryName = subCategory.name;
      }
      if (subSubCategory) {
        productCategory.subSubCategory = subSubCategory.id;
        productCategory.subSubCategoryName = subSubCategory.name;
      }
      this.$emit("submited", productCategory);
      this.showDialog = false;
    },
  },
  watch: {
    showDialog(value) {
      if (value) {
        this.category = this.defaultCategory?.category || "";
        this.subCategory = this.defaultCategory?.subCategory || "";
        this.subSubCategory = this.defaultCategory?.subSubCategory || "";
        console.log(this.defaultCategory?.subCategory);
      } else {
        this.category = "";
      }
      this.$emit("input", this.showDialog);
    },
    value() {
      this.showDialog = this.value;
    },
  },
};
</script>

<style>
</style>