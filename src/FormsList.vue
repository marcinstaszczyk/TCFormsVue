<template>
  <div>
    <v-layout row wrap mb-5>
      <v-flex xs12>
        <v-btn @click="editForm(selectedForm)" large :disabled="!selectedForm.id">Edytuj</v-btn>
        <v-btn @click="selectedToDeleteForm = selectedForm" large error :disabled="!selectedForm.id">Usuń</v-btn>
        <v-btn @click="deleteForm(selectedToDeleteForm)" large error v-if="selectedToDeleteForm.id">... i potwierdź :)</v-btn>

        <v-btn @click="showDetails = !showDetails" large>Pokaż szczegóły</v-btn>

        <tcf-form-view v-for="form in formsList" :key="form.uuid" :form="form" :showDetails="showDetails" @click.native="select(form)" style="margin-top: 24px;"></tcf-form-view>
      </v-flex>
    </v-layout>
  </div>
</template>

<style lang="scss">

</style>

<script>
  import * as firebase from 'firebase';
  import { Form } from './model/form'

  const firebaseFormsRef = firebase.database().ref('tcf/forms');

  export default {
    data () {
      return {
        formsList: [],
        showDetails: false,
        selectedForm: {},
        selectedToDeleteForm: {},
      }
    },
    methods: {
      select (form) {
        if (this.selectedForm === form) {
          this.selectedForm = {}
        } else {
          this.selectedForm = form
        }
        this.selectedToDeleteForm = {}
      },
      editForm(form) {
        this.$router.push({ name: 'edit', params: { formId: form.id }})
      },
      deleteForm(form) {
        firebaseFormsRef.child(form.uuid).set(null)
          .then(() => {
            this.loadFormsList();
            this.selectedForm = {}; 
            this.selectedToDeleteForm = {}
          })
          .catch(error => this.$root.messagesService.showError(error));
      },
      loadFormsList() {
        firebaseFormsRef.once('value', 
          snapshot => { 
            const data = snapshot.val();
            this.formsList = Object.keys(data).map(key => data[key]); 
          },
          error => this.$root.messagesService.showError(error)
        );
      }
    },
    mounted () {
      this.loadFormsList();
    },
  }
</script>
