<template>
  <div id="thing" class="about">
    <h1>This is an about page</h1>
    <p>{{ name }}</p>
    <p>test-db-sync: <input v-model="name"></p>

<hr>

<div>
  <p v-for="(item, index) in items" v-bind:key="item.id">
    <input type="radio" name="item" v-model.number="selectedItem" v-bind:value="index">
      {{ item.title }}<br>
      {{ item.price }} SEK
  </p>
</div>

<div class="calendar">
  <template v-for="(day, index) in calendar">
    <div v-if="moment(index).weekday() === 0" class="calendar-week-box" v-bind:key="moment(index).week()">
      v. {{ moment(index).week() }}
    </div>
    <div class="calendar-box" v-bind:key="index">
      <div v-if="day.disabled" class="disabled">
        {{ moment(index).format('D') }}
      </div>
      <div v-else-if="day.booked" class="booked">
        X
      </div>
      <div v-else-if="day.selected" class="selected" v-on:click="toDay = ''; fromDay = ''">
        {{ moment(index).format('D') }}
      </div>
      <div v-else-if="fromDay" v-on:click="toDay = index">
        {{ moment(index).format('D') }}
      </div>
      <div v-else-if="!fromDay" v-on:click="fromDay = index">
        {{ moment(index).format('D') }}
      </div>
    </div>
  </template>
</div>


    <div>
      <p>Pickup: <input type="date" v-model="fromDay"> between 9-11 am</p>
      <p v-if="fromDay">Leave: <input type="date" v-model="toDay"> between 3-4 pm</p>
    </div>

    <div v-if="selectedItem !== undefined">
      <h2>Price</h2>
      <p>{{ calcDays }} days à {{ items[selectedItem].price }} SEK = {{ calcPrice }} SEK</p>
    </div>

    <div>
      <p>E-mail: <input type="email" v-model="email"></p>
      <p>Phone: <input type="tel" v-model="phone"></p>
      <p><input type="checkbox" v-model="agree"> Agree terms</p>
      <button v-bind:disabled="selectedItem === undefined || !fromDay || !toDay || !email || !phone || !agree" v-on:click="saveReservation">Make reservation</button>
    </div>

    <ul>
      <li v-for="day in days" :key="day.id">
        <label>
          <input type="checkbox"
            v-on:change="toggleTake(day)"
            v-bind:checked="day.take"
            v-bind:disabled="!day.take && day.status == 'booked'">
          <del v-if="day.status == 'booked'">
            {{ day.text }}
          </del>
          <span v-else>
            {{ day.text }}
          </span>
          <span v-if="!day.take && day.status == 'temp'">
            /!\
          </span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/firestore';
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

