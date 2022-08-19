<template>
  <v-dialog v-model="showDialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-on="on" v-bind="attrs" class="mb-3" text color="primary" block>Escolher ícone</v-btn>
    </template>
    <v-card color="first">
      <v-card-title>Ícones</v-card-title>
      <v-sheet
        class="pa-2 ma-2 rounded-lg"
        color="second"
        v-for="category in icons.categories"
        :key="category.key"
      >
        {{ category.name }}
        <v-row dense>
          <v-col v-for="icon in category.icons" :key="icon.codepoint">
            <v-sheet
              class="rounded-lg pa-5 ma-2"
              color="third"
              
            >
              <v-icon @click="emitChoosedIconEvent(icon)">{{ icon.ligature }}</v-icon>
            </v-sheet>
          </v-col>
        </v-row>
      </v-sheet>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
      icons: {
        categories: [
          {
            key: "",
          },
        ],
      },
    };
  },
  methods: {
    emitChoosedIconEvent(icon) {
        this.$emit('onChoosedIcon', icon);
        this.showDialog = false;
    },
  },
  async created() {
    const response = await this.$axios(`${location.origin}/icons.json`);
    this.icons = response.data;
  },
};
</script>

<style>
</style>