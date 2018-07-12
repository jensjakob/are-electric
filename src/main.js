import Vue from 'vue';
import moment from 'moment';
import firebase from 'firebase/app';
import 'firebase/firestore';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';

const config = {
  apiKey: 'AIzaSyCBvuRlPH1OMhsGf3d7_C9UbeGMMpFodro',
  authDomain: 'are-electric.firebaseapp.com',
  databaseURL: 'https://are-electric.firebaseio.com',
  projectId: 'are-electric',
  storageBucket: '',
  messagingSenderId: '302291386863',
};
firebase.initializeApp(config);

const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
Vue.prototype.$db = db;

Vue.config.productionTip = false;

moment.locale('sv');
Vue.prototype.$moment = moment;

// Object.definePrototype(Vue.prototype, '$moment', { value: moment });
// Object.definePrototype(Vue.prototype, '$db', { value: db });

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
