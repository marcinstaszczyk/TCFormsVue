<template>
  <v-app light>
    <!-- <v-navigation-drawer></v-navigation-drawer> -->
    <v-toolbar v-if="$root.isLogedIn" class="blue darken-3">
      <router-link tag="span" to="/" exact><v-btn>Nowa forma</v-btn></router-link>
      <router-link tag="span" to="/list" exact><v-btn>Lista form</v-btn></router-link>
      <v-spacer></v-spacer>
      <v-btn @click="signOut" icon dark>
        <v-icon>cancel</v-icon>
      </v-btn>
    </v-toolbar>
    <main>
      <div>
        <v-container fluid>
          <v-alert v-for="messageData in $root.messagesService.messages" :key="messageData.no" class="error" :class="messageData.status" icon="error" value="true">
            {{messageData.message.toString()}}
          </v-alert>
          
          <router-view></router-view>

        </v-container>
      </div>
    </main>
    <v-footer></v-footer>
  </v-app>
</template>

<style lang="scss">
  @keyframes fadeout {
    0%  { opacity: 1; }
    50% { opacity: 0.5; }
    100%{ opacity: 0; transform: scaleY(0); height: 0; margin: 0; padding: 0; display: none;}
  }

  .fadeout {
    animation-name: fadeout;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
</style>

<script>
  import * as firebase from 'firebase';

  var config = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
  }
  firebase.initializeApp(config)

  export default {
    mounted () {
      firebase.auth().onAuthStateChanged(
        user => {
          console.log('User status change: ', user);
          if (user && !user.isAnonymous) {
            this.$root.user = { login: user.email }
          } else {
            this.$root.user = {}
          }
        }
      );
    },
    methods: {
      navigateNewForm() {
        this.$router.push('/')
      },
      navigateList() {
        this.$router.push('/list')
      },
      signOut() {
        firebase.auth().signOut();
      }
    }
  }
</script>
