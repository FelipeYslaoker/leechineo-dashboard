import Vue from 'vue';

import Centralize from '@/components/global/Centralize.vue';
import mdIcon from '@/components/global/md-icon.vue';

const components = {Centralize, mdIcon};

Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component)
});
