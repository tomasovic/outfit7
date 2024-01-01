<template>
  <v-alert v-if="showAlert" :text="alertMsg" :type="alertVariant" closable variant="tonal"/>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="6" md="6" sm="8">
        <v-img height="300" src="@/assets/logo.svg"/>
        <RegisterForm :inSubmission="inSubmission" :onRegister="register"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapActions} from 'pinia'
import useUserStore from '@/store/user'
import RegisterForm from '@/components/RegisterForm.vue'

export default {
  components: {RegisterForm},
  data() {
    return {
      name: 'RegisterView',
      password: '',
      confirm_password: '',
      email: '',
      visible: false,
      isAdmin: false,
      inSubmission: false,
      showAlert: false,
      alertVariant: '',
      alertMsg: 'Please wait, we\'re registering you....'
    }
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: 'register'
    }),
    triggerAlert(type, message, state) {
      this.alertVariant = type
      this.alertMsg = message
      this.showAlert = state
      this.inSubmission = state
    },
    async register(values) {
      this.triggerAlert('warning', 'Please wait, we\'re registering you...', true)
      try {
        await this.createUser(values)
      } catch (err) {
        this.triggerAlert('error', err.response.data.message, true)
        this.inSubmission = false
        return
      }

      this.triggerAlert('success', 'You have been registered!', true)
      this.inSubmission = false
      this.$router.push('/dashboard')
      // window.location.reload()
    },
  },
}
</script>

<style scoped>
</style>


