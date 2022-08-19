<template>
  <div>
    <v-form ref="form">
    <v-sheet class="pa-1 ma-1 rounded-lg" color="second" v-show="!loading">
      <v-row dense>
        <v-col cols="12" md="6">
          <v-sheet class="pa-3 ma-2 rounded-lg" color="third">
              <v-subheader>Informações básicas</v-subheader>
              <v-text-field
                outlined
                dense
                placeholder="Nome do produto*"
                counter="50"
                v-model="product.name"
                :rules="rules.text"
              ></v-text-field>
              <v-textarea
                outlined
                dense
                placeholder="Descrição do produto"
                v-model="product.description"
                :rules="rules.text"
              ></v-textarea>
              <v-btn
                text
                block
                color="primary"
                @click="
                  product.showDescriptionPreview =
                    !product.showDescriptionPreview
                "
                >{{
                  !product.showDescriptionPreview
                    ? "mostrar preview"
                    : "ocultar preview"
                }}</v-btn
              >
              <v-expand-transition>
                <v-sheet
                  v-html="product.description"
                  class="pa-2 rounded-lg black--text my-2"
                  color="white"
                  v-show="product.showDescriptionPreview"
                ></v-sheet>
              </v-expand-transition>
              <v-subheader>Especificações</v-subheader>
              <v-sheet
                v-for="(especification, i) in product.specifications"
                :key="i"
                color="fourth"
                class="pa-2 rounded-lg mb-2"
                :id="`specification-${i}`"
              >
                <a
                  :href="`#specification-${i}`"
                  :id="`specification-${i}-click`"
                  style="display: none"
                ></a>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      outlined
                      dense
                      placeholder="Título"
                      v-model="especification.title"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      outlined
                      dense
                      placeholder="Descrição"
                      v-model="especification.description"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-expand-transition>
                      <v-alert type="error" v-show="especification.error"
                        >Especificação inválida</v-alert
                      >
                    </v-expand-transition>
                  </v-col>
                </v-row>
                <v-btn
                  block
                  text
                  @click="actEspecification({ action: 'delete', spec: i })"
                  color="red"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-sheet>
              <v-btn
                block
                text
                color="primary"
                @click="actEspecification({ action: 'add' })"
              >
                <v-icon>add</v-icon>
              </v-btn>
            <v-subheader v-show="product.brand">Marca</v-subheader>
            <v-sheet class="pa-2 ma-2 rounded-lg" color="fourth">
              <v-subheader>Marca</v-subheader>
              <v-sheet
                v-if="product.brand"
                class="pa-2 ma-2 rounded-lg"
                :color="product.brand.color"
              >
                <v-sheet color="first" class="pa-2 rounded-lg text-center">
                  {{ product.brand.name }}
                </v-sheet>
                <v-btn
                  color="red"
                  block
                  class="rounded-lg my-2"
                  elevation="0"
                  @click="product.brand = null"
                >
                  <v-icon> delete </v-icon>
                </v-btn>
              </v-sheet>
              <v-btn
                text
                block
                color="primary"
                @click="dialogs.selectBrand = true"
                >Selecionar</v-btn
              >
              <select-brand
                v-model="dialogs.selectBrand"
                @selected="setBrand"
              ></select-brand>
            </v-sheet>
            <v-subheader>Categoria</v-subheader>
            <v-sheet
              class="d-flex pa-2 rounded-lg mb-2"
              color="fourth"
              v-if="product.category"
            >
              <span>{{ product.categoryName }}</span>
              <v-sheet
                class="d-flex pa-2 rounded-lg ml-2"
                color="third"
                v-if="product.subCategory"
              >
                <span>{{ product.subCategoryName }}</span>
                <v-sheet
                  class="pa-2 ml-2 rounded-lg"
                  color="second"
                  v-if="product.subSubCategory"
                >
                  <span>{{ product.subSubCategoryName }}</span>
                </v-sheet>
              </v-sheet>
            </v-sheet>
            <v-btn
              @click="deleteCategory"
              block
              text
              color="red"
              v-if="product.category"
              >Redefinir</v-btn
            >
            <v-btn
              @click="dialogs.selectCategory = true"
              text
              color="primary"
              block
              >selecionar</v-btn
            >
          </v-sheet>
        </v-col>
        <v-col cols="12" md="6">
          <v-row dense>
            <v-col cols="12">
              <v-sheet class="pa-3 ma-2 rounded-lg" color="third">
                <v-carousel
                  class="rounded-lg mb-2"
                  v-if="product.images.length > 0"
                  cycle
                  height="200"
                  :show-arrows="false"
                  delimiter-icon="mdi-minus"
                  hide-delimiter-background
                >
                  <v-carousel-item
                    v-for="image in product.images"
                    :key="image"
                    :src="image"
                  ></v-carousel-item>
                </v-carousel>
                <v-btn
                  text
                  color="primary"
                  block
                  @click="dialogs.selectImages = true"
                >
                  <v-icon>{{
                    product.images.length > 0 ? "edit" : "image"
                  }}</v-icon>
                </v-btn>
              </v-sheet>
            </v-col>
            <v-col cols="12">
              <v-sheet class="pa-3 ma-3 rounded-lg" color="third">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Cor"
                    label="Título da variante"
                    v-model="product.variants.title"
                  ></v-text-field>
                  <v-radio-group v-model="product.variants.type" row>
                    <v-radio value="unique" label="Única"></v-radio>
                    <v-radio value="simple" label="Simples"></v-radio>
                    <v-radio value="compound" label="Composta"></v-radio>
                  </v-radio-group>
                  <template v-if="product.variants.type === 'unique'">
                    <v-text-field
                      outlined
                      dense
                      placeholder="Rosa"
                      label="Nome da variante"
                      v-model="product.variants.uniqueOption.name"
                      :rules="[text => text.length > 0 || 'Campo obrigatório.']"
                    ></v-text-field>
                    <v-text-field
                      outlined
                      dense
                      label="Estoque*"
                      type="number"
                      v-model="product.variants.uniqueOption.stock"
                      :rules="rules.number"
                    ></v-text-field>
                    <v-text-field
                      v-model="product.variants.uniqueOption.discount"
                      type="number"
                      outlined
                      dense
                      label="Desconto"
                    ></v-text-field>
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-sheet color="fourth" class="pa-2 my-2 rounded-lg">
                          <v-subheader>Método de envio</v-subheader>
                          <v-sheet
                            color="third"
                            class="pa-2 ma-2 rounded-lg"
                            v-if="product.variants.uniqueOption.shippingMethod"
                            >{{
                              product.variants.uniqueOption.shippingMethod.name
                            }}</v-sheet
                          >
                          <v-expand-transition>
                            <v-alert
                              type="error"
                              v-show="
                                product.variants.uniqueOption.errors
                                  .shippingMethod
                              "
                              >Método de envio obrigatório</v-alert
                            >
                          </v-expand-transition>
                          <v-btn
                            text
                            block
                            color="primary"
                            @click="dialogs.selectShippingMethod = true"
                            >{{
                              product.variants.uniqueOption.shippingMethod
                                ? "Mudar"
                                : "Selecionar"
                            }}</v-btn
                          >
                          <select-shipping-method
                            v-model="dialogs.selectShippingMethod"
                            @selected="setShippingMethod($event)"
                          ></select-shipping-method>
                        </v-sheet>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-sheet color="fourth" class="pa-2 my-2 rounded-lg">
                          <v-subheader
                            v-if="!product.variants.uniqueOption.image"
                            >Imagem</v-subheader
                          >
                          <template v-if="product.variants.uniqueOption.image">
                            <v-img
                              alt="Imagem da variante"
                              :src="product.variants.uniqueOption.image.url"
                              width="100%"
                              height="150px"
                              class="rounded-lg my-2"
                            ></v-img>
                          </template>
                          <v-btn
                            text
                            block
                            color="primary"
                            @click="
                              product.variants.uniqueOption.imageDialog = true
                            "
                            >{{
                              product.variants.uniqueOption.image
                                ? "Editar"
                                : "Selecionar"
                            }}</v-btn
                          >
                          <v-btn
                            v-if="product.variants.uniqueOption.image"
                            @click="product.variants.uniqueOption.image = null"
                            color="red"
                            text
                            block
                            >Apagar</v-btn
                          >
                          <select-images
                            v-model="product.variants.uniqueOption.imageDialog"
                            @submited="setImages($event, 0)"
                            :images="
                              product.variants.uniqueOption.image
                                ? [product.variants.uniqueOption.image.url]
                                : []
                            "
                          ></select-images>
                        </v-sheet>
                      </v-col>
                    </v-row>
                    <v-sheet color="fourth" class="pa-2 my-2 rounded-lg">
                      <v-text-field
                        outlined
                        dense
                        label="Preço*"
                        type="number"
                        class="mt-5"
                        v-model="product.variants.uniqueOption.price.value"
                      ></v-text-field>
                      <v-subheader>Moeda</v-subheader>
                      <v-sheet
                        class="pa-2 ma-2 rounded-lg text-center"
                        color="third"
                        v-if="product.variants.uniqueOption.price.currency"
                      >
                        {{ product.variants.uniqueOption.price.currency }}
                      </v-sheet>
                      <v-expand-transition>
                        <v-alert
                          type="error"
                          v-show="product.variants.uniqueOption.errors.currency"
                          >Selecione uma moeda</v-alert
                        >
                      </v-expand-transition>
                      <v-btn
                        text
                        block
                        color="primary"
                        @click="dialogs.selectCurrency = true"
                        >{{
                          product.variants.uniqueOption.price.currency
                            ? "Mudar"
                            : "Selecionar"
                        }}</v-btn
                      >
                      <select-currency
                        v-model="dialogs.selectCurrency"
                        @selected="setCurrency($event, 'unique')"
                      ></select-currency>
                    </v-sheet>
                  </template>
                  <template v-else-if="product.variants.type === 'simple'">
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
                          <v-text-field
                            label="Nome da variante"
                            outlined
                            dense
                            v-model="option.name"
                            :rules="[text => text.length > 0 || 'Campo obrigatório.']"
                          ></v-text-field>
                          <v-text-field
                            label="Estoque*"
                            outlined
                            type="number"
                            dense
                            v-model="option.stock"
                            :rules="rules.number"
                          ></v-text-field>
                          <v-text-field
                            v-model="option.discount"
                            type="number"
                            outlined
                            dense
                            label="Desconto"
                          ></v-text-field>
                          <a
                            :href="`#simple-variant-${i}`"
                            style="display: none"
                            :id="`simple-variant-${i}-button`"
                          ></a>
                          <v-row dense>
                            <v-col cols="12" md="6">
                              <v-sheet
                                color="third"
                                class="pa-2 my-2 rounded-lg"
                              >
                                <v-subheader>Método de envio</v-subheader>
                                <v-sheet
                                  color="fourth"
                                  class="pa-2 ma-2 rounded-lg"
                                  v-if="option.shippingMethod"
                                  >{{ option.shippingMethod.name }}</v-sheet
                                >
                                <v-expand-transition>
                                  <v-alert
                                    type="error"
                                    v-show="option.errors.shippingMethod"
                                    >Método de envio obrigatório</v-alert
                                  >
                                </v-expand-transition>
                                <v-btn
                                  text
                                  block
                                  color="primary"
                                  @click="option.selectShippingMethod = true"
                                  >{{
                                    option.shippingMethod
                                      ? "Mudar"
                                      : "Selecionar"
                                  }}</v-btn
                                >
                                <select-shipping-method
                                  v-model="option.selectShippingMethod"
                                  @selected="setShippingMethod($event, i)"
                                ></select-shipping-method>
                              </v-sheet>
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-sheet
                                color="third"
                                class="pa-2 my-2 rounded-lg"
                              >
                                <v-subheader v-if="!option.image"
                                  >Imagem</v-subheader
                                >
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
                                  >{{
                                    option.image ? "Editar" : "Selecionar"
                                  }}</v-btn
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
                                  @submited="setImages($event, i)"
                                  :images="
                                    option.image ? [option.image.url] : []
                                  "
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
                              v-model="option.price.value"
                              :rules="rules.number"
                            ></v-text-field>
                            <v-subheader>Moeda</v-subheader>
                            <v-sheet
                              class="pa-2 ma-2 rounded-lg text-center"
                              color="fourth"
                              v-if="option.price.currency"
                            >
                              {{ option.price.currency }}
                            </v-sheet>
                            <v-expand-transition>
                              <v-alert
                                type="error"
                                v-show="option.errors.currency"
                                >Selecione uma moeda</v-alert
                              >
                            </v-expand-transition>
                            <v-btn
                              text
                              block
                              color="primary"
                              @click="option.selectCurrency = true"
                              >{{
                                option.price.currency ? "Mudar" : "Selecionar"
                              }}</v-btn
                            >
                            <select-currency
                              v-model="option.selectCurrency"
                              @selected="setCurrency($event, i)"
                            ></select-currency>
                          </v-sheet>
                          <v-sheet
                            color="third"
                            class="
                              pa-2
                              my-2
                              rounded-lg
                              d-flex
                              justify-space-between
                            "
                          >
                            <div>
                              <v-btn
                                icon
                                color="primary"
                                @click="actVariant('up', i)"
                              >
                                <v-icon>expand_less</v-icon>
                              </v-btn>
                              <v-btn
                                icon
                                color="primary"
                                @click="actVariant('down', i)"
                              >
                                <v-icon>expand_more</v-icon>
                              </v-btn>
                            </div>
                            <div>
                              <v-btn
                                icon
                                color="red"
                                @click="actVariant('delete', i)"
                              >
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </div>
                          </v-sheet>
                        </v-sheet>
                      </v-expand-transition>
                      <v-btn @click="addVariant" text color="primary" block>
                        <v-icon>add</v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <template v-else>
                    <div>
                      <v-sheet color="fourth" class="pa-2 my-2 rounded-lg">
                        <v-subheader>Atributos</v-subheader>
                        <v-sheet
                          color="third"
                          class="rounded-lg pa-2 my-2"
                          v-for="(attribute, i) in product.variants.attributes"
                          :key="i"
                        >
                          <v-text-field
                            outlined
                            dense
                            v-model="product.variants.attributes[i]"
                            :rules="[
                              (text) => text.length > 0 || 'Campo obrigatório',
                            ]"
                            :label="`${i + 1}º atributo`"
                          ></v-text-field>
                          <v-sheet
                            class="d-flex justify-space-between"
                            color="transparent"
                          >
                            <div>
                              <v-btn
                                icon
                                color="primary"
                                @click="actAttributes('up', i)"
                              >
                                <v-icon> expand_less </v-icon>
                              </v-btn>
                              <v-btn
                                icon
                                color="primary"
                                @click="actAttributes('down', i)"
                              >
                                <v-icon> expand_more </v-icon>
                              </v-btn>
                            </div>
                            <v-btn
                              icon
                              color="red"
                              @click="actAttributes('delete', i)"
                            >
                              <v-icon> delete </v-icon>
                            </v-btn>
                          </v-sheet>
                        </v-sheet>
                        <v-btn
                          block
                          color="primary"
                          text
                          @click="actAttributes('add')"
                        >
                          <v-icon>add</v-icon>
                        </v-btn>
                      </v-sheet>
                      <v-sheet class="my-2 pa-2 rounded-lg" color="fourth">
                        <v-subheader>Opções</v-subheader>
                        <v-expand-transition
                          v-for="(option, i) in product.variants
                            .compoundOptions"
                          :key="i"
                        >
                          <v-sheet
                            v-show="option.show"
                            color="third"
                            class="my-2 rounded-lg pa-2"
                          >
                            <v-sheet
                              color="second"
                              class="pa-2 my-2 rounded-lg"
                              v-for="(name, i) in option.names"
                              :key="i"
                            >
                              <v-text-field
                                :label="product.variants.attributes[i]"
                                outlined
                                dense
                                v-model="option.names[i]"
                                :rules="[
                                  (text) =>
                                    text.length > 0 || 'Campo obrigatório',
                                ]"
                              ></v-text-field>
                              <v-btn
                                v-for="name in compoundNames(i)"
                                :key="name"
                                v-show="name && option.names[i] !== name"
                                color="primary"
                                elevation="0"
                                rounded
                                class="ma-2"
                                small
                                @click="setAttributeName(option, name, i)"
                              >
                                {{ name }}
                              </v-btn>
                            </v-sheet>
                            <v-text-field
                              v-model="option.stock"
                              :rules="rules.number"
                              type="number"
                              label="Estoque*"
                              outlined
                              dense
                            ></v-text-field>
                            <v-text-field
                              v-model="option.discount"
                              type="number"
                              outlined
                              dense
                              label="Desconto"
                            ></v-text-field>
                            <a
                              :href="`#simple-variant-${i}`"
                              style="display: none"
                              :id="`compound-variant-${i}-button`"
                            ></a>
                            <v-row dense>
                              <v-col cols="12" md="6">
                                <v-sheet
                                  color="second"
                                  class="pa-2 my-2 rounded-lg"
                                >
                                  <v-subheader>Método de envio</v-subheader>
                                  <v-sheet
                                    color="first"
                                    class="pa-2 ma-2 rounded-lg"
                                    v-if="option.shippingMethod"
                                    >{{ option.shippingMethod.name }}</v-sheet
                                  >
                                  <v-expand-transition>
                                    <v-alert
                                      type="error"
                                      v-show="option.errors.shippingMethod"
                                      >Método de envio obrigatório</v-alert
                                    >
                                  </v-expand-transition>
                                  <v-btn
                                    text
                                    block
                                    color="primary"
                                    @click="option.selectShippingMethod = true"
                                    >{{
                                      option.shippingMethod
                                        ? "Mudar"
                                        : "Selecionar"
                                    }}</v-btn
                                  >
                                  <select-shipping-method
                                    v-model="option.selectShippingMethod"
                                    @selected="setShippingMethod($event, i)"
                                  ></select-shipping-method>
                                </v-sheet>
                              </v-col>
                              <v-col cols="12" md="6">
                                <v-sheet
                                  color="second"
                                  class="pa-2 my-2 rounded-lg"
                                >
                                  <v-subheader v-if="!option.image"
                                    >Imagem</v-subheader
                                  >
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
                                    >{{
                                      option.image ? "Editar" : "Selecionar"
                                    }}</v-btn
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
                                    @submited="setImages($event, i)"
                                    :images="
                                      option.image ? [option.image.url] : []
                                    "
                                  ></select-images>
                                </v-sheet>
                              </v-col>
                            </v-row>
                            <v-sheet
                              color="second"
                              class="pa-2 my-2 rounded-lg"
                            >
                              <v-text-field
                                outlined
                                dense
                                label="Preço*"
                                type="number"
                                class="mt-5"
                                v-model="option.price.value"
                                :rules="rules.number"
                              ></v-text-field>
                              <v-subheader>Moeda</v-subheader>
                              <v-sheet
                                class="pa-2 ma-2 rounded-lg text-center"
                                color="first"
                                v-if="option.price.currency"
                              >
                                {{ option.price.currency }}
                              </v-sheet>
                              <v-expand-transition>
                                <v-alert
                                  type="error"
                                  v-show="option.errors.currency"
                                  >Selecione uma moeda</v-alert
                                >
                              </v-expand-transition>
                              <v-btn
                                text
                                block
                                color="primary"
                                @click="option.selectCurrency = true"
                                >{{
                                  option.price.currency ? "Mudar" : "Selecionar"
                                }}</v-btn
                              >
                              <select-currency
                                v-model="option.selectCurrency"
                                @selected="setCurrency($event, i)"
                              ></select-currency>
                            </v-sheet>
                            <v-sheet
                              class="
                                pa-2
                                my-2
                                d-flex
                                justify-space-between
                                rounded-lg
                              "
                              color="second"
                            >
                              <div>
                                <v-btn
                                  icon
                                  color="primary"
                                  @click="actVariant('up', i)"
                                >
                                  <v-icon> expand_less </v-icon>
                                </v-btn>
                                <v-btn
                                  icon
                                  color="primary"
                                  @click="actVariant('down', i)"
                                >
                                  <v-icon> expand_more </v-icon>
                                </v-btn>
                              </div>
                              <v-btn
                                icon
                                color="red"
                                @click="actVariant('delete', i)"
                              >
                                <v-icon> delete </v-icon>
                              </v-btn>
                            </v-sheet>
                          </v-sheet>
                        </v-expand-transition>
                        <v-btn color="primary" text block @click="addVariant">
                          <v-icon>add</v-icon>
                        </v-btn>
                      </v-sheet>
                    </div>
                  </template>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="snackbar.show"
        :timeout="snackbar.timeout"
        right
        color="error"
        >{{ snackbar.text }}</v-snackbar
      >
      <select-category
        v-model="dialogs.selectCategory"
        @submited="setCategory"
        :defaultCategory="defaultCategory"
      ></select-category>
      <select-images
        v-model="dialogs.selectImages"
        :multiple="true"
        @submited="setImages"
        :images="product.images"
      ></select-images>
      <v-btn block text color="primary" @click="save">Salvar</v-btn>
    </v-sheet>
    </v-form>
    <loading v-show="loading"></loading>
  </div>
