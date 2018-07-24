<template>
  <div>
    <div v-if="paid !== undefined">
      <p>✔ Payment is confirmed.</p>

      <h2>Reservation</h2>
      <p><pre>ID: {{ $route.query.ref }}</pre></p>

      <p>Before you can get your car you need to give us your complete contact details.</p>

      <p><button>Confirm your identity using Swedish BankID</button></p>

      <p>
        {{ isCompany ? 'Company name' : 'Name' }}:
        <input v-model="name"><br>
      </p>
      <p><label><input type="checkbox" v-model="isCompany"> Company/organization</label></p>
      <p>
        Country:
        <select v-model="country">
          <option value="se">Sweden</option>
          <option value="no">Norway</option>
          <option>other</option>
        </select>
      </p>
      <p v-if="country === 'se'">Personnummer: <input v-model="pnr"></p>

      <p v-if="isCompany">
        {{ country == 'se' ? 'Organisationsnummer' : 'VAT' }}:
        <input v-model="vat">
      </p>

      <p>Address: <input v-model="street"><input v-model="zip"><input v-model="city"></p>

      <p>Address during stay:<br>
        <input v-model="stayStreet">
        <input v-model="stayZip">
        <input v-model="stayCity">
      </p>

      <p>Your name: <input v-model="contactName"></p>

      <p>Drivers: <button v-on:click="addDriver()">Add driver</button></p>

      <div v-for="(driver, index) in drivers" v-bind:key="index">
        <input v-model="driver.name"> <input v-model="driver.pnr">
      </div>

    </div>

    <div v-else-if="contactName !== undefined">
      <p>✔ Contact details is saved</p>
      <p>Reservation details and terms has been sent to your email account.</p>
      <p>You can still add drivers visiting the reservation details page.</p>
      <button>Reservation details</button>
      <h2>Terms and conditions</h2>
      <p>Everything about cancellations, personal details, insurences etc.</p>
    </div>

    <div v-else>
      <p>✔ Car is reserved. Confirmation has been sent via email.</p>

      <p>Reservation ID: {{ $route.query.ref }}</p>

      <p>To keep you reservation you need to make your payment within 3 days.<br/>
      Payments are confirmed manually and sometimes that might take a few days.</p>

      <form action="https://www.paypal.com/cgi-bin/webscr" method="post">

      <input type="hidden" name="business" value="info@areelectric.com">
      <input type="hidden" name="cmd" value="_xclick">

      <!-- return=url, notify_url, custom/invoice (orderid?),
      paymentaction=authorization, image_url=logo150x50,
      cancel_return, email, callback_url? -->

      <input type="hidden" name="no_shipping" value="1">
      <input type="hidden" name="email" v-model="this.email">
      <input type="hidden" name="invoice" v-model="$route.query.ref">

      <input type="hidden" name="item_name" value="Reservation">
      <input type="hidden" name="amount" v-model="this.price">
      <input type="hidden" name="currency_code" value="SEK">

      <input type="image" src="https://www.paypalobjects.com/sv_SE/SE/i/btn/btn_paynowCC_LG.gif" border="0" name="submit" alt="PayPal - Det tryggare, enklare sättet att betala online!">
      <img alt="" border="0" src="https://www.paypalobjects.com/sv_SE/i/scr/pixel.gif" width="1" height="1">

      </form>

      <p>Åre Electic AB<br>phone<br>email</p>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      paid: undefined,
      name: '',
      isCompany: false,
      country: 'se',
      pnr: '',
      vat: '',
      street: '',
      zip: '',
      city: '',
      stayStreet: '',
      stayZip: '',
      stayCity: '',
      contactName: undefined,
      drivers: [
        {
          name: '',
          pnr: '',
        },
      ],
      price: undefined,
      email: '',
    };
  },
  watch: {
    // eslint-disable-next-line
    name: function (val) {
      if (val.slice(-3) === ' AB') {
        console.log('AB!');
        this.isCompany = true;
      }
    },
  },
  mounted() { // will not update when query is changed
    this.$db.collection('reservations').doc(this.$route.query.ref)
      .onSnapshot((snapshot) => {
        this.paid = snapshot.data().paid; // date
        this.email = snapshot.data().email;

        let itemPrice;
        switch (snapshot.data().item) {
          case 'tesla1':
            itemPrice = 2000;
            break;
          case 'tesla2':
            itemPrice = 1800;
            break;
          default:
            itemPrice = undefined;
        }
        this.price = this.$moment(snapshot.data().end).diff(this.$moment(snapshot.data().start), 'days') * itemPrice;

        // snapshot.docChanges().forEach((change) => { // bug
        //   if (change.doc.data().paid !== undefined) {
        //     this.paid = change.doc.data().paid;
        //   }
        // });
      });
  },
  methods: {
    addDriver() {
      this.drivers.push({
        name: '',
        pnr: '',
      });
    },
    save() {

    },
  },
  name: 'reservation',
};
</script>
