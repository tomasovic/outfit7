<template>
  <app-notification v-if="showAlert"/>
  <v-container class="mx-auto d-flex align-center justify-center">
    <v-menu min-width="200px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn class="mr-5" icon v-bind="props">
          <v-avatar color="brown" size="large">
            <span class="text-h5">{{ getEmailInitials(user.email) }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="brown">
              <span class="text-h5">{{ getEmailInitials(user.email) }}</span>
            </v-avatar>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn rounded variant="text">
              <router-link to="/profile">
                Edit Account
              </router-link>
            </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn rounded variant="text" @click="logout">
              Disconnect
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
    <v-btn
      v-for="link in links"
      :key="link"
      :text="link"
      :to="'/' + link"
      variant="text"
    ></v-btn>
    <v-btn
      v-if="$route.path === '/events'"
      class="ml-5"
      color="green"
      to="/events/create"
      variant="elevated"
    >
      Create
    </v-btn>
    <v-spacer></v-spacer>
  </v-container>
</template>

<script lang="ts">
import {getEmailInitials} from '@/utils/user'
import {mapActions, mapState} from 'pinia'
import useUserStore from '@/store/user'
import useAlertStore from '@/store/alert'
import AppNotification from '@/components/Notification.vue'

export default {
  name: 'AppBar',
  components: {AppNotification},
  data() {
    return {
      links: [
        'dashboard',
        'events'
      ],
    }
  },
  computed: {
    ...mapState(useUserStore, ['user']),
    ...mapState(useAlertStore, ['showAlert']),
  },
  methods: {
    ...mapActions(useUserStore, ['signout']),
    getEmailInitials,
    async logout() {
      await this.signout()
      this.$router.push('/login')
    },
  },
}
</script>
