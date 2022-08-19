<template>
  <div>
    <v-window v-model="onboarding" class="ma-2">
      <v-window-item
        v-for="(item, i) in section.items"
        :key="`item-${i}`"
      >
        <img :src="item.image" width="100%" alt="Banner" class="rounded-lg">
      </v-window-item>
    </v-window>
    <v-row class="justify-center bottom ma-2" v-show="section.items.length > 1">
      <v-item-group
        v-model="onboarding"
        class="text-center"
        mandatory
      >
        <v-item
          v-for="(item, i) in section.items"
          :key="`btn-${i}`"
          v-slot="{ active, toggle }"
        >
          <v-btn
            :input-value="active"
            icon
            @click="toggle"
          >
            <v-icon>remove</v-icon>
          </v-btn>
        </v-item>
      </v-item-group>
    </v-row>
  </div>
</template>

<script>
export default {
    props: ['section'],
    data(){
        return {
            onboarding: 0,
        }
    },
    methods: {
    next () {
      this.onboarding = this.onboarding + 1 === this.length
        ? 0
        : this.onboarding + 1
    },
    prev () {
      this.onboarding = this.onboarding - 1 < 0
        ? this.length - 1
        : this.onboarding - 1
    }
  }
}
</script>

<style>

</style>