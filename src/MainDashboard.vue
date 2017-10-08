<template>
  <div>
    <v-layout row wrap mb-5>
      <v-flex xs12>
        <v-form class="load-UUID-form" v-model="loadFromUUIDfromValid" ref="form">
          <label for="UUIDtoLoad" class="nobr">Aby poprawić już wprowadzoną formę podaj</label>
          <v-text-field id="UUIDtoLoad" label="kod" v-model="UUIDtoLoad" 
              :rules="[rules.required, rules.regex]" required></v-text-field>
          <span class="nobr"> i wciśnij </span>
          <v-btn @click="loadFormFormUUID" large primary :disabled="!loadFromUUIDfromValid">Przycisk</v-btn>
        </v-form>
      </v-flex>
    </v-layout>

    <v-alert class="success" icon="check_circle" dismissible v-model="showSaveConfirmation">
      <span v-if="showUuidInfo">Forma została dodana.<br/>
        Aby w przyszłości móc poprawić formę proszę zapisać kod: 
        <span class="nobr">{{form.uuid}}</span>
      </span>
      <span v-else>Forma została zmieniona.</span>
    </v-alert>
    
    <v-layout row wrap>
      <v-flex xs12 lg6>
        <tcf-form-edit :form="form" @save="saveForm" @newForm="newForm"></tcf-form-edit>
      </v-flex>
      <v-flex xs12 lg6 pl-2>
        <h4>Podgląd</h4>
        <tcf-form-view :form="form"></tcf-form-view>
      </v-flex>
    </v-layout>

    <v-alert class="success" icon="check_circle" dismissible v-model="showSaveConfirmation">
      <span v-if="showUuidInfo">Forma została dodana.<br/>
        Aby w przyszłości móc poprawić formę proszę zapisać kod: 
        <span class="nobr">{{form.uuid}}</span>
      </span>
      <span v-else>Forma została zmieniona.</span>
    </v-alert>
  </div>
</template>

<style lang="scss">
  .load-UUID-form {
    label {
      display: inline-block;
    }
    .input-group {
      display: inline-block;
      max-width: 300px;
      //margin: -30px 0;
      .input-group__details {
        min-height: 1px;
        padding: 0;
        overflow: visible;
        display: block;
      }
    }
  }
</style>

<script>
  import * as firebase from 'firebase';
  import { Form } from './model/form'

  const firebaseFormsRef = firebase.database().ref('tcf/forms');
  const firebaseFormsCounterRef = firebase.database().ref('tcf/formsCounter');

  export default {
    props: {
      formId: {
        default: -1
      },
    },
    data () {
      return {
        UUIDtoLoad: "",
        loadFromUUIDfromValid: false,
        rules: {
          required: (value) => !!value || ' ',
          regex: (value) => /^([0-9a-f-]{36}|.{20})$/.test(value) || ' ',
        },
        form: new Form(),

        showSaveConfirmation: false,
        showUuidInfo: false,
      }
    },
    watch: {
      formId: function(formId) {
        this.loadFormForId(formId);
      }
    },
    methods: {
      loadFormFormUUID () {
        if (!this.$refs.form.validate()) {
          return;
        }
        const _this = this;
        firebaseFormsRef.child(this.UUIDtoLoad).once('value', 
          snapshot => { 
            const form = snapshot.val(); 
            if (!form.index) form.index = [];
            _this.form = form;
          },
          error => { this.$root.messagesService.showError( error.code === 'PERMISSION_DENIED' ? 'Nie poparwny identyfikator formy' : ('Błąd przy pobieraniu formy: ' + error)) }
        );
      },
      newForm() {
        this.form = new Form();

        this.showSaveConfirmation = false;
        this.showUuidInfo = false;
      },
      loadFormForId(formId) {
        if (formId === -1) {
          this.form = new Form();
        } else {
          firebaseFormsRef.orderByChild('id').equalTo(formId).once('value', 
            snapshot => this.form = _extractOneFromQuery(snapshot.val()),
            error => console.log(error)
          );
        }
      },
      saveForm (form) {
        if (!form.uuid) {
          // Get a key/uuid for a new Item.
          const postKey = firebaseFormsRef.push().key;
          
          const copy = {...form};
          copy.uuid = postKey; 

          firebaseFormsCounterRef.transaction(
            currentValue => (currentValue||0) + 1,
            (err, commited, ss) => {
              if (err) {
                error => this.$root.messagesService.showError(error)
              } else if (commited) {
                copy.id = ss.val().toString();
                this._saveFormWithId(copy);
              }
            }
          );
        } else {
          this._saveFormWithId(form);
        }
      },
      _saveFormWithId(form) {
        return firebaseFormsRef.child(form.uuid).set(form)
          .then(() => {
            this.showSaveConfirmation = true;
            this.showUuidInfo = this.form.id == null || this.form.id === "";
            if (this.showUuidInfo) {
              this.UUIDtoLoad = form.uuid;
            }

            this.form = form;
          })
          .catch(error => this.$root.messagesService.showError(error));
      }
    },
    mounted () {
      this.loadFormForId(this.formId);
    },
  }

  function _extractOneFromQuery(data) {
    if (!data) {
      return null;
    }
    for (var key in data) {
      return data[key];
    }
    return null;
  }
</script>
