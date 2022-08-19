<template>
  <v-col cols="12" md="4">
    <v-card
      class="rounded-lg"
      max-width="600"
      color="grey lighten-3"
      elevation="0"
    >
      <v-img
        v-if="product.images.length > 0"
        :src="product.images[0]"
        height="200px"
      ></v-img>

      <v-card-title>
        {{ product.name }}
      </v-card-title>
      <v-card-subtitle v-if="product.description">
        {{ product.description }}
      </v-card-subtitle>

      <v-card-actions>
        <v-btn color="primary" text> Editar </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: ["product"],
};
</script>

<style>
</style>