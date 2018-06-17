import Vue from 'vue';
import firebase from 'firebase';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';

Vue.config.productionTip = false;

const config = {
  apiKey: 'AIzaSyCBvuRlPH1OMhsGf3d7_C9UbeGMMpFodro',
  authDomain: 'are-electric.firebaseapp.com',
  databaseURL: 'https://are-electric.firebaseio.com',
  projectId: 'are-electric',
  storageBucket: '',
  messagingSenderId: '302291386863',
};
firebase.initializeApp(config);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
