import Vue from 'vue'
import moment from 'moment'
import { getCountry } from '../vuex/getters'
import store from '../vuex/store'

const getPrograms = function (authToken, channelId, fromTimestamp, toTimestamp) {
  let fromParam = (fromTimestamp !== 0) ? fromTimestamp : moment().set({hours: 0, minutes: 0, seconds: 0, milliseconds: 0}).unix()
  let toParam = (toTimestamp !== 0) ? toTimestamp : moment().set({hours: 23, minutes: 59, seconds: 59, milliseconds: 999}).unix()
  return Vue.http.get(
    `${process.application[getCountry(store.state)].ITV_API_URL}transmissions`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      params: {
        'from': fromParam,
        'to': toParam,
        'channel': channelId
      }
    }
  )
}

export default {
  getPrograms
}
