<template>
   <v-row align="center" justify="center">
        <v-btn-toggle
          v-if="!saving && product.variantsType"
          v-model="product.variantsType"
          dense
          tile
          color="deep-purple accent-3"
        >
          <v-btn value="unique" @click="resetValidation">Única</v-btn>
          <v-btn value="simple" @click="resetValidation">Simples</v-btn>
          <v-btn value="compound" @click="resetValidation">Composta</v-btn>
        </v-btn-toggle>
      </v-row>
</template>

<script>
export default {
    props: ['saving', 'product'],
    methods: {
        resetValidation(){
            this.$emit('resetValidation');
        }
    }
}
</script>

<style>

</style>