<template>
  <v-sheet color="third" class="my-3 pa-3 rounded-lg">
    <v-row class="mx-3 my-2">
      Sub-categoria

      <v-spacer></v-spacer>
      <v-btn color="red" text @click="deleteSubCategory">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-row>
    <v-text-field
      outlined
      dense
      label="Nome"
      :rules="rules.name"
      v-model="subCategory.name"
    ></v-text-field>
    <div v-for="(subSubCategory, i) in subCategory.subSubCategories" :key="i">
      <sub-sub-category
        :subSubCategory="subSubCategory"
        @delete="deleteSubSubCategory"
        :identificator="i"
        :allSubSubCategoriesLength="subCategory.subSubCategories.length"
      />
    </div>
    <v-btn color="primary" text block @click="addSubSubCategory"
      >Adiconar Sub-sub-categoria</v-btn
    >
  </v-sheet>
</template>

<script>
import subSubCategory from "./sub-sub-category.vue";
import uniqid from 'uniqid';

export default {
  components: { subSubCategory },
  props: ["subCategory", "identificator"],
  data(){
    return {
      rules: {
        name: [
          name => name.length > 2 || 'Nome obrigatório'
        ]
      }
    }
  },
  methods: {
    addSubSubCategory() {
      this.subCategory.subSubCategories.push({ name: "", id: `sub-sub-category-${uniqid()}` });
    },
    deleteSubSubCategory(event) {
      this.subCategory.subSubCategories.splice(event.identificator, 1);
    },
    deleteSubCategory(){
      this.$emit('onDelete', {identificator: this.identificator});
    }
  },
};
</script>

<style>
</style>