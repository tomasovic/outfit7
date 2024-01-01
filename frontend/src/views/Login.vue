<template>
  <v-alert v-if="showAlert" :text="alertMsg" :type="alertVariant" closable variant="tonal"/>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="6" md="6" sm="8">
        <v-img height="300" src="@/assets/logo.svg"/>
        <login-form :inSubmission="inSubmission" :onLogin="login"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions} from 'pinia'
import useUserStore from '@/store/user'
import LoginForm from '@/components/LoginForm.vue'

export default {
  components: {LoginForm},
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      visible: false,
      inSubmission: false,
      showAlert: false,
      alertVariant: '',
      alertMsg: 'Please wait, we\'re logging you in....'
    }
  },
  methods: {
    ...mapActions(useUserStore, ['authenticate']),
    triggerAlert(type, message, state) {
      this.alertVariant = type
      this.alertMsg = message
      this.showAlert = state
      this.inSubmission = state
    },
    async login(values) {
      this.triggerAlert('warning', 'Please wait, we\'re logging you in...', true)
      try {
        await this.authenticate(values)
      } catch (err) {
        this.triggerAlert('error', err.response.data.message, true)
        this.inSubmission = false
        return
      }
      this.triggerAlert('success', 'You have been logged in!', true)
      this.inSubmission = false
      this.$router.push('/dashboard')
    },
  },
}
</script>

<style scoped>
</style>
