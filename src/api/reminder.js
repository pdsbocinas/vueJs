import Vue from 'vue'
import { getCountry } from '../vuex/getters'
import store from '../vuex/store'

const getList = function (authToken) {
  return Vue.http.get(
    `${process.application[getCountry(store.state)].ITV_API_URL}reminders/mine`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      params: {
      }
    }
  )
}

const setReminder = function (authToken, idTransmission) {
  return Vue.http.post(
    `${process.application[getCountry(store.state)].ITV_API_URL}reminders/schedule/${idTransmission}`,
    {},
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    }
  )
}

const deleteReminder = function (authToken, idTransmission) {
  return Vue.http.delete(
    `${process.application[getCountry(store.state)].ITV_API_URL}reminders/schedule/${idTransmission}`,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    }
  )
}

export default {
  getList,
  setReminder,
  deleteReminder
}
