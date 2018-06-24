<template>
  <div class="home">
    <div>
      <p>✔ Car is reserved. Confirmation has been sent via email.</p>

      <p>To keep you reservation you need to make your payment within 3 days.</p>

      <button>Pay with card</button>

      <button>Pay with PayPal account</button>

      <p>Åre Electic AB<br>phone<br>email</p>
    </div>

    <div>
      <p>✔ Payment is confirmed.</p>

      <h2>Reservation 133701</h2>

      <p>Before you can pick up your car you need to give us your complete contact details.</p>

      <p>Confirm your identity using Swedish BankID</p>

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

    <div>
      <p>✔ Contact details is saved</p>
      <p>Reservation details and terms has been sent to your email account.</p>
      <p>You can still add drivers visiting the reservation details page.</p>
      <button>Reservation details</button>
      <h2>Terms and conditions</h2>
      <p>Everything about cancellations, personal details, insurences etc.</p>
    </div>

    <img src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  data() {
    return {
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
      contactName: '',
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
  name: 'home',
  components: {
    HelloWorld,
  },
};
</script>
