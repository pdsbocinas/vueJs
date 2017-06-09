<template>
  <div id="player" class="player">
    <sidebar-channels v-if="!isMobile" :sidebar-data=getChannels :time-out=timeOut v-on:change="playChannel"></sidebar-channels>
    <player
      v-on:video-loaded="initialize"
      v-on:video-pause="onVideoPause"
      v-on:video-play="onVideoPlay"
      v-on:video-loadstart="onVideoLoadStart"
      v-gesture:swipeLeft="changeChannelSwipping($event, 'swipeLeft')"
      v-gesture:swipeRight="changeChannelSwipping($event, 'swipeRight')"
      v-gesture:tap="showControlBar">
    </player>
    <Slideout menu="#menu" panel="#video-container" :toggle-selectors="['.toggle-button']" @on-open="open"></Slideout>
    <bottombar-channels v-if="isMobile" :sidebar-data=getChannels v-on:change="playChannel"></bottombar-channels>
    <div id="navtutor" class="navtutor">
      <div class="left">
        <i class="material-icons material-arrows">arrow_upward</i>
        <i class="material-icons material-arrows">arrow_downward</i>
      </div>
      <div class="right">
        <p>Utilizá las flechas para cambiar el canal</p>
      </div>
    </div>
    <div id="navtutor-mobile" class="navtutor-mobile">
      <img src="//st.qubit.tv/assets/public/qubit/qubit-ar/staging/itv/images/swipe-mobile.png" width="100%" height="auto"/>
    </div>
  </div>
</template>

<script>
import Moment from 'moment'
import Slideout from '../components/Slideout'
import SidebarChannels from '../components/SidebarChannels'
import BottombarChannels from '../components/BottombarChannels'
import Player from '../components/Player'
import { fetchChannels, setPlayingChannel } from '../vuex/actions'
import { getPlayingChannel, getUserInfo, getVideoPlayer, getPlayerUrl, isMobile } from '../vuex/getters'

