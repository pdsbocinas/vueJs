<template>
  <div class="container-fluid">
      <div class="content">
        <div class="title">
          <h3>Programación <span v-if="isProgram">{{ currentChannelName }}</span></h3>
          <a v-if="isProgram" v-link="{name: 'channel-grid'}">Cambiar canal</a>
        </div>
        <div v-if="isProgram" class="sidebar sidebar-left">
          <menu-dates :channel-slug=currentChannel.slug></menu-dates>
        </div>
        <div class="main">
          <grid-container :cards=getGridContent :is-program=isProgram :channel-slug=currentChannel.slug></grid-container>
        </div>
        <modal :show.sync="showModal"></modal>
        <player v-on:video-loaded="playBackground" v-if="(true === isProgram and false === isMobile)"
        controls="false"
        style="z-index: -1;"></player>
      </div>
  </div>
</template>

<script type="text/javascript">
import GridContainer from '../components/GridContainer'
import MenuDates from '../components/MenuDates'
import Modal from '../components/Modal'
import Player from '../components/Player'
import { fetchChannels, fetchPrograms, fetchReminders, setPlayingChannel } from '../vuex/actions'
import { isMobile } from '../vuex/getters'
import Moment from 'moment'

export default {
  components: {
    MenuDates,
    Modal,
    GridContainer,
    Player
  },
  data () {
    return {
      channelSlug: '',
      isProgram: false,
      channels: [],
      gridContent: [],
      currentChannel: {}
    }
  },
  vuex: {
    getters: {
      isMobile,
      fromTimestamp (state) {
        return state.fromTimestamp
      },
      toTimestamp (state) {
        return state.toTimestamp
      },
      getChannels (state) {
        return state.channels
      },
      getPrograms (state) {
        return state.programs
      },
      getLastChannel (state) {
        return state.userInfo.channel
      }
    },
    actions: {
      fetchChannels,
      fetchPrograms,
      fetchReminders,
      setPlayingChannel
    }
  },
  computed: {
    currentChannelName () {
      // Si no tenemos currentChannel buscamos el último que estaba viendo el usuario.
      if (!this.currentChannel.name) {
        this.getChannels.forEach((channel) => {
          if (this.getLastChannel === channel.number) {
            this.currentChannel = channel
            return
          }
        })
      }

      // Si no se tiene currentChannel tomamos el primero disponible
      if (!this.currentChannel.name) {
        this.currentChannel = this.getChannels[0]
      }

      this.setPlayingChannel(this.currentChannel)

      return this.currentChannel.name.charAt(0) + this.currentChannel.name.toLowerCase().slice(1)
    },
    getGridContent () {
      if (this.isProgram) {
        return this.getPrograms.filter(transmission => {
          return Moment(transmission.start).add(transmission.minutes, 'minutes').unix() >= Moment().unix()
        })
      } else {
        return this.getChannels
      }
    }
  },
  methods: {
    playBackground: function () {
      if (window.videojs(document.querySelector('.video-js'))) {
        window.videojs(document.querySelector('.video-js')).controlBar.addClass('hidden')
      }
      this.$broadcast('playTune')
    }
  },
  route: {
    data ({to: {params: { channelSlug }}}) {
      // Seteo valores por defecto
      this.isProgram = false
      this.channelSlug = ''
      this.gridContent = []
      this.currentChannel = {}

      // Traigo los canales
      return this.fetchChannels()
        .then(resp => {
          this.channels = resp.data
          // Si me viene el slug del canal, es porque quiere ver los programas de dicho canal
          if (channelSlug !== undefined) {
            this.channelSlug = channelSlug
            this.isProgram = true
            // CurrentChannel (el seleccionado)
            this.currentChannel = this.channels.find(current => {
              return current.slug === this.channelSlug
            })
            return this.fetchPrograms(this.currentChannel, this.fromTimestamp, this.toTimestamp)
              .then(program => {
                // Los programas que contenga la grilla solo van a ser:
                // 1. El que está en vivo
                // 2. Los demás hasta las 00
                // this.gridContent = program.data[0].Transmissions.filter(transmission => {
                //  return Moment(transmission.start).add(transmission.minutes, 'minutes').unix() >= Moment().unix()
                // })
              })
          }
        })
    }
  },
  events: {
    showModal: function (program) {
      this.$broadcast('showModal', program)
      return true
    }
  }
}
</script>
