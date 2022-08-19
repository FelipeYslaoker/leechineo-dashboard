<template>
  <div>
    <v-expand-transition
      v-for="(option, i) in product.variants.simpleOptions"
      :key="i"
    >
      <v-sheet
        class="rounded-lg pa-3 my-3"
        color="fourth"
        v-show="option.show"
        :id="`simple-variant-${i}`"
      >
        <v-text-field label="Nome da variante" outlined dense></v-text-field>
        <v-text-field label="Estoque" outlined dense></v-text-field>
        <a
          :href="`#simple-variant-${i}`"
          style="display: none"
          :id="`simple-variant-${i}-button`"
        ></a>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-sheet color="third" class="pa-2 my-2 rounded-lg">
              <v-subheader>Método de envio</v-subheader>
              <v-sheet
                color="fourth"
                class="pa-2 ma-2 rounded-lg"
                v-if="option.shippingMethod"
                >{{ option.shippingMethod.name }}</v-sheet
              >
              <v-btn
                text
                block
                color="primary"
                @click="option.selectShippingMethod = true"
                >{{ option.shippingMethod ? "Mudar" : "Selecionar" }}</v-btn
              >
              <select-shipping-method
                v-model="option.selectShippingMethod"
                @selected="setShippingMethod($event, 'simple', i)"
              ></select-shipping-method>
            </v-sheet>
          </v-col>
          <v-col cols="12" md="6">
            <v-sheet color="third" class="pa-2 my-2 rounded-lg">
              <v-subheader v-if="!option.image">Imagem</v-subheader>
              <template v-if="option.image">
                <v-img
                  alt="Imagem da variante"
                  :src="option.image.url"
                  width="100%"
                  height="150px"
                  class="rounded-lg my-2"
                ></v-img>
              </template>
              <v-btn
                text
                block
                color="primary"
                @click="option.selectImages = true"
                >{{ option.image ? "Editar" : "Selecionar" }}</v-btn
              >
              <v-btn
                v-if="option.image"
                @click="option.image = null"
                color="red"
                text
                block
                >Apagar</v-btn
              >
              <select-images
                v-model="option.selectImages"
                @submited="setImages($event, 'simple', i)"
                :images="option.image ? [option.image.url] : []"
              ></select-images>
            </v-sheet>
          </v-col>
        </v-row>
        <v-sheet color="third" class="pa-2 my-2 rounded-lg">
          <v-text-field
            outlined
            dense
            label="Preço*"
            type="number"
            class="mt-5"
          ></v-text-field>
          <v-subheader>Moeda</v-subheader>
          <v-sheet
            class="pa-2 ma-2 rounded-lg text-center"
            color="fourth"
            v-if="option.price.currency"
          >
            {{ option.price.currency }}
          </v-sheet>
          <v-btn
            text
            block
            color="primary"
            @click="option.selectCurrency = true"
            >{{ option.price.currency ? "Mudar" : "Selecionar" }}</v-btn
          >
          <select-currency
            v-model="option.selectCurrency"
            @selected="setCurrency($event, 'simple', i)"
          ></select-currency>
        </v-sheet>
        <v-sheet
          color="third"
          class="pa-2 my-2 rounded-lg d-flex justify-space-between"
        >
          <div>
            <v-btn icon color="primary" @click="actVariant('up', i)">
              <v-icon>expand_less</v-icon>
            </v-btn>
            <v-btn icon color="primary" @click="actVariant('down', i)">
              <v-icon>expand_more</v-icon>
            </v-btn>
          </div>
          <div>
            <v-btn icon color="red" @click="actVariant('delete', i)">
              <v-icon>delete</v-icon>
            </v-btn>
          </div>
        </v-sheet>
      </v-sheet>
    </v-expand-transition>
    <v-btn @click="addVariant('simple')" text color="primary" block>
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
    data(){
        return {
            variant: {
                
            }
        }
    }
};
</script>

<style>
</style>