import axios from 'axios'

export const fetchIpData = async () => {
  try {
    const response = await axios.get('/json/?fields=countryCode', {
      baseURL: 'http://ip-api.com',
      withCredentials: false
    })

    return response.data
  } catch (error) {
    console.error('Error fetching IP data:', error)
    return {countryCode: 'SI'}
  }
}
