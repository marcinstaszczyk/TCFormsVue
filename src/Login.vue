<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 md4 lg3>
      <v-form v-model="vFromValid" ref="form">
        <v-text-field label="Login" v-model="login" 
          :rules="[rules.required]" required></v-text-field>

        <v-text-field label="Hasło" v-model="password" type="password"
          :rules="[rules.required]" required></v-text-field>

        <v-layout row wrap>
          <v-btn @click="submit" large :class="{ primary: vFromValid, grey: !vFromValid }">Zaloguj</v-btn>
        </v-layout>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<style lang="scss">

</style>


<script>
  import * as firebase from 'firebase';

//   var dictionariesRef = firebase.database().ref('tcf/dictionaries')

  export default {
    // firebase: {
    //   dictionaries: {
    //     source: dictionariesRef,
    //     asObject: true
    //   }
    // },
    data () {
      return {
        login: "",
        password: "",

        vFromValid: false,
        rules: {
          required: (value) => !!value || (typeof value === 'number' && value === 0) || 'Wypełnienie pola jest wymagane.',
          log: (value) => { console.log('validate', value); return true; },
        },
      }
    },
    computed: {
      
    },
    mounted () {
    },
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          firebase.auth().signInWithEmailAndPassword(this.login, this.password)
            .then(() => { this.$router.push('/list')})
            .catch(error => this.$root.messagesService.showError(error));
        }
      },
    }
  }
</script>