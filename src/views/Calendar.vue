<template>
  <div>

    <div>
      <p v-for="(item, index) in items" v-bind:key="item.id">
        <label><input type="radio" name="item" v-model.number="selectedItem" v-bind:value="index">
          {{ item.title }}</label><br>
          {{ item.price }} SEK
      </p>
    </div>

    <div class="calendar">
      <template v-for="(day, index) in calendar">
        <div v-if="$moment(index).weekday() === 0" class="calendar-week-box" v-bind:key="$moment(index).week()">
          v. {{ $moment(index).week() }}
        </div>
        <div class="calendar-box" v-bind:key="index">
          <div v-if="day.disabled" class="disabled">
            {{ $moment(index).format('D') }}
          </div>
          <div v-else-if="day.booked" class="booked">
            X
          </div>
          <div v-else-if="day.selected" class="selected" v-on:click="toDay = ''; fromDay = ''">
            {{ $moment(index).format('D') }}
          </div>
          <div v-else-if="fromDay" v-on:click="toDay = index">
            {{ $moment(index).format('D') }}
          </div>
          <div v-else-if="!fromDay" v-on:click="fromDay = index">
            {{ $moment(index).format('D') }}
          </div>
        </div>
      </template>
    </div>

    <div>
      <p>Pickup: <input type="date" v-model="fromDay"> between 9-11 am</p>
      <p v-if="fromDay || toDay">Leave: <input type="date" v-model="toDay"> between 3-4 pm</p>
    </div>

    <div v-if="selectedItem === undefined && calcDays > 0">
      <h2>Price</h2>
      <p>Please select a car to calculate the total price.</p>
    </div>

    <div v-if="selectedItem !== undefined && calcDays > 0">
      <h2>Price</h2>
      <p>{{ calcDays }} days à {{ items[selectedItem].price }} SEK = {{ calcPrice }} SEK</p>
    </div>

    <div>
      <p>E-mail: <input type="email" v-model="email"></p>
      <p>Phone: <input type="tel" v-model="phone"></p>
      <p><label><input type="checkbox" v-model="agree"> Agree terms</label></p>
      <button v-bind:disabled="selectedItem === undefined || !fromDay || !toDay || !email || !phone || !agree" v-on:click="saveReservation">Make reservation</button>
    </div>

  </div>
</template>

<script>
const today = new Date();
today.setHours(0, 0, 0, 0);

export default {
  data() {
    return {
      fromDay: '',
      toDay: '',
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
      reservationRefId: '',
      updated: undefined,
    };
  },
  computed: {
    // eslint-disable-next-line
    calcDays: function () {
      if (this.fromDay && this.toDay) {
        return this.$moment(this.toDay).diff(this.fromDay, 'days');
      }
      return 0;
    },
    // eslint-disable-next-line
    calcPrice: function () {
      if (this.selectedItem !== undefined) {
        return this.calcDays * this.items[this.selectedItem].price;
      }
      return 0;
    },
  },
  watch: {
    // eslint-disable-next-line
    selectedItem: function (val) {

      // clear all selected days
      Object.keys(this.calendar).forEach((key) => {
        this.calendar[key].booked = false;
      });

      // blocka bokade dagar
      this.$db.collection('calendar').where('day', '>=', today).where('item', '==', this.items[this.selectedItem].name).orderBy('day', 'asc')
        .onSnapshot((snapshot) => {
          console.log('snap', this.items[this.selectedItem].name);
          snapshot.docChanges().forEach((change) => {
            const theDay = this.$moment.unix(change.doc.data().day.seconds).format('YYYY-MM-DD');
            // console.log(theDay, change.type, change.doc.data().status);
            if (change.type === 'added') {
              if (change.doc.data().status === 'booked') {
                this.calendar[theDay].booked = true; // will not update view
                this.$forceUpdate(); // this will update view
              }
            }
            if (change.type === 'removed') {
              //
            }
          });
        });
    },
    // eslint-disable-next-line
    fromDay: function (val) {
      // Object.keys(this.calendar).forEach((key) => {
      //   this.calendar[key].selected = false;
      // });
      this.calendar[val].selected = true;
    },
    // eslint-disable-next-line
    toDay: function (val) {
      this.calendar[val].selected = true;
    },
    // eslint-disable-next-line
    calcDays: function (val) {

      // clear all selected days
      Object.keys(this.calendar).forEach((key) => {
        this.calendar[key].selected = false;
      });

      if (this.calcDays > 0) {
        // make selection
        const date = new Date(this.fromDay);
        for (let i = 0; i <= this.calcDays; i += 1) {
          if (this.calendar[this.$moment(date).format('L')].booked) {
            this.toDay = this.$moment(date.setDate(date.getDate() - 1)).format('L');
            break;
          }
          this.calendar[this.$moment(date).format('L')].selected = true;
          date.setDate(date.getDate() + 1);
        }

        // if (this.fromDay >= this.toDay) {
        //   this.toDay = this.$moment(this.fromDay).add(1, 'days').format('L');
        // }

        // if (this.calcDays >= 0) {
        //   this.calcDays = 0;
        // }
      }
    },
  },
  updated() {

  },
  mounted() {
    // this.$db.collection('reservations').doc('72fU4UIue3vsaXXGebTZ')
    // .onSnapshot((snap) => {
    //   // this.email = snap.data().email;
    // });

    const firstDay = this.$moment(today).weekday('-0');
    const lastDay = this.$moment().add(1, 'M').endOf('month');
    const lastSunday = this.$moment(lastDay).weekday('6');
    const daysToShow = this.$moment(lastSunday).diff(firstDay, 'days');

    const date = new Date(firstDay);
    let thisDay;
    for (let i = 0; i <= daysToShow; i += 1) {
      thisDay = this.$moment(date).format('YYYY-MM-DD');

      this.calendar[thisDay] = {
        disabled: false,
        booked: false,
        warning: false,
        selected: false,
      };

      if (this.$moment().diff(thisDay, 'days') > 0) {
        this.calendar[thisDay].disabled = true;
      }
      this.$forceUpdate();

      date.setDate(date.getDate() + 1);
    }

    // blocka bokade dagar
    this.$db.collection('calendar').where('day', '>=', today).orderBy('day', 'asc')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const theDay = this.$moment.unix(change.doc.data().day.seconds).format('YYYY-MM-DD');
          // console.log(theDay, change.type, change.doc.data().status);
          if (change.type === 'added') {
            if (change.doc.data().status === 'booked') {
              this.calendar[theDay].booked = true; // will not update view
              this.$forceUpdate(); // this will update view
            }
          }
          if (change.type === 'removed') {
            //
          }
        });
      });
  },
  methods: {
    saveReservation() {
      const now = new Date();
      this.$db.collection('reservations').add({
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
          this.$router.push({ path: 'reservation', query: { ref: docRef.id } });
        });
    },
  },
  name: 'calendar',
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