// let db;
// firebase.firestore().enablePersistence()
//   .then(() => {
//     db = firebase.firestore();
//   });

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
      fromDay: '',
      toDay: '',
      calcDays: 0,
      calcPrice: 0,
      selectedItem: undefined,
      items: [
        {
          id: 1,
          name: 'tesla1',
          title: 'Tesla S 2018',
          price: '2000',
        },
        {
          id: 2,
          name: 'tesla2',
          title: 'Tesla S 2015',
          price: '1800',
        },
      ],
      email: '',
      phone: '',
      agree: false,
      agreeIP: '',
      agreeStamp: '',

      calendar: {},
      name: 'temp',
      days: [
        // { text: '2018-06-16', booked: false, take: false },
        // { text: '2018-06-17', booked: true, take: false },
      ],
      reservationRefId: '',
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
    // eslint-disable-next-line
    fromDay: function (val) {
      Object.keys(this.calendar).forEach((key) => {
        this.calendar[key].selected = false;
      });
      this.calendar[val].selected = true;
      if (this.toDay) {
        this.calcDays = moment(this.toDay).diff(this.fromDay, 'days');
      }
      // this.calendar[this.fromDay].from = true;
    },
    // eslint-disable-next-line
    toDay: function (val) {
      if (this.fromDay) {
        this.calcDays = moment(this.toDay).diff(this.fromDay, 'days');

        Object.keys(this.calendar).forEach((key) => {
          this.calendar[key].selected = false;
        });

        const date = new Date(this.fromDay);
        for (let i = 0; i <= this.calcDays; i += 1) {
          if (this.calendar[moment(date).format('L')].booked) {
            this.toDay = moment(date.setDate(date.getDate() - 1)).format('L');
            break;
          }
          this.calendar[moment(date).format('L')].selected = true;
          date.setDate(date.getDate() + 1);
        }

        if (this.selectedItem !== undefined) {
          this.calcPrice = this.calcDays * this.items[this.selectedItem].price;
        }

        if (this.fromDay >= this.toDay) {
          this.toDay = moment(this.fromDay).add(1, 'days').format('L');
        }

        // if (this.calcDays >= 0) {
        //   this.calcDays = 0;
        // }
      }
      // this.calendar[this.toDay].to = true;
    },
  },
  // created: () => {
  //   this.fetchData();
  // },
  mounted() {
    this.fetchData();
    // console.log(moment().format('YYYY-MM-DD HH:mm'));

    const today = new Date();
    // const firstDayOfMonth = moment().startOf('month').format('L');
    const firstDay = moment(today).weekday('-0');
    const lastDay = moment().add(1, 'M').endOf('month');
    const lastSunday = moment(lastDay).weekday('6');
    const daysToShow = moment(lastSunday).diff(firstDay, 'days');

    const date = new Date(firstDay);
    let thisDay;
    for (let i = 0; i <= daysToShow; i += 1) {
      thisDay = moment(date).format('YYYY-MM-DD');
      this.days.push({
        text: moment(date).format('YYYY-MM-DD'),
        status: '',
        take: false,
      });

      this.calendar[thisDay] = {
        disabled: false,
        booked: false,
        warning: false,
        selected: false,
      };

      if (moment().diff(thisDay, 'days') > 0) {
        this.calendar[thisDay].disabled = true;
      }

      date.setDate(date.getDate() + 1);
    }

    // this.days.findIndex('2018-06-29').booked = true;
    // console.log(this.days.find(day => day.text === '2018-06-17').booked);
    // this.days.find(day => day.text === '2018-06-16').booked = true;
  },
  methods: {
    // eslint-disable-next-line
    moment: function (val) {
      return moment(val);
    },
    fetchData() {
      db.collection('users').doc('LjMAmyGQhb7Pig2zxwgx')
        .onSnapshot((snap) => {
          this.name = snap.data().first;
        });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      db.collection('calendar').where('day', '>=', today).orderBy('day', 'asc')
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            const theDay = moment.unix(change.doc.data().day.seconds).format('YYYY-MM-DD');
            if (change.type === 'added') {
              if (change.doc.data().status === 'booked') {
                this.calendar[theDay].booked = true;
              }
              this.days.find(day => day.text === theDay).status = change.doc.data().status;
            }
            if (change.type === 'removed') {
              // this will also clear any previous temp state
              this.days.find(day => day.text === theDay).status = '';
            }
            // if changed to booked?
          });
        });
    },
    toggleTake(day) {
      // console.log(day.take);
      // eslint-disable-next-line
      if (day.take === false) {
        // eslint-disable-next-line
        day.take = true;

        const now = new Date();
        const selected = new Date(day.text);
        db.collection('calendar').add({
          day: selected,
          status: 'temp',
          added: now,
        })
          .then((docRef) => {
            // eslint-disable-next-line
            day.dbRefId = docRef.id;
          });
      } else {
        // eslint-disable-next-line
        day.take = false;
        db.collection('calendar').doc(day.dbRefId).delete();
        // eslint-disable-next-line
        // day.booked = false;
      }
    },
    saveReservation() {
      const now = new Date();
      db.collection('reservations').add({
        item: this.items[this.selectedItem].name,
        start: this.fromDay,
        end: this.toDay,
        email: this.email,
        phone: this.phone,
        agreeIP: this.agreeIP,
        agreeStamp: this.agreeStamp,
        added: now,
      })
        .then((docRef) => {
          // eslint-disable-next-line
          this.reservationRefId = docRef.id;
          this.$router.push({ path: 'about', query: { ref: docRef.id } });
        });
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

.calendar {
  width: 100%;
  /* display: flex; */
  text-align: center;
}

.calendar-week-box {
  display: inline-block;
  width: 12.5%;
}

.calendar-box {
  display: inline-block;
  width: 12.5%;
  background-color: silver;
  font-weight: bold;
  cursor: pointer;
}

.calendar .disabled {
  color: gray;
}

.calendar .booked {
  color: red;
}

.calendar .selected {
  background-color: cyan;
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
