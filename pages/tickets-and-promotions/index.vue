<template>
  <div>
    <Empty
      creationPage="/tickets-and-promotions/manipulate"
      v-if="tickets.length < 1"
      >cupons</Empty
    >
    <div v-else>
      <v-sheet
        width="100%"
        height="50"
        class="ma-3 d-flex justify-space-between align-center rounded-lg px-3"
        color="second"
        v-for="ticket in tickets"
        :key="ticket._id"
      >
        <span>{{ ticket.name }}</span>
        <v-sheet color="third" class="rounded-lg">
          <v-btn
            text
            color="primary"
            :to="`/tickets-and-promotions/manipulate?id=${ticket._id}`"
            >Editar</v-btn
          >
          <v-btn text color="red" @click="dialog(ticket._id)">
            <v-icon> delete </v-icon>
          </v-btn>
        </v-sheet>
      </v-sheet>
      <v-pagination
        v-model="page"
        :length="Math.ceil(totalTickets / 10)"
        :total-visible="7"
      ></v-pagination>
      <v-btn
        fab
        color="primary"
        to="/tickets-and-promotions/manipulate"
        fixed
        bottom
        right
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title>Deseja apagar este cupom?</v-card-title>
        <v-card-actions>
          <v-btn @click="deleteTicket" text color="red">Apagar</v-btn>
          <v-btn @click="deleteDialog = false" text>Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tickets: [],
      page: 1,
      totalTickets: 0,
      deleteDialog: false,
      ticketToDelete: "",
    };
  },
  methods: {
    async loadData() {
      try {
        const response = await this.$axios.$get("/ticket/get?page=1&&limit=10");
        this.tickets = response.results || [];
        this.totalTickets = response.totalItems;
      } catch (e) {
        this.$store.commit("setGlobalDialog", {
          title: "Erro ao salvar o cupom",
          content:
            e.response?.data?.message || "Falha ao conectar no banco de dados.",
          show: true,
        });
      }
    },
    dialog(id) {
      this.ticketToDelete = id;
      this.deleteDialog = true;
    },
    async deleteTicket() {
      this.deleteDialog = false;
      this.$nuxt.$loading.start();
      try {
        await this.$axios.$delete(`/ticket/delete?id=${this.ticketToDelete}`);
        await this.loadData();
      } catch (e) {
        this.$store.commit("setGlobalDialog", {
          title: "Erro ao salvar o cupom",
          content:
            e.response?.data?.message || "Falha ao conectar no banco de dados.",
          show: true,
        });
      }
      this.$nuxt.$loading.finish();
    },
  },
  watch: {
    async page(newValue) {
      this.$nuxt.$loading.start();
      try {
        const response = await this.$axios(
          `/ticket/get?page=${newValue}&limit=10`
        );
        this.tickets = response.data.results;
        this.totalTickets = response.data.totalItems;
      } catch (e) {
        console.log(e);
      }
      this.$nuxt.$loading.finish();
    },
  },
  async beforeMount() {
    await this.loadData();
  },
};
</script>

<style>
</style>
