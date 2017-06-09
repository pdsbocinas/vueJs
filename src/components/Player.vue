<template>
  <div id="video-container"></div>
</template>

<script>
  import { getTune, setVideoPlayer } from '../vuex/actions'
  import { getPlayingChannel, getPlayerUrl, getCountry, getUserInfo, getPlayerVersion } from '../vuex/getters'
  import helpers from '../common/utils'

  export default {
    vuex: {
      actions: {
        getTune,
        setVideoPlayer
      },
      getters: {
        getPlayingChannel,
        getPlayerUrl,
        getCountry,
        getPlayerVersion,
        getUserInfo,
        getVideoPlayer (state) {
          return state.videoPlayer
        }
      }
    },

    beforeCompile () {
      if (document.querySelector('.video-js') && typeof window.videojs(document.querySelector('.video-js')) === 'object') {
        // window.videojs(document.querySelector('.video-js')).dispose()
      }
    },

    ready: function () {
      this.loadPlayerSource()
    },

    events: {
      playTune: function () {
        this.playChannel()
      },
      hideControlBar: function () {
        if (this.getVideoPlayer && typeof this.getVideoPlayer === 'object') {
          this.getVideoPlayer.controlBar.hide()
        }
      },
      showControlBar: function () {
        if (this.getVideoPlayer && typeof this.getVideoPlayer === 'object') {
          this.getVideoPlayer.controlBar.show()
        }
      }
    },

    methods: {
      playChannel: function () {
        try {
          let numberChannel = this.getUserInfo.channel
          if (this.getPlayingChannel.number) {
            numberChannel = this.getPlayingChannel.number
          }
          this.getTune(numberChannel)
            .then(response => {
              window.QbPlayers.liveSrc(this.getVideoPlayer, this.getPlayerUrl)
              this.getVideoPlayer.removeClass('hidden')
            })
            .catch(err => {
              console.log(err)
            })
        } catch (error) {
          console.log(error)
        }
      },

      loadPlayerSource: function () {
        // Cargamos los estilos del player
        helpers.external({type: 'style', source: process.application.PLAYER_CSS.replace('{version}', this.getPlayerVersion)})
        helpers.external({type: 'style', source: process.application.PLAYER_QUBIT_CSS.replace('{version}', this.getPlayerVersion)})
        // Cargamos los scripts del player, es necesario cargar primero el player y después youbora.
        const script = helpers.external({type: 'script', source: process.application.PLAYER_JS.replace('{version}', this.getPlayerVersion)})
        script.onload = () => {
          helpers.external({ type: 'script', source: process.application.YOUBORA }).onload = () => {
            // Le digo al objeto de vue, que este es el player, asi tengo la referencia en VUE
            let content = {
              src: process.application.CHANNEL_DEFAULT,
              container: '#video-container',
              language: 'es',
              callbacks: {
                setPlayer: this.setVideoPlayer,
                backOneMin: function backOneMin () {
                  console.log('back one min')
                },
                forwardOneMin: function forwardOneMin () {
                  console.log('fwd one min')
                },
                goToProgramStart: function goToProgramStart () {
                  console.log('go to program start')
                },
                goToLive: function goToLive () {
                  console.log('go to live')
                }
              }
            }
            window.QbPlayers.live(content)
            this.loadEvents()
            this.$dispatch('video-loaded')
            this.getVideoPlayer.on('error', function () {
              this.addClass('hidden')
            })
          }
        }
      },

      loadEvents: function () {
        var vueContext = this
        this.getVideoPlayer.on('pause', function (e) {
          vueContext.$dispatch('video-pause')
        })
        this.getVideoPlayer.on('play', function (e) {
          vueContext.$dispatch('video-play')
        })
        this.getVideoPlayer.on('loadstart', function (e) {
          vueContext.$dispatch('video-loadstart')
        })
        this.getVideoPlayer.on('enterFullScreen', function (e) {
          vueContext.$dispatch('video-enterfullscreen')
        })
        this.getVideoPlayer.on('exitFullScreen', function (e) {
          vueContext.$dispatch('video-exitfullscreen')
        })
      }
    }
  }
</script>
