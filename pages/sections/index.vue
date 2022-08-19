<template>
  <div>
    <loading v-if="loading"></loading>
    <db-error v-else-if="error"></db-error>
    <v-row v-else>
      <v-col cols="12">
        <v-switch
          inset
          label="Permitir seções geradas pelo algoritmo"
          v-model="allowSectionsGeneratedByAlgorithm"
        ></v-switch>
        <div v-if="sections.length === 0">
          <centralize>
            <div class="text-center">
              <md-icon size="60" color="md-primary">pets</md-icon>
            </div>
            <h1 class="text-center primary--text font-weight-light">
              Sem seções.
            </h1>
          </centralize>
        </div>
        <div v-else v-for="(section, i) in sections" :key="i">
          <v-sheet class="rounded-lg pa-3 my-3" color="second">
            <h2 class="mx-3 mt-2">Tipo: {{section.type}}</h2>
            <h2 class="mx-3 mt-2">{{section.name ? `Nome: ${section.name}` : ``}}</h2>
            <v-row class="my-3 mx-4">
              <section-banner :section="section" v-if="section.type === 'banner'"></section-banner>
              <v-col v-for="(item, i) in section.items" :key="i" v-else class="pa-1"
        cols="6"
        sm="4"
        md="3"
        lg="3"
        xl="2">
                <section-item :item="item"></section-item>
              </v-col>
            </v-row>
          </v-sheet>
        </div>
      </v-col>
    </v-row>
    <v-btn v-if="!error && !loading" fab fixed bottom right color="primary" to="/sections/create">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import DbError from '~/components/errors/db-error.vue';
import sectionItem from '~/components/sections/section-item.vue';

export default {
  components: { sectionItem, DbError },
  async beforeCreate(){
    this.loading = true;
    try {
      const response = await this.$axios('section/get');
      this.sections = response.data.sections;
      console.log(this.sections);
    } catch (e) {
      this.error = 'db_error';
    }
    this.loading = false;
  },
  head(){
    return {
      title: 'Seções'
    }
  },
  data() {
    return {
      allowSectionsGeneratedByAlgorithm: true,
      sections: [],
      error: undefined,
      loading: true,
    };
  },
};
</script>
SectionItem