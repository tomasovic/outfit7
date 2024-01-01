import {defineStore} from 'pinia'

export default defineStore('alert', {
  state: () => ({
    showAlert: false,
    alertVariant: 'success',
    alertMsg: 'You have been logged in!',
  }),
  actions: {
    async triggerAlert(alertVariant: string, alertMsg: string) {
      this.showAlert = true
      this.alertVariant = alertVariant
      this.alertMsg = alertMsg
    },
  }
})
