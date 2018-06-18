<template>
  <div id="thing" class="about">
    <h1>This is an about page</h1>
    <p>{{ name }}</p>
    <p>Name: <input v-model="name"></p>
    <ol>
      <li v-for="day in days" :key="day.id">
        <label>
          <input type="checkbox"
            v-on:change="toggleTake(day)"
            v-bind:checked="day.take"
            v-bind:disabled="!day.take && day.booked"><!-- maybe remove and fix? -->
          <del v-if="day.booked">
            {{ day.text }}
          </del>
          <span v-else>
            {{ day.text }}
          </span>
        </label>
      </li>
    </ol>
  </div>
</template>

<script>
import firebase from 'firebase';
import moment from 'moment';

moment.locale('sv');

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

// firebase.initializeApp({
//   apiKey: '### FIREBASE API KEY ###',
//   authDomain: '### FIREBASE AUTH DOMAIN ###',
//   projectId: '### CLOUD FIRESTORE PROJECT ID ###'
// });

// Initialize Cloud Firestore through Firebase
// const db = firebase.firestore();

// var docRef = db.collection("users").doc("LjMAmyGQhb7Pig2zxwgx");

// docRef.get().then(function(doc) {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
// }).catch(function(error) {
//     console.log("Error getting document:", error);
// });

// let theName = 'temp';

// console.log(db.collection('users').doc('LjMAmyGQhb7Pig2zxwgx').get().data());

export default {
  data() {
    return {
      name: 'temp',
      days: [
        // { text: '2018-06-16', booked: false, take: false },
        // { text: '2018-06-17', booked: true, take: false },
      ],
    };
  },
  // mounted() {
  //   this.name = theName;
  // },
  watch: {
    name: (val) => {
      db.collection('users').doc('LjMAmyGQhb7Pig2zxwgx').set({
        first: val,
      });
    },
  },
  // created: () => {
  //   this.fetchData();
  // },
  mounted() {
    const date = new Date();

    this.fetchData();
    // console.log(moment().format('YYYY-MM-DD HH:mm'));

    date.setDate(date.getDate() - 1);
    for (let i = 0; i < 21; i += 1) {
      date.setDate(date.getDate() + 1);
      this.days.push({
        text: moment(date).format('YYYY-MM-DD'),
        booked: false,
        take: false,
      });
    }

    // this.days.findIndex('2018-06-29').booked = true;
    // console.log(this.days.find(day => day.text === '2018-06-17').booked);
    // this.days.find(day => day.text === '2018-06-16').booked = true;
  },
  methods: {
    fetchData() {
      db.collection('users').doc('LjMAmyGQhb7Pig2zxwgx')
        .onSnapshot((snap) => {
          this.name = snap.data().first;
        });
      const today = new Date();
      db.collection('calendar').where('day', '>=', today).orderBy('day', 'asc')
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const theDay = moment.unix(doc.data().day.seconds).format('YYYY-MM-DD');
            this.days.find(day => day.text === theDay).booked = true;
            // moment(doc.data().day.seconds).format('YYYY-MM-DD')
            // cities.push(doc.data().day);
          });
        });
    },
    toggleTake(day) {
      // console.log(day.take);
      // eslint-disable-next-line
      if (day.take === false) {
        // eslint-disable-next-line
        day.take = true;
        // eslint-disable-next-line
        day.booked = true;
      } else {
        // eslint-disable-next-line
        day.take = false;
        // eslint-disable-next-line
        day.booked = false;
      }
    },
  },
};
</script>

<style>
body {
  background: #20262E;
  padding: 20px;
  font-family: Helvetica;
}

#app {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  transition: all 0.2s;
}

li {
  margin: 8px 0;
}

h2 {
  font-weight: bold;
  margin-bottom: 15px;
}

del {
  color: rgba(0, 0, 0, 0.3);
}
</style>
