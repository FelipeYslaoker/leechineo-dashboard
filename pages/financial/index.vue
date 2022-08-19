<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-sheet class="pa-2 ma-3 rounded-lg" max-height="500" color="second">
          <v-virtual-scroll :items="currenciesList" :item-height="70" height="250">
            <template v-slot:default="{ item }">
              <v-sheet class="d-flex pa-3 ma-2 justify-space-between rounded-lg" color="third">
                <v-sheet color="primary" class="pa-2 rounded-lg mr-3">{{item.code}}</v-sheet>
                <v-sheet class="text-truncate pa-2" color="transparent">{{item.name}}</v-sheet>
                <v-sheet color="primary rounded-lg" class="pa-2">USD{{ item.value }}</v-sheet>
              </v-sheet>
            </template>
          </v-virtual-scroll>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  async beforeMount() {
    this.$nuxt.$loading.start();
    try {
      const response = await this.$axios.$get("/currencies/get");
      this.currencies = response
    } catch (e) {
      console.log(e);
    }
    this.$nuxt.$loading.finish();
  },
  computed: {
    currenciesList(){
      return this.currencies
    }
  },
  data() {
    return {
      currencies: [],
    };
  },
};
</script>

<style>
</style>