<template>
  <div>
    <v-row align="center" align-content="center" justify="center" dense>
      <v-col cols="12" md="6">
        <v-row dense align-content="center" align="center" justify="center">
          <v-color-picker
            v-model="picker"
            elevation="15"
            swatches-max-height="100"
            show-swatches
          ></v-color-picker>
        </v-row>
      </v-col>
      <v-col class="mx-5">
        <v-form ref="form" class="mt-4">
          <v-row dense>
            <v-text-field
              v-model="name"
              outlined
              dense
              label="Nome da marca"
            ></v-text-field>
          </v-row>
          <v-row dense>
            <v-text-field
              v-model="url"
              outlined
              dense
              label="Site da marca"
            ></v-text-field>
          </v-row>
          <v-row dense>
            <v-btn text block color="primary" @click="save" :loading="loading.saving">Salvar</v-btn>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: {
        all: false,
        saving: false
      },
      name: "",
      url: "",
      error: {
        show: false,
        error: null
      },
      picker: {
        hex: "",
      },
    };
  },
  methods: {
    async save(){
      this.loading.saving = true;
      try {
        await this.$axios.$post('/brands/create', {
          name: this.name,
          url: this.url,
          color: this.picker.hex
        });
      } catch (e) {
        this.error.error = e;
        this.error.show = true;
      }
      this.loading.saving = false;
    }
  }
};
</script>

<style>
</style>