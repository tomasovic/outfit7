import {defineStore} from 'pinia'
import {fetchIpData} from '@/utils/thirdPartyAPI'
import axios from 'axios'
import {AuthParams} from '@/utils/types'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false,
    user: {}
  }),
  actions: {
    async register({email, password}: AuthParams) {
      const {countryCode} = await fetchIpData()
      const {data} = await axios.post('v1/auth/signup', {
        countryCode,
        email,
        password
      })

      this.userLoggedIn = true
      this.user = data
    },
    async authenticate({email, password}: AuthParams) {
      const {data} = await axios.post('v1/auth/signin', {
        email,
        password
      })

      this.userLoggedIn = true
      this.user = data
    },
    async whoami() {
      const {data} = await axios.get('v1/auth/whoami')

      this.user = data
      this.userLoggedIn = true
    },
    async signout() {
      await axios.post('v1/auth/signout')
      
      this.userLoggedIn = false
      this.user = {}
    }
  }
})
