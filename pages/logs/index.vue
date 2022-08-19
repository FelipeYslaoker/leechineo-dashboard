<template>
  <div>
    <loading v-if="loading"></loading>
    <db-error v-else-if="error"></db-error>
    <div v-else-if="logs.length < 1">
      <centralize>
        <div class="text-center">
          <md-icon size="60" color="md-primary">pets</md-icon>
        </div>
        <h1 class="text-center primary--text font-weight-light">
          Sem registros.
        </h1>
      </centralize>
    </div>
    <div v-else>
      <v-simple-table class="rounded-xl" :style="`background-color: ${$store.state.secondaryBackground}`">
        <template v-slot:default>
          <thead>
            <tr>
              <th></th>
              <th>Evento</th>
              <th>Titulo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, i) in logs" :key="i">
              <td v-if="log.type === 'created_product' || log.type === 'edited_product'">
                <v-img
                  :src="log.body.after.images[0]"
                  width="50px"
                  height="50px"
                  class="rounded-lg my-3"
                ></v-img>
              </td>
              <td v-else>
                <v-sheet class="rounded-lg my-3 pa-2" width="50px" height="50px" color="primary">
                    <v-icon large color="white"> mdi-clipboard-text </v-icon>
                </v-sheet>
              </td>
              <td>
                 {{ log.title }} 
              </td>
              <td v-if="log.type === 'created_product' || log.type === 'edited_product'">
                  {{log.body.after.name}}
              </td>
              <td v-else>
                  {{log.description}}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="Math.ceil(totalLogs / 10)"
          :total-visible="7"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import DbError from '@/components/errors/db-error.vue';
import Loading from '~/components/global/loading.vue';
export default {
  components: {DbError, Loading},
  data() {
    return {
      page: 1,
      totalLogs: 1000,
      logs: [],
      loading: true,
      error: undefined,
    };
  },
   head(){
    return {
      title: 'Registros'
    }
  },
  watch: {
    async page(value){
      this.loading = true;
      try {
        const response = await this.$axios(`/logs/get?page=${value}&limit=10`);
        this.logs = response.data.results;
        this.totalLogs = response.data.totalItems;
        this.loading = false;
      } catch (e) {
        this.error = 'db_error';
      }
      this.loading = false;
    }
  },
  async beforeCreate() {
    try {
      const response = await this.$axios("/logs/get?page=1&limit=10");
      this.logs = response.data.results || [];
      this.totalLogs = response.data.totalItems;
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.error = "db_error";
    }
  },
};
</script>

<style>
</style>