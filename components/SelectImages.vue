<template>
  <v-dialog v-model="showDialog" max-width="700">
    <v-card color="first" elevation="0" class="rounded-lg">
      <v-card-title>Selecionador de imagens</v-card-title>
      <v-card-text>
        <input
          type="file"
          :id="inputID"
          accept="image/png, image/jpeg"
          :multiple="multiple"
          style="display: none"
        />
        <v-sheet
          class="pa-2 my-3 rounded-lg d-flex flex-wrap"
          color="second"
          v-for="(image, i) in selectedImages"
          :key="i"
        >
          <v-img :src="image" width="50" class="rounded-lg" height="70"></v-img>
          <v-sheet
            v-if="multiple"
            color="third"
            width="70%"
            class="
              pa-2
              ml-2
              rounded-lg
              d-flex
              justify-center
              align-center
              flex-wrap
            "
          >
            <v-btn
              icon
              color="primary"
              @click="actOnImage({ image, action: 'moveUp' })"
            >
              <v-icon>arrow_upward</v-icon>
            </v-btn>
            <v-btn
              icon
              color="primary"
              @click="actOnImage({ image, action: 'moveDown' })"
            >
              <v-icon>arrow_downward</v-icon>
            </v-btn>
            <v-btn
              icon
              color="primary"
              @click="actOnImage({ image, action: 'moveToTop' })"
            >
              <v-icon>keyboard_double_arrow_up</v-icon>
            </v-btn>
            <v-btn
              icon
              color="primary"
              @click="actOnImage({ image, action: 'moveToBottom' })"
            >
              <v-icon>keyboard_double_arrow_down</v-icon>
            </v-btn>
          </v-sheet>
          <v-sheet width="100%" class="pa-2 mt-2 rounded-lg" color="third">
            <v-btn
              block
              text
              color="red"
              @click="actOnImage({ image, action: 'delete' })"
            >
              <v-icon> delete </v-icon>
            </v-btn>
          </v-sheet>
        </v-sheet>
        <v-sheet class="pa-2 my-3 rounded-lg" color="second">
          <v-btn height="70" block text @click="selectImages">
            <v-icon>image</v-icon>
          </v-btn>
        </v-sheet>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="primary" @click="submit">Concluir</v-btn>
        <v-btn text color="red" @click="showDialog = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import uniqid from 'uniqid';
export default {
  props: ["value", "images", "multiple", "imagesFiles"],
  data() {
    return {
      showDialog: this.value,
      selectedImages: this.images?.length > 0 ? [...this.images] : [],
      files: this.imagesFiles?.length > 0 ? [...this.imagesFiles] : [],
    };
  },
  computed: {
    inputID(){
      return `edit-create-image-files-input-${uniqid()}`
    }
  },
  watch: {
    value() {
      this.showDialog = this.value;
    },
    showDialog() {
      if (this.showDialog) {
        this.selectedImages = this.images?.length > 0 ? [...this.images] : [];
        this.files = this.imagesFiles?.length > 0 ? [...imagesFiles.files] : [];
      }
      this.$emit("input", this.showDialog);
    },
  },
  methods: {
    actOnImage({ image, action }) {
      const imageIndex = this.selectedImages.indexOf(image);
      switch (action) {
        case "moveUp":
          if (imageIndex !== 0) {
            const removedImage = this.selectedImages.splice(imageIndex, 1)[0];
            const removedFile = this.files.splice(imageIndex, 1)[0];
            this.files.splice(imageIndex - 1, 0, removedFile);
            this.selectedImages.splice(imageIndex - 1, 0, removedImage);
          }
          break;
        case "moveDown":
          if (imageIndex !== this.selectedImages.length - 1) {
            const removedImage = this.selectedImages.splice(imageIndex, 1)[0];
            const removedFile = this.files.splice(imageIndex, 1)[0];
            this.selectedImages.splice(imageIndex + 1, 0, removedImage);
            this.files.splice(imageIndex + 1, 0, removedFile);
          }
          break;
        case "moveToTop":
          if (imageIndex !== 0) {
            const removedImage = this.selectedImages.splice(imageIndex, 1)[0];
            const removedFile = this.files.splice(imageIndex, 1)[0];
            this.selectedImages.unshift(removedImage);
            this.files.unshift(removedFile);
          }
          break;
        case "moveToBottom":
          if (imageIndex !== this.selectedImages.length - 1) {
            const removedImage = this.selectedImages.splice(imageIndex, 1)[0];
            const removedFile = this.files.splice(imageIndex, 1)[0];
            this.selectedImages.push(removedImage);
            this.files.push(removedFile);
          }
          break;
        case "delete":
          this.selectedImages.splice(imageIndex, 1);
          this.files.splice(imageIndex, 1);
          break;
      }
    },
    selectImages() {
      const fileInput = document.querySelector(
        `#${this.inputID}`
      );
      fileInput.addEventListener("input", (event) => {
        for (const file of event.target.files) {
          if (this.files.includes(file)) {
            continue;
          }
          if (this.multiple) {
            this.files.push(file);
            const url = URL.createObjectURL(file);
            this.selectedImages.push(url);
          } else {
            this.files = [file];
            const url = URL.createObjectURL(file);
            this.selectedImages = [url];
          }
        }
        event.target.value = "";
        console.log(this.selectedImages)
      });
      fileInput.click();
    },
    submit() {
      this.$emit("submited", {
        images: this.selectedImages,
        files: this.files,
      });
      this.showDialog = false;
    },
  },
};
</script>

<style>
</style>