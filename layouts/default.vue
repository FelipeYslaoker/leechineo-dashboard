<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      floating
      app
      color="first"
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              v-if="$store.state.auth.user.profilePic"
              :src="$store.state.auth.user.profilePic"
            ></v-img>
            <v-avatar color="primary" size="48">
              <span>{{$store.state.auth.user.name[0]}}{{$store.state.auth.user.surname[0]}}</span>
            </v-avatar>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ $store.state.auth.user.name }}
              {{ $store.state.auth.user.surname }}
            </v-list-item-title>
            <v-list-item-subtitle>{{
              $store.state.auth.user.email
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-btn text block color="primary" @click="dialog = true">
            Sair
          </v-btn>
        </v-list-item>
      </v-list>
      <v-list nav dense>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            nav
            dense
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      flat
      color="first"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main
      style="background-color: #303443 !important;"
    >
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
    <div class="text-center">
      <v-dialog
        v-model="dialog"
        class="rounded-lg"
        persistent
        width="500"
      >
        <v-card class="rounded-lg">
          <v-card-title class="text-h5">
            Deseja realmente sair da sua conta?
          </v-card-title>
          <v-card-text>
            Você poderá entrar a hora que quiser, mas lembre-se de anotar suas credenciais :)
          </v-card-text>
          <v-card-actions>
            <v-row dense>
              <v-col cols="6">
                <v-btn block text color="primary" @click="dialog = false">
                  Cancelar
                </v-btn>
              </v-col>
              <v-col>
                <v-btn color="error" text block @click="logout">
                  Sair
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <GlobalDialog v-if="$store.state.globalDialog.show" />
  </v-app>
</template>

<script>
import mdIcon from "~/components/global/md-icon.vue";
export default {
  components: { mdIcon },
  data() {
    return {
      clipped: false,
      dialog: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "analytics",
          title: "Início",
          to: "/",
        },
        {
          icon: "shopping_bag",
          title: "Produtos",
          to: "/products",
        },
        {
          icon: "space_dashboard",
          title: "Seções",
          to: "/sections",
        },
        {
          icon: "segment",
          title: "Categorias",
          to: "/categories",
        },
        {
          icon: "style",
          title: "Marcas",
          to: "/brands",
        },
        {
          icon: "loyalty",
          title: "Cupons e promoções",
          to: "/tickets-and-promotions",
        },
        {
          icon: 'local_shipping',
          title: 'Métodos de envio',
          to: '/shipping-methods'
        },
        {
          icon: "manage_accounts",
          title: "Clientes",
          to: "/users",
        },
        {
          icon: "shopping_basket",
          title: "Pedidos",
          to: "/orders",
        },
        {
          icon: "credit_card",
          title: "Financeiro",
          to: "/financial",
        },
        {
          icon: "admin_panel_settings",
          title: "Gerenciar ADMs",
          to: "/admin-manager",
        },
        {
          icon: "fact_check",
          title: "Registros",
          to: "/logs",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Leechineo Dashboard",
      selectedItem: 0,
    };
  },
  methods: {
    async logout () {
      try {
        this.$nuxt.$loading.start()
        await this.$auth.logout()
        this.$router.push('/login')
        this.dialog = false
        this.$nuxt.$loading.finish()
      } catch (e) {
        this.$nuxt.$loading.finish()
        this.$store.commit('setGlobalDialog', {
          title: 'Falha ao sair.',
          content: e.response.data.message,
          show: true
        })
      }
    }
  }
};
</script>
<style>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #303443;
}

::-webkit-scrollbar-thumb {
  background-color: #ffffff49;
  animation: hoverAnimationToScroll .2s reverse;
  padding: 20px;
  border-radius: 20px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #ffffff69;
  animation: hoverAnimationToScroll 1s normal;
  padding: 20px;
  border-radius: 20px;
}
@keyframes hoverAnimationToScroll {
  from {
    background-color: #ffffff49;
  }
  to {
    background-color: #ffffff69;
  }
}
</style>
