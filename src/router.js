import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Calendar from './views/Calendar.vue';
import About from './views/About.vue';
import Reservation from './views/Reservation.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: Reservation,
    },
  ],
});
