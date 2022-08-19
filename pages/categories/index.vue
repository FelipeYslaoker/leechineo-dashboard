<template>
  <div>
    <db-error v-if="error"></db-error>
    <loading v-else-if="loading.all"></loading>
    <empty
      v-else-if="categories.length < 1"
      creationPage="/categories/manipulate"
      >categorias</empty
    >
    <div v-else>
      <v-sheet
        class="pa-3 ma-3 rounded-lg"
        color="second"
        v-for="category in categories"
        :key="category.id"
      >
        <v-icon class="ma-3">{{ category.icon }}</v-icon> {{ category.name }}
        <v-expand-transition>
          <div v-show="category.expand">
            <v-sheet
              class="pa-3 ma-3 rounded-lg"
              v-for="subCategory in category.subCategories"
              :key="subCategory.id"
              color="third"
            >
              {{ subCategory.name }}
              <v-sheet
                class="pa-3 ma-3 rounded-lg"
                v-for="subSubCategory in subCategory.subSubCategories"
                :key="subSubCategory.id"
              >
                {{ subSubCategory.name }}
              </v-sheet>
            </v-sheet>
          </div>
        </v-expand-transition>
        <v-sheet
          class="ma-3 pa-3 rounded-lg"
          color="third"
        >
          <v-row>
            <v-col cols="4">
              <v-btn
                block
                text
                @click="
                  $nuxt._router.push({
                    path: '/categories/manipulate',
                    query: {
                      id: category.id,
                    },
                  })
                "
              >
                <v-icon>edit</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn text block color="error" @click="showDialog">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn
                block
                :disabled="category.subCategories.length === 0"
                text
                @click="category.expand = !category.expand"
              >
                <v-icon>{{
                  !category.expand ? "expand_more" : "expand_less"
                }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-dialog
            v-model="deleteDialog"
            max-width="600px"
            :persistent="loading.deleting"
          >
            <v-card>
              <v-card-title v-if="!loading.deleting">
                Tem certeza que deseja apagar este item?
              </v-card-title>
              <v-card-title v-if="loading.deleting">
                <v-row align="center" dense align-content="center">
                  <v-col cols="12">
                    <v-progress-circular
                  :size="50"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-actions v-if="!loading.deleting">
                <v-row dense>
                  <v-col cols="6">
                    <v-btn
                      text
                      block
                      color="error"
                      @click="deleteCategory(category.id)"
                      >Apagar</v-btn
                    >
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      text
                      block
                      color="primary"
                      @click="deleteDialog = false"
                      >Cancelar</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-sheet>
      </v-sheet>
      <v-btn fab color="primary" to="/categories/manipulate" fixed bottom right>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  async created() {
    this.loading.all = true;
    try {
      const response = await this.$axios("/categories/get");
      if (response.data) {
        this.categories = response.data.map((category) => {
          return { expand: false, ...category };
        });
      }
    } catch (e) {
      console.log(e);
      this.error = "db_error";
    }
    this.loading.all = false;
  },
  methods: {
    showDialog() {
      this.loading.deleting = false;
      this.deleteDialog = true;
    },
    async deleteCategory(id) {
      this.loading.deleting = true;
      try {
        await this.$axios.$delete(`/categories/delete?id=${id}`);
        this.categories.splice(
          this.categories.indexOf(
            this.categories.filter((category) => category.id === id)[0]
          ),
        );
      } catch (e) {
        console.log(e);
        this.error = "db_error";
      }
      this.deleteDialog = false;
    },
  },
  data() {
    return {
      error: undefined,
      loading: {
        all: true,
        deleting: false,
      },
      deleteDialog: false,
      categories: [],
    };
  },
};
</script>

<style>
</style>