<template>
  <div>
    <div class="login-area d-flex flex-column justify-center align-center">
        <v-form ref="form">
          <v-sheet
            class="d-flex flex-column justify-center align-center pa-4 rounded-lg"
            :style="`background-color: ${$store.state.secondaryBackground} !important;`"
          >
            <h3 class="title mb-3">
              Entrar
            </h3>
            <v-text-field
              v-model="form.email"
              label="E-mail"
              type="email"
              :rules="rules.email"
              placeholder="email@exemplo.com"
              dense
              outlined
            />
            <v-text-field
              v-model="form.password"
              :rules="rules.password"
              label="Senha"
              type="password"
              dense
              outlined
            />
            <v-btn
              color="primary"
              class="white--text rounded-lg"
              elevation="0"
              block
              @click="login"
            >
              Entrar
            </v-btn>
          </v-sheet>
        </v-form>
      </div>
  </div>
</template>

<script>
export default {
  layout: 'clean',
  middleware: 'preventAuthedUser',
  data () {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          email => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) || 'O email deve ser válido.'
        ],
        password: [
          password => password.length >= 8 || 'A senha deve ser válida.'
        ]
      }
    }
  },
  head: {
    title: 'Entrar'
  },
  methods: {
    async login () {
      if (!this.$refs.form.validate()) {
        return
      }
      try {
        this.$nuxt.$loading.start()
        await this.$auth.loginWith('local', {
          data: {
            email: this.form.email,
            password: this.form.password
          }
        })
        this.$nuxt.$loading.finish()
        this.$router.push('/')
      } catch (e) {
        this.$nuxt.$loading.finish()
        this.$store.commit('setGlobalDialog', {
          title: 'Falha ao fazer login.',
          content: e.response?.data.message || 'Erro ao conectar no banco de dados.',
          show: true
        })
      }
    }
  }
}
</script>

<style scoped>
.login-area {
  height: 84vh;
}
</style>
