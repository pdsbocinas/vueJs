<template>
  <ul class="date-list">
    <li class="date-element" v-for="date in dates" :class="{ 'active': date.fromTimestamp === fromTimestamp }">
      <a data-hover="{{ date.display }}" @click="setTimestampInterval(date.fromTimestamp, date.toTimestamp)">{{ date.display }}</a>
    </li>
  </ul>
  <form class="date-list-mobile">
    <select class="date-list-select" @change="dateChange($event)">
      <option class="date-element" v-for="date in dates" :selected=isSelectedDate(date)>
        <a data-hover="{{ date.display }}">{{ date.display }}</a>
      </option>
    </select>
  </form>
</template>

<script>
import moment from 'moment'
import { setTimestamp } from '../vuex/actions'

export default {
  props: ['channelSlug'],
  created () {
    this.dates = this.getDates(this.fromTimestamp)
    if (this.fromTimestamp === 0) {
      this.setTimestamp(moment().set({hours: 0, minutes: 0, seconds: 0, milliseconds: 0}).unix(), moment().set({hours: 23, minutes: 59, seconds: 59, milliseconds: 999}).unix())
    }
  },
  vuex: {
    getters: {
      fromTimestamp (state) {
        return state.fromTimestamp
      }
    },
    actions: {
      setTimestamp
    }
  },
  data () {
    return {
      dates: []
    }
  },
  methods: {
    isSelectedDate (date) {
      return date.fromTimestamp === this.fromTimestamp
    },
    transformRoute (route) {
      return process.env.NODE_ENV === 'development' ? route + '-develop' : route
    },
    dateChange (event) {
      let selectedDate = {}
      for (let i = 0; i < this.dates.length; i++) {
        if (this.dates[i].display === event.target.value) {
          selectedDate = this.dates[i]
        }
      }
      this.setTimestampInterval(selectedDate.fromTimestamp, selectedDate.toTimestamp)
    },
    setTimestampInterval (from, to) {
      this.setTimestamp(from, to)
      this.$router.go({
        name: this.transformRoute('program-grid'),
        query: {
          t: moment().unix()
        },
        params: {
          channelSlug: this.channelSlug
        }
      })
    },
    getDates (selectedTimestamp) {
      let dates = [
        {
          display: 'Hoy',
          fromTimestamp: moment().set({hours: 0, minutes: 0, seconds: 0, milliseconds: 0}).unix(),
          toTimestamp: moment().set({hours: 23, minutes: 59, seconds: 59, milliseconds: 999}).unix(),
          selected: false
        },
        {
          display: 'Mañana',
          fromTimestamp: moment().add(1, 'days').set({hours: 0, minutes: 0, seconds: 0, milliseconds: 0}).unix(),
          toTimestamp: moment().add(1, 'days').set({hours: 23, minutes: 59, seconds: 59, milliseconds: 999}).unix(),
          selected: false
        }
      ]

      for (let x = 2; x <= 7; x++) {
        let dayAfterDay = moment().locale('es').add(x, 'days')
        dates.push({
          display: dayAfterDay.format('D MMMM'),
          fromTimestamp: dayAfterDay.set({hours: 0, minutes: 0, seconds: 0, milliseconds: 0}).unix(),
          toTimestamp: dayAfterDay.set({hours: 23, minutes: 59, seconds: 59, milliseconds: 999}).unix(),
          selected: false
        })
      }

      return dates
    }
  }
}
</script>
