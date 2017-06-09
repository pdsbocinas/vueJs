import Vue from 'vue'
import { getCountry } from '../vuex/getters'
import store from '../vuex/store'

const getTune = function (authToken, idTransmission) {
  return Vue.http.get(
    `${process.application[getCountry(store.state)].ITV_API_URL}channels/tune/${idTransmission}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
  )
}

export default {
  getTune
}
