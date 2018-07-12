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
      <p><input type="checkbox" v-model="isCompany"> Company/organization</p>
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

      <p>Drivers: <input v-model="drivers"></p>

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

      <p>To keep you reservation you need to make your payment within 3 days.</p>

      <button>Pay with card</button>

      <button>Pay with PayPal account</button>

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
      drivers: [],
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
  mounted() {
    this.$db.collection('reservations').doc(this.$route.query.ref)
      .onSnapshot((querySnapshot) => {
        this.paid = querySnapshot.data().paid;
        querySnapshot.docChanges().forEach((change) => {
          if (change.doc.data().paid !== undefined) {
            this.paid = change.doc.data().paid;
          }
        });
      });
  },
  name: 'reservation',
};
</script>