export default {
  components: {
    SidebarChannels,
    BottombarChannels,
    Player,
    Slideout
  },
  data () {
    return {
      functionTimeOut: null,
      timeOut: 3000,
      helpRows: true
    }
  },
  vuex: {
    actions: {
      fetchChannels,
      setPlayingChannel
    },
    getters: {
      getPlayingChannel,
      getUserInfo,
      getVideoPlayer,
      getPlayerUrl,
      isMobile,
      getChannels (state) {
        return state.channels
      },
      getLowerChannel (state) {
        return state.lowerChannelNumber
      },
      getHigherChannel (state) {
        return state.higherChannelNumber
      }
    }
  },
  created () {
    window.addEventListener('keyup', this.changeChannelWithKeys)
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.changeChannelWithKeys)
  },
  computed: {
    titleTransmition: function () {
      var title = ''
      if (this.getPlayingChannel.name) {
        title = this.capitalizeFirstLetter(this.getPlayingChannel.name) + ' - ' + this.getPlayingChannel.actualTransmission.Program.mainTitle
      }
      return title
    },
    startHour: function () {
      let program = this.getPlayingChannel.actualTransmission
      if (program) {
        let startMoment = Moment(program.start)
        return Moment(startMoment).format('HH:mm')
      }
    },
    finishHour: function () {
      let program = this.getPlayingChannel.actualTransmission
      if (program) {
        let finishMoment = Moment(program.start).add(program.minutes, 'minutes')
        return Moment(finishMoment).format('HH:mm')
      }
    }
  },
  methods: {
    open: function () {
      console.log('Abro el coso')
    },
    capitalizeFirstLetter: function (string) {
      string = string.toLowerCase()
      return string.charAt(0).toUpperCase() + string.slice(1)
    },

    playChannel: function () {
      this.$broadcast('playTune')
    },

    hideControlBar: function () {
      this.$broadcast('hideControlBar')
    },

    showControlBar: function () {
      this.$broadcast('showControlBar')
    },

    initialize: function () {
      if (window.hasOwnProperty('videojs') === false) {
        return
      }
      let controlBar = window.videojs(document.querySelector('.video-js')).controlBar
      if (this.isMobile === false) { // si es null NO es mobile
        controlBar.forwardOneMinButton.disable()
        controlBar.backOneMinButton.disable()
        controlBar.goToLive.disable()
        controlBar.goToStartButton.disable()
      } else {
        controlBar.forwardOneMinButton.hide()
        controlBar.backOneMinButton.hide()
        controlBar.goToLive.hide()
        controlBar.goToStartButton.hide()
      }
      controlBar.liveDisplay.hide()
      controlBar.durationDisplay.hide()
      controlBar.progressControl.hide()
      controlBar.currentTimeDisplay.hide()
      this.addTitle()
      this.playChannel()
      this.show()
    },

    addTitle: function () {
      if (!document.querySelector('.title-bar')) {
        var controlBarDom = document.querySelector('.vjs-control-bar')
        var titleBarDom = document.createElement('div')
        var h4Dom = document.createElement('h4')
        titleBarDom.classList.add('title-bar')
        titleBarDom.appendChild(h4Dom)
        controlBarDom.appendChild(titleBarDom)
      }
      document.querySelector('.title-bar h4').textContent = this.titleTransmition
    },

    // Oculta ayuda para navegación con teclas "flechas".
    hide: function () {
      if (document.querySelector('.navtutor')) {
        document.querySelector('.navtutor').classList.add('out')
        this.helpRows = false
      }
      if (document.querySelector('.navtutor-mobile')) {
        document.querySelector('.navtutor-mobile').classList.add('out')
        this.helpRows = false
      }
    },

    // Visualiza ayuda para navegación con teclas "flechas".
    show: function () {
      if (this.helpRows === true) {
        if (document.querySelector('.navtutor')) {
          document.querySelector('.navtutor').classList.remove('out')
          clearTimeout(this.functionTimeOut)
          this.functionTimeOut = setTimeout(this.hide, this.timeOut)
        }
        if (document.querySelector('.navtutor-mobile')) {
          document.querySelector('.navtutor-mobile').classList.remove('out')
          clearTimeout(this.functionTimeOut)
          this.functionTimeOut = setTimeout(this.hide, this.timeOut)
        }
      }
    },

    goDown (currentChannelNumber) {
      let previousChannelIndex = this.getChannelIndex(currentChannelNumber, 'previous')
      let previousChannel = this.getChannels[previousChannelIndex]
      // Si tengo un canal previo y además, no es el mismo que el actual, hago el cambio de canal
      if (previousChannel !== undefined && previousChannel !== this.getPlayingChannel) {
        this.changeChannel(previousChannel)
        this.$broadcast('mouseWheelsDown')
      }
    },

    goUp (currentChannelNumber) {
      let nextChannelIndex = this.getChannelIndex(currentChannelNumber, 'next')
      let nextChannel = this.getChannels[nextChannelIndex]
      // Si tengo un canal siguiente y además, no es el mismo que el actual, hago el cambio de canal
      if (nextChannel !== undefined && nextChannel !== this.getPlayingChannel) {
        this.changeChannel(nextChannel)
        this.$broadcast('mouseWheelsUp')
      }
    },

    changeChannelSwipping (event, target) {
      let currentChannelNumber = this.getPlayingChannel.number

      if (target === 'swipeLeft') {
        this.goDown(currentChannelNumber)
      }

      if (target === 'swipeRight') {
        this.goUp(currentChannelNumber)
      }
    },

    changeChannelWithKeys (event) {
      let currentChannelNumber = this.getPlayingChannel.number

      if (event.keyCode === 38) {
        this.goDown(currentChannelNumber)
      }

      if (event.keyCode === 40) {
        this.goUp(currentChannelNumber)
      }
    },

    getChannelIndex (currentChannelNumber, action) {
      let currentChannelIndex = this.getChannels.findIndex(channel => {
        return channel.number === currentChannelNumber
      })

      // Sino lo encontro en el array, devuelvo por defecto el primer elemento
      if (currentChannelIndex === -1) {
        return 0
      }

      // Si quiere volver para atrás
      if (action === 'previous') {
        // No puede ir más abajo que el 0
        if (currentChannelIndex === 0) {
          return this.getChannels.length - 1
        }

        return currentChannelIndex - 1
      }

      // Si quiere subir de canal
      if (action === 'next') {
        // No puede ir más allá del último elemento del array
        if (currentChannelIndex === this.getChannels.length - 1) {
          return 0
        }

        return currentChannelIndex + 1
      }
    },
    changeChannel (channel) {
      this.setPlayingChannel(channel)
      this.playChannel()
    },

    onVideoLoadStart: function () {
      this.$broadcast('videoLoadStart')
    },

    onVideoPlay: function () {
      window.history.replaceState({}, 'itv - ' + this.titleTransmition, this.$router.stringifyPath({name: this.$route.name, params: { channelSlug: this.getPlayingChannel.slug }}))
      this.addTitle()

      let content = {
        accountCode: 'qubit',
        username: this.getUserInfo.username,
        media: {
          title: this.titleTransmition,
          resource: this.getPlayerUrl,
          isLive: true
        },
        extraParam: {
          param1: 'itv-ar' // va a cambiar segun el pais que use itv
        }
      }

      this.getVideoPlayer.youbora(content)
      this.$broadcast('videoPlay')
    },

    onVideoPause () {
      this.$broadcast('videoPause')
    }
  },
  route: {
    data ({to}) {
      // Voy a buscar los canales, ya sea a la API o al Store
      return this.fetchChannels()
        .then(resp => {
          let playingChannel = resp.data.find(current => {
            return current.slug === to.params.channelSlug
          })

          if (playingChannel === undefined) {
            playingChannel = resp.data.find(current => {
              return current.number === this.getUserInfo.channel
            })
          }
          // Cargo los elementos necesarios para el player
          // Me guardo en el store el playing Channel actual
          this.setPlayingChannel(playingChannel)
          return true
        })
    }
  }
}
</script>
