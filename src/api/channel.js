import Vue from 'vue'
import { getCountry } from '../vuex/getters'
import store from '../vuex/store'

const getChannels = function (authToken) {
  return Vue.http.get(
    `${process.application[getCountry(store.state)].ITV_API_URL}channels/list`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  )
}

export default {
  getChannels
}
