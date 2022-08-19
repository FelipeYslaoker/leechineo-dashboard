<template>
  <div>
    <loading v-if="loading.all"></loading>
    <v-row v-else>
      <v-col cols="12" md="6">
        <v-radio-group v-model="sectionTypes.selected" row label="Tipo:">
          <v-radio
            v-for="(option, i) in sectionTypes.options"
            :key="i"
            :label="option.name"
            :value="option.type"
          ></v-radio>
        </v-radio-group>
        <div id="section-properties">
          <div v-if="sectionTypes.selected === 'product'"></div>
          <div v-else-if="sectionTypes.selected === 'banner'">
            <v-switch
              label="Mostrar nome do produto"
              inset
              v-model="sectionTypes.options[1].properties.showProductName"
            ></v-switch>
            <v-switch
              label="Mostrar descricao do produto"
              inset
              v-model="
                sectionTypes.options[1].properties.showProductDescription
              "
            ></v-switch>
            <v-switch
              label="Mostrar nome da fabricante do produto"
              inset
              v-model="sectionTypes.options[1].properties.showManufacturerName"
            ></v-switch>
            <v-switch
              label="Tile mode"
              inset
              v-model="sectionTypes.options[1].properties.tileMode"
            ></v-switch>
          </div>
        </div>
        <v-btn text block color="primary" @click="save">Salvar</v-btn>
        <v-sheet
          class="rounded-lg pa-3 my-4"
          color="second"
        >
          <div class="text-center">
            <md-icon size="60" color="md-primary">pets</md-icon>
          </div>
          <h1 class="text-center primary--text font-weight-light">
            Sem previas no momento.
          </h1>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          outlined
          dense
          label="Nome da secao"
          v-model="section.name"
          placeholder="Novidades da semana"
        ></v-text-field>
        <section-edit
          :items="items"
          @openFileDialog="openFileDialog"
          @addProduct="addProduct"
          @changedImage="changeImage"
          @unbind="unbind"
          @deleteProduct="deleteProduct"
          @changeByGalley="changeByGalley"
          @moveTo="moveTo"
          @bindProduct="bindProduct"
        ></section-edit>
        <input
          type="file"
          id="section-creation-file-input"
          accept="image/png, image/jpeg"
          multiple="true"
          style="display: none"
        />
        <input
          type="file"
          id="section-creation-file-input-one"
          accept="image/png, image/jpeg"
          style="display: none"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import allProductsDialog from "~/components/sections/allProductsDialog.vue";
import SectionEdit from "~/components/sections/section-edit.vue";
import uniqid from "uniqid";
import Loading from '~/components/global/loading.vue';

export default {
  components: { allProductsDialog, SectionEdit, Loading },
  methods: {
    async bindProduct(event){
      this.loading.all = true;
      const response = await this.$axios(`product/get?id=${event.id}`);
      const product = response.data.product;
      this.items[event.index].product = product;
      this.temp = this.items[event.index];
      this.items.push(this.temp);
      this.items.pop(this.temp);
      this.loading.all = false;
    },
    async save(){
      this.loading.all = true;
      const position = (await this.$axios('section/index')).data.index || 0;
      const items = [];
      for (const index in this.items) {
        const item = this.items[index];
        if(item.file){
          const dirRef = await this.$fire.storage.ref();
          const uid = uniqid(`${index}-`);
          const imageRef = dirRef.child(`home/section-${uniqid()}/${uid}`);
          await imageRef.put(item.file);
          const url = await imageRef.getDownloadURL();
          item.image = url;
        }
        console.log(item.product);
        items.push({
          image: item.image,
          product: item.product ? item.product.urlNumber : undefined
        });
        console.log(items);
      }
      console.log('FIM DO LOOP');
      await this.$axios.post('/section/create', {
        name: this.section.name,
        items,
        type: this.sectionTypes.selected,
        rules: this.sectionTypes.options.filter((option) => option.type === this.sectionTypes.selected)[0].properties,
        position
      });
      this.loading.all = false;
       this.$router.push({ path: "/sections" });
    },
    moveTo(event){
      const removedItem = this.items.splice(event.index, 1)[0];
      let moveFor;
      if(event.side === 'left') {
        moveFor = event.index - 1; 
      } else {
        moveFor = event.index + 1;
      }
      this.items.splice(moveFor, 0, removedItem);
    },
    deleteProduct(event){
      this.items.splice(event, 1);
    },
    changeByGalley(event){
      this.tempIndex = event;
      const fileInput = document.querySelector("#section-creation-file-input-one");
      fileInput.addEventListener("input", (e) => {
        const file = e.target.files[0];
        if(file){
          const url = URL.createObjectURL(file);
          this.items[this.tempIndex].image = url;
          this.items[this.tempIndex].file = file;
          fileInput.value = "";
        }
      });
      fileInput.click();
    },
    unbind(event){
      const item = this.items[event];
      item.product = undefined;
      this.temp = item;
      this.items.push(this.temp);
      this.items.pop(this.temp);
    },
    changeImage(event){
      const item = this.items[event.index];
      item.image = event.after;
    },
    openFileDialog() {
      const fileInput = document.querySelector("#section-creation-file-input");
      fileInput.addEventListener("input", (e) => {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
          this.items.push({ image: URL.createObjectURL(files[i]), file: files[i] });
        }
        fileInput.value = "";
      });
      fileInput.click();
    },
    async addProduct(productId) {
      this.loading.all = true;
      try {
        const product = (await this.$axios(`/product/get?id=${productId}`)).data
          .product;
        this.items.push({ product, image: product.images[0] });
      } catch (e) {
        this.error = "db_error";
      }
      this.loading.all = false;
    },
  },
  head(){
    return {
      title: 'Seções - Criar'
    }
  },
  data() {
    return {
      temp: undefined,
      section: {
        name: '',
      },
      error: undefined,
      loading: {
        productsList: false,
        all: false,
      },
      items: [],
      showDialog: false,
      tempIndex: undefined,
      sectionTypes: {
        selected: "banner",
        options: [
          {
            type: "product",
            name: "Produto",
          },
          {
            type: "banner",
            name: "Banner",
            properties: {
              showProductName: true,
              showProductDescription: false,
              showManufacturerName: false,
              tileMode: true
            },
          },
        ],
      },
    };
  },
  watch: {
    items(v) {},
  },
};
</script>

<style>
.border {
  border: 2px solid orange !important;
}
</style>