import config from "@/nuxt.config";

export const state = () => ({
    products: [],
    globalDialog: {
        title: '',
        content: '',
        show: false
    },
    suportedCurrencies: ['USD', 'BRL'],
    changeActionBackground: config.vuetify.theme.dark ? 'indigo darken-4' : 'blue lighten-4'
});

export const mutations = {
    addProduct(state, product) {
        if (state.products.length < 1) {
            state.products.push(product);
        }
        if (state.products.filter((obj) => obj.urlNumber === product.urlNumber).length < 1) {
            state.products.push(product);
        }
    },
    setGlobalDialog(state, { title, content, color, show }) {
        state.globalDialog = { title, content, color, show }
    },
};