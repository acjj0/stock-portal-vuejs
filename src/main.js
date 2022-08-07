import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import TodayPage from './components/pages/TodayPage.vue';
import PortfolioPage from './components/pages/PortfolioPage.vue';
import ResearchPage from './components/pages/ResearchPage.vue';

Vue.use(VueRouter);

Vue.config.productionTip = false

const routes = [
  { path: '/', component: TodayPage, name: 'today' },
  { path: '/portfolio', component: PortfolioPage, name: 'portfolio' },
  { path: '/research', component: ResearchPage, name: 'research' },
  { path: '/research/:symbolId', component: ResearchPage, name: 'researchsym', props: true }, //route segment
]

const router = new VueRouter(
  {
    routes: routes,
    mode: 'history', //by default it is 'hash'
  }
)

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
