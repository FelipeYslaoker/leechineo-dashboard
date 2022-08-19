<template>
  <div>
    <centralize>
      <div class="text-center">
        <md-icon size="60" color="md-primary">pets</md-icon>
      </div>
      <h1 class="text-center primary--text font-weight-light">Sem <slot></slot>.</h1>
    </centralize>
    <v-btn v-if="creationPage" fab color="primary" :to="creationPage" fixed bottom right>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
    props: ['creationPage'],
};
</script>

<style>
</style>