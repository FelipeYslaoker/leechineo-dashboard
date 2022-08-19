<template>
  <v-sheet class="my-3 pa-3 rounded-lg">
    <v-row class="mx-3 my-2">
      <p>Sub-sub-categoria</p>
      <v-spacer></v-spacer>
      <v-btn color="red" text @click="emitEvent('delete')">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-row>
    <v-text-field label="Nome" :rules="rules.name" outlined dense v-model="subSubCategory.name"></v-text-field>
  </v-sheet>
</template>

<script>
export default {
  data(){
    return {
      rules: {
        name: [
          name => name.length > 2 || 'Nome obrigatório'
        ]
      }
    }
  },
    props: ['subSubCategory', 'identificator', 'allSubSubCategoriesLength'],
    methods: {
        emitEvent(event, direction){
            this.$emit(event, {identificator: this.identificator, direction});
        },
    }
};
</script>

<style>
</style>