</template>

<script>
import uniqid from "uniqid";

export default {
  async beforeMount() {
    this.loading = true;
    await this.loadAsyncData();
    this.loading = false;
  },
  computed: {
    defaultCategory() {
      return {
        category: this.product.categoryName,
        subCategory: this.product.subCategoryName,
        subSubCategory: this.product.subSubCategoryName,
      };
    },
    hasRepeatedOptions(){
      if (Array.from(new Set(this.product.variants.attributes)).length !== this.product.variants.attributes.length) return true
      if (this.product.variants.type === 'unique') return false
      else if (this.product.variants.type === 'simple') {
        const options = this.product.variants.simpleOptions.map(option => option.name)
        return Array.from(new Set(options)).length !== this.product.variants.simpleOptions.length
      } else {
        const names = this.product.variants.compoundOptions.map(option => option.names)
        const namesString = names.map(item => item.join(' '))
        return Array.from(new Set(namesString)).length !== this.product.variants.compoundOptions.length
      }
    },
    compoundNames() {
      return (nameIndex) => {
        const options = this.product.variants.compoundOptions.map((option) => {
          return option.names[nameIndex];
        });
        return Array.from(new Set(options));
      };
    },
  },
  data() {
    return {
      validForm: true,
      snackbar: {
        show: false,
        text: "",
        timeout: 2000,
      },
      dialogs: {
        selectImages: false,
        selectCategory: false,
        selectShippingMethod: false,
        selectCurrency: false,
        selectBrand: false,
      },
      rules: {
        text: [(text) => text.length > 1 || "No mínimo dois caracteres."],
        number: [
          (number) =>
            Number(number.toString().replace(",", ".")) > 0 ||
            "O número deve ser maior que 0",
        ],
      },
      loading: true,
      product: {
        name: "",
        description: "",
        showDescriptionPreview: false,
        brand: null,
        images: [],
        imagesFiles: [],
        category: "",
        categoryName: "",
        subCategory: "",
        subCategoryName: "",
        subSubCategory: "",
        subSubCategoryName: "",
        specifications: [],
        variants: {
          attributes: [],
          title: "",
          type: "unique",
          uniqueOption: {
            errors: {
              shippingMethod: false,
              currency: false,
            },
            image: null,
            imageDialog: false,
            stock: 1,
            shippingMethod: null,
            discount: 0,
            name: '',
            price: {
              currency: "",
              value: 1,
            },
          },
          simpleOptions: [],
          compoundOptions: [],
        },
      },
    };
  },
  methods: {
    async loadAsyncData(){
      if (this.$nuxt.$route.query.id) {
        try {
          const response = await this.$axios.$get(`product/get?id=${this.$nuxt.$route.query.id}`)
          const product = response.product
          this.product.name = product.name
          this.product.description = product.description
          this.product.specifications = product.specifications.map(spec => ({...spec, error: false}))
          if (product.brand) {
            const brand = await this.$axios.$get(`/brands/get?id=${product.brand}`)
            this.product.brand = brand
          }
          if (product.category) {
            const category = await this.$axios.$get(`categories/get?id=${product.category}`)
            this.product.category = category.id
            this.product.categoryName = category.name
            if (product.subCategory) {
              this.product.subCategory = category.subCategories.filter(subCategory => subCategory.id === product.subCategory)[0].id
              this.product.subCategoryName = category.subCategories.filter(subCategory => subCategory.id === product.subCategory)[0].name
              if (product.subSubCategory) {
                this.product.subSubCategory = category.subCategories.filter(subCategory => subCategory.id === product.subCategory)[0].subSubCategories.filter(subSubCategory => subSubCategory.id === product.subSubCategory)[0].id
                this.product.subSubCategoryName = category.subCategories.filter(subCategory => subCategory.id === product.subCategory)[0].subSubCategories.filter(subSubCategory => subSubCategory.id === product.subSubCategory)[0].name
              }
            }
          }
          this.product.images = product.images
          this.product.variants.type = product.variants.type
          this.product.variants.title = product.variants.title
          switch (product.variants.type) {
            case 'unique' :
              const shippingMethod = await this.$axios.$get(`/shippingMethods/get?id=${product.variants.option.shippingMethod}`)
              this.product.variants.uniqueOption = {
                errors: {
                  shippingMethod: false,
                  currency: false,
                },
                image: product.variants.option.image ? {
                  url: product.variants.option.image
                } : null,
                imageDialog: false,
                stock: product.variants.option.stock,
                shippingMethod: shippingMethod,
                discount: product.variants.option.discount,
                name: product.variants.option.name,
                price: {
                  currency: product.variants.option.price.currency,
                  value: product.variants.option.price.value,
                },
              }
              break;
            case 'simple':
              for (const option of product.variants.options) {
                const shippingMethod = await this.$axios.$get(`/shippingMethods/get?id=${option.shippingMethod}`)
                this.product.variants.simpleOptions.push({
                  show: true,
                  errors: {
                    shippingMethod: false,
                    currency: false,
                  },
                  selectShippingMethod: false,
                  selectImages: false,
                  selectCurrency: false,
                  shippingMethod: shippingMethod,
                  image: option.image ? {
                    url: option.image
                  } : null,
                  name: option.name,
                  stock: option.stock,
                  discount: option.discount,
                  price: {
                    currency: option.price.currency,
                    value: option.price.value,
                  },
                });
              }
              break;
            case 'compound' :
              this.product.variants.attributes = product.variants.attributes
              for (const option of product.variants.options) {
                const shippingMethod = await this.$axios.$get(`/shippingMethods/get?id=${option.shippingMethod}`)
                this.product.variants.compoundOptions.push({
                  errors: {
                    shippingMethod: false,
                    currency: false,
                  },
                  show: true,
                  selectShippingMethod: false,
                  selectImages: false,
                  selectCurrency: false,
                  shippingMethod: shippingMethod,
                  image: option.image ? {
                    url: option.image
                  } : null,
                  names: option.names,
                  stock: option.stock,
                  discount: option.discount,
                  price: {
                    currency: option.price.currency,
                    value: option.price.value,
                  },
                })
              }
              break;
          }
        } catch (e) {
          console.log(e)
          this.$store.commit("setGlobalDialog", {
            title: "Falha ao salvar o produto",
            content:
              e.response?.data?.message || "Falha ao conectar no banco de dados",
            show: true,
          });
        }
      }
    },
    async save() {
      if (this.hasRepeatedOptions) {
        this.snackbar.show = true;
        this.snackbar.text =
          "Variantes ou atributos repetidos.";
        return
      }
      const errors = [];
      if (
        !(this.$refs.form.validate())
      ) {
        errors.push(true);
      }
      this.product.specifications.forEach((spec, i) => {
        if (spec.title === "" && spec.description === "") {
          spec.error = true;
          this.snackbar.show = true;
          this.snackbar.text =
            "Especificações: Preencha pelo menos um dos campos";
          document.querySelector(`#specification-${i}-click`).click();
          setTimeout(() => {
            spec.error = false;
          }, 2500);
          errors.push(true);
        }
      });
      const variantType = this.product.variants.type;
      if (variantType === "unique") {
        if (!this.product.variants.uniqueOption.shippingMethod) {
          this.product.variants.uniqueOption.errors.shippingMethod = true;
          this.snackbar.show = true;
          this.snackbar.text =
            "Variante única: O método de envio é obrigatório.";
          errors.push(true);
        }
        if (!this.product.variants.uniqueOption.price.currency) {
          this.product.variants.uniqueOption.errors.currency = true;
          this.snackbar.show = true;
          this.snackbar.text = "Variante única: Selecione uma moeda.";
          errors.push(true);
        }
      } else {
        const snackbarPrefix = `Variantes ${
          variantType === "simple" ? "simples" : "composta"
        }`;
        if (
          variantType === "compound" &&
          this.product.variants.attributes.length < 2
        ) {
          this.snackbar.show = true;
          this.snackbar.text = `${snackbarPrefix}: No mínimo dois atributos.`;
        }
        if (this.product.variants[`${variantType}Options`].length < 2) {
          this.snackbar.show = true;
          this.snackbar.text = `${snackbarPrefix}: No mínimo duas opções.`;
        }
        this.product.variants[`${variantType}Options`].forEach((option) => {
          if (!option.shippingMethod) {
            option.errors.shippingMethod = true;
            this.snackbar.show = true;
            this.snackbar.text = `${snackbarPrefix}: O método de envio é obrigatório.`;
            errors.push(true);
          }
          if (!option.price.currency) {
            option.errors.currency = true;
            this.snackbar.show = true;
            this.snackbar.text = `${snackbarPrefix}: Selecione uma moeda.`;
            errors.push(true);
          }
        });
      }

      if (errors.length === 0) {
        this.$nuxt.$loading.start()
        const product = {
          name: this.product.name,
          description: this.product.description,
          specifications: this.product.specifications.map(spec => ({
            title: spec.title,
            description: spec.description
          })),
          brand: this.product.brand?._id || null,
          category: this.product.category,
          subCategory: this.product.subCategory,
          subSubCategory: this.product.subSubCategory,
          images: [
            ...this.product.images.filter((image) =>
              /firebase/g.test(image)
            ),
          ],
          variants: {
            title: this.product.variants.title,
            type: this.product.variants.type,
          },
        };
        try {
          product.urlNumber = this.$nuxt.$route.query.id || (await this.$axios.$get('/configs/next-product-id')).nextProductId
        } catch (e) {
          console.log(e)
          this.$store.commit("setGlobalDialog", {
            title: "Falha ao carregar o ID do produto",
            content:
              e.response?.data?.message || "Falha ao conectar no banco de dados",
            show: true,
          });
        }
        if (product.variants.type === "compound") {
          product.variants.attributes = this.product.variants.attributes;
        }
        if (this.product.imagesFiles?.length > 0) {
          try {
          const uploadedImages = await this.$uploadFiles(this.$fire.storage, this.product.imagesFiles, `products/${product.urlNumber}/${product.urlNumber}-`)
          product.images = [...this.product.images.filter(image => /firebase/g.test(image)), ...uploadedImages]
        } catch (e) {
          console.log(e);
          this.$store.commit("setGlobalDialog", {
            title: "Falha salvar as imagens",
            content:
              e.response?.data?.message || "Falha ao conectar no banco de dados",
            show: true,
          });
        }
        }
        if (product.variants.type === "unique") {
          product.variants.option = {
            name: this.product.variants.uniqueOption.name,
            stock: this.product.variants.uniqueOption.stock,
            shippingMethod: this.product.variants.uniqueOption.shippingMethod?._id,
            discount: this.product.variants.uniqueOption.discount,
            price: this.product.variants.uniqueOption.price,
          };
          if (this.product.variants.uniqueOption.image?.file) {
            const img = await this.$uploadFiles(this.$fire.storage, [this.product.variants.uniqueOption.image.file], `products/${product.urlNumber}/variants/${uniqid('variant-')}`)
            product.variants.option.image = img[0]
          }
        } else {
          product.variants.options = this.product.variants[
            `${product.variants.type}Options`
          ].map((option) => {
            const op = {
              stock: option.stock,
              discount: option.discount,
              price: option.price,
              shippingMethod: option.shippingMethod?._id,
            };
            const optionNameProperty = `${
              product.variants.type === "compound" ? "names" : "name"
            }`;
            op[optionNameProperty] = option[optionNameProperty];
            return op;
          });
          for (const index in this.product.variants[`${product.variants.type}Options`]) {
            if (this.product.variants[`${product.variants.type}Options`][index].image?.file) {
              const img = await this.$uploadFiles(this.$fire.storage, [this.product.variants[`${product.variants.type}Options`][index].image.file], `products/${product.urlNumber}/variants/${uniqid('variant-')}`)
              product.variants.options[index].image = img[0]
            } else {
              product.variants.options[index].image = this.product.variants[`${product.variants.type}Options`][index].image?.url || undefined
            }
          }
        }
        try {
          if (this.$nuxt.$route.query.id) {
            await this.$axios.$put(`/product/update`, product)
          } else {
            await this.$axios.$post('/product/create', product)
          }
          this.$router.push({ path: "/products" });
        } catch (e) {
          console.log(e)
          this.$store.commit("setGlobalDialog", {
            title: "Falha ao salvar o produto.",
            content:
              e.response?.data?.message || "Falha ao conectar no banco de dados",
            show: true,
          });
        }
      }
      this.$nuxt.$loading.finish()
    },
    setAttributeName(option, value, indexName) {
      const optionIndex = this.product.variants.compoundOptions.indexOf(option);
      this.product.variants.compoundOptions[optionIndex].names[indexName] =
        value;
      this.$forceUpdate();
    },
    actAttributes(action, index) {
      if (action === "add") {
        this.product.variants.attributes.push("");
        this.product.variants.compoundOptions.forEach((option) =>
          option.names.push("")
        );
        this.product.variants.compoundOptions.forEach((option) =>
          option.syncNames.push("")
        );
        return;
      } else if (action === "up") {
        if (index === 0) return;
        const attribute = this.product.variants.attributes.splice(index, 1)[0];
        this.product.variants.attributes.splice(index - 1, 0, attribute);
        return;
      } else if (action === "down") {
        if (index === this.product.variants.attributes.length - 1) return;
        const attribute = this.product.variants.attributes.splice(index, 1)[0];
        this.product.variants.attributes.splice(index + 1, 0, attribute);
        return;
      } else if (action === "delete") {
        this.product.variants.attributes.splice(index, 1)[0];
        this.product.variants.compoundOptions.forEach((option) =>
          option.names.splice(index, 1)
        );
        this.product.variants.compoundOptions.forEach((option) =>
          option.syncNames.splice(index, 1)
        );
      }
    },
    actVariant(action, variantIndex) {
      const variantType = this.product.variants.type;
      if (action === "up") {
        if (variantIndex === 0) return;
        this.product.variants[`${variantType}Options`][
          variantIndex
        ].show = false;
        setTimeout(() => {
          const variant = this.product.variants[`${variantType}Options`].splice(
            variantIndex,
            1
          )[0];
          this.product.variants[`${variantType}Options`].splice(
            variantIndex - 1,
            0,
            variant
          );
          this.product.variants[`${variantType}Options`][
            variantIndex - 1
          ].show = true;
          const focusButton = document.querySelector(
            `#${variantType}-variant-${variantIndex - 1}-button`
          );
          setTimeout(() => {
            if (focusButton) return focusButton.click();
          }, 200);
        }, 200);
      } else if (action === "down") {
        if (
          variantIndex ===
          this.product.variants[`${variantType}Options`].length - 1
        )
          return;
        this.product.variants[`${variantType}Options`][
          variantIndex
        ].show = false;
        setTimeout(() => {
          const variant = this.product.variants[`${variantType}Options`].splice(
            variantIndex,
            1
          )[0];
          this.product.variants[`${variantType}Options`].splice(
            variantIndex + 1,
            0,
            variant
          );
          this.product.variants[`${variantType}Options`][
            variantIndex + 1
          ].show = true;
          const focusButton = document.querySelector(
            `#${variantType}-variant-${variantIndex + 1}-button`
          );
          setTimeout(() => {
            if (focusButton) return focusButton.click();
          }, 200);
        }, 200);
      } else {
        this.product.variants[`${variantType}Options`][
          variantIndex
        ].show = false;
        setTimeout(() => {
          this.product.variants[`${variantType}Options`].splice(
            variantIndex,
            1
          )[0];
        }, 200);
      }
    },
    setBrand(brand) {
      this.product.brand = brand;
    },
    addVariant() {
      const type = this.product.variants.type;
      if (type === "simple") {
        this.product.variants.simpleOptions.push({
          show: false,
          errors: {
            shippingMethod: false,
            currency: false,
          },
          selectShippingMethod: false,
          selectImages: false,
          selectCurrency: false,
          shippingMethod: null,
          image: null,
          name: "",
          stock: 1,
          discount: 0,
          price: {
            currency: "",
            value: 1,
          },
        });
        setTimeout(() => {
          this.product.variants.simpleOptions[
            this.product.variants.simpleOptions.length - 1
          ].show = true;
        }, 0);
      } else {
        this.product.variants.compoundOptions.push({
          errors: {
            shippingMethod: false,
            currency: false,
          },
          show: false,
          selectShippingMethod: false,
          selectImages: false,
          selectCurrency: false,
          shippingMethod: null,
          image: null,
          names: [...this.product.variants.attributes.map((_) => "")],
          syncNames: [...this.product.variants.attributes.map((_) => "")],
          stock: 1,
          discount: 0,
          price: {
            currency: "",
            value: 1,
          },
        });
        setTimeout(() => {
          this.product.variants.compoundOptions[
            this.product.variants.compoundOptions.length - 1
          ].show = true;
        }, 0);
      }
    },
    setShippingMethod(shippingMethod, variantIndex) {
      const variantType = this.product.variants.type;
      if (variantType === "unique") {
        this.product.variants.uniqueOption.shippingMethod = shippingMethod;
        if (this.product.variants.uniqueOption.errors.shippingMethod) {
          this.product.variants.uniqueOption.errors.shippingMethod = false;
        }
      } else {
        this.product.variants[`${variantType}Options`][
          variantIndex
        ].shippingMethod = shippingMethod;
        if (
          this.product.variants[`${variantType}Options`][variantIndex].errors
            .shippingMethod
        ) {
          this.product.variants[`${variantType}Options`][
            variantIndex
          ].errors.shippingMethod = false;
        }
      }
    },
    setImages(e, variantIndex) {
      const variantType = this.product.variants.type;
      if (variantIndex >= 0) {
        if (variantType === "unique") {
          if (!e.images[0]) return;
          this.product.variants.uniqueOption.image = {
            url: e.images[0],
            file: e.files[0],
          };
        } else {
          if (!e.images[0]) return;
          this.product.variants[`${variantType}Options`][variantIndex].image = {
            url: e.images[0],
            file: e.files[0],
          };
        }
      } else {
        this.product.images = [...e.images];
        this.product.imagesFiles = [...e.files];
        return;
      }
    },
    setCurrency(e, variantIndex) {
      const variantType = this.product.variants.type;
      if (variantType === "unique") {
        this.product.variants.uniqueOption.price.currency = e;
        if (this.product.variants.uniqueOption.errors.currency) {
          this.product.variants.uniqueOption.errors.currency = false;
        }
      } else {
        this.product.variants[`${variantType}Options`][
          variantIndex
        ].price.currency = e;
        if (
          this.product.variants[`${variantType}Options`][variantIndex].errors
            .currency
        ) {
          this.product.variants[`${variantType}Options`][
            variantIndex
          ].errors.currency = false;
        }
      }
    },
    setCategory(e) {
      this.product.category = e.category;
      this.product.categoryName = e.categoryName;
      this.product.subCategory = e.subCategory;
      this.product.subCategoryName = e.subCategoryName;
      this.product.subSubCategory = e.subSubCategory;
      this.product.subSubCategoryName = e.subSubCategoryName;
    },
    deleteCategory() {
      this.product.category = "";
      this.product.categoryName = "";
      this.product.subCategory = "";
      this.product.subCategoryName = "";
      this.product.subSubCategory = "";
      this.product.subSubCategoryName = "";
    },
    actEspecification({ action, spec }) {
      if (action === "add") {
        this.product.specifications.push({
          title: "",
          description: "",
          error: false,
        });
      } else {
        this.product.specifications.splice(spec, 1);
      }
    },
  },
};
</script>

<style>
</style>