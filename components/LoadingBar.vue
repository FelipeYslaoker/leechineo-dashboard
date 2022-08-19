<template>
  <div v-if="loading">
    <v-dialog v-model="loading" width="200" persistent class="rounded-xl">
      <v-card height="200" class="rounded-xl" elevation="0">
        <v-sheet
          class="d-flex flex-row justify-center align-center"
          height="200"
        >
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
          />
        </v-sheet>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
</style>
