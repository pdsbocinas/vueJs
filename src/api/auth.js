import Vue from 'vue'
import { getCountry } from '../vuex/getters'
import store from '../vuex/store'

const doLogin = cookie => {
  return Vue.http.post(
    `${process.application[getCountry(store.state)].ITV_API_URL}auth/qubit`,
    JSON.stringify({
      'cook': cookie
    }))
}

const keepAlive = authToken => {
  return Vue.http.post(
    `${process.application[getCountry(store.state)].ITV_API_URL}auth/app/refresh`,
    {},
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  )
}

export default {
  doLogin,
  keepAlive
}
