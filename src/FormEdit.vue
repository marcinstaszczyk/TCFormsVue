<template>

  <v-form v-model="vFromValid" ref="form">
    <v-select label="Obszar tematyczny" v-model="form.area" :items="sAreas"
      :rules="[rules.required]" required max-height="500"></v-select>

    <v-text-field label="Nazwa formy" v-model="form.name" 
      :rules="[rules.required, rules.max130]" :counter="130" required></v-text-field>

    <v-text-field label="Zakres szkolenia" v-model="form.scope" multi-line rows="7"
      :rules="[rules.required, rules.max250]" :counter="250" required></v-text-field>

    <v-text-field label="Adresaci" v-model="form.target" 
      :rules="[rules.required, rules.max70]" :counter="70" required></v-text-field>

    <v-select label="Forma zajęć" v-model="form.type" :items="dictionaries.sTypes"
      :rules="[rules.required]" required></v-select>

    <v-layout row wrap>
      <v-flex xs12 sm5 md3 lg5>
        <v-menu lazy :close-on-content-click="false" transition="scale-transition" 
            offset-y full-width :nudge-left="40" max-width="290px"
            v-model="stardDateMenuOpen">
          
          <v-text-field slot="activator" label="Termin realizacji" v-model="form.startDate"
            prepend-icon="event" readonly :rules="[rules.required]" required></v-text-field>
          
          <v-date-picker v-model="form.startDate" :allowed-dates="allowedStartDates" autosave
              no-title scrollable locale="pl-PL" first-day-of-week="1" ></v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs12 sm4 md3 lg4 offset-sm1>
        <v-text-field label="Liczba godzin" v-model.number="form.hours" type="number"
          min="1" max="168" :rules="[rules.required, rules.min1h, rules.max168h]" required></v-text-field>
      </v-flex>
    </v-layout>

    <v-select label="Kierownik szkolenia" v-model="form.owner" :items="dictionaries.sOwners"
      :rules="[rules.required]" required max-height="500"></v-select>

    <v-text-field label="Prowadzący" v-model="form.teacher" 
      :rules="[rules.required, rules.max70]" :counter="70" required></v-text-field>

    <v-flex xs12 sm5 md3 lg5>
      <v-text-field label="Odpłatność" v-model.number="form.payment" type="number"
        min="0" max="10000" :rules="[rules.required, rules.minPayment, rules.maxPayment]" required></v-text-field>
    </v-flex>

    <v-text-field label="Informacje dodatkowe" v-model="form.addInfo" multi-line rows="5"
      :rules="[rules.required, rules.max250]" :counter="250" required></v-text-field>

    <v-btn @click="showIndex = !showIndex">Pokaż index</v-btn>
    <span v-if="indexMaxExceeded" class="index_error">Możesz zaznaczyć maksymalnie 4 pola indeksu</span>
    <template v-if="showIndex">
      <v-switch v-for="(item, i) in dictionaries.sIndex" v-bind:key="i"
        :label="item" :value="item" v-model="form.index"
        hide-details :color="indexMaxExceeded ? 'error' : 'primary'"></v-switch>
    </template>

    <v-layout row wrap>
      <v-btn @click="submit" large :class="{ primary: allValid, grey: !allValid }">
        {{form.id ? 'Aktualizuj formę' : 'Dodaj formę'}}</v-btn>
      <v-btn v-if="form.id && !$root.isLogedIn" @click="newForm" large>Wypełnij nową formę</v-btn>
    </v-layout>

  </v-form>

</template>

<style lang="scss">
  .list__tile {
    height: auto;
  }
  .index_error {
    font-size: 12px;
    color: #ff5252;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)
  }
</style>


<script>
  import * as firebase from 'firebase';
  import { Form } from './model/form'

  var dictionariesRef = firebase.database().ref('tcf/dictionaries')

  function maxLengthValidation(maxLength) {
    return (value) => value.length <= maxLength || `Pole może mieć maksymalnie ${maxLength} znaków.`
  }

  export default {
    firebase: {
      dictionaries: {
        source: dictionariesRef,
        asObject: true
      }
    },
    props: {
      form: {
        type: Object,
        required: true
      },
    },
    data () {
      return {
        //form: new Form(),
        vFromValid: false,
        rules: {
          required: (value) => !!value || (typeof value === 'number' && value === 0) || 'Wypełnienie pola jest wymagane.',
          max70: maxLengthValidation(70),
          max130: maxLengthValidation(130),
          max250: maxLengthValidation(250),
          min1h: (value) => value > 0 || 'Min 1 godzina.',
          max168h: (value) => value <= 168 || 'Maksymalnie 168 godzin.',
          minPayment: (value) => value >= 0 || 'Podana wartość nie jest liczbą natualną.',
          maxPayment: (value) =>  value <= 10000 || 'Maksymalnie 10000.',
          sizeMax4: (value) => value.length <= 4 || 'Możesz zaznaczyć maksymalnie 4 pola indeksu.',
          log: (value) => { console.log('validate', value); return true; },
        },
        stardDateMenuOpen: false,
        allowedStartDates: {
          min: null,
          max: null
        },
        showIndex: false,
      }
    },
    computed: {
      /*form() {
        return new Form();
      },*/
        /*console.log('thth', this.formProp);
        return {...new Form(), ...this.formProp};*/
      sAreas() {
        if (!this.dictionaries || !this.dictionaries.sAreas) {
          return [];
        }

        return this.dictionaries.sAreas.reduce((array, item, index) => {
          return array.concat({ header: item.name }, item.sub)
        }, []);
      },
      indexMaxExceeded() {
        return this.form.index.length > 4;
      },
      allValid() {
        return this.vFromValid && !this.indexMaxExceeded;
      }
    },
    mounted () {
      const minDate = new Date();
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1)
      this.allowedStartDates.min = minDate;
      this.allowedStartDates.max = maxDate;
    },
    methods: {
      submit () {
        if (this.$refs.form.validate() && !this.indexMaxExceeded) {
          //this.$refs.form.$el.submit()
          this.$emit('save', this.form);
        }
      },
      newForm() {
        this.$refs.form.reset();
        this.$emit('newForm');
      }
    }
  }
</script>