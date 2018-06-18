<template>
  <div id="thing" class="about">
    <h1>This is an about page</h1>
    <p>{{ name }}</p>
    <p>Name: <input v-model="name"></p>
  </div>
</template>

<script>
import firebase from 'firebase';

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
    this.fetchData();
  },
  methods: {
    fetchData() {
      db.collection('users').doc('LjMAmyGQhb7Pig2zxwgx')
        .onSnapshot((snap) => {
          this.name = snap.data().first;
        });
    },
  },
};
</script>

<style>

</style>
