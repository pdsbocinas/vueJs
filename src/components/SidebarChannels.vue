<style src="../assets/styles/layout/_sidebar-channels.scss" lang="scss"></style>

<template>
  <div v-bind:class="[ {'sidebar-carrousel': carrouselActive }, 'sidebar-channel in' ]">
    <item-sidebar-channel v-for="item in sidebarDataAvailable"
    :current-channel=getPlayingChannel :item=item v-on:slider-channel-click="mouseWheelReset"></item-sidebar-channel>
  </div>
</template>

<script>
import ItemSidebarChannel from './ItemSidebarChannel'
import { getPlayingChannel } from '../vuex/getters'
const VISIBLE = 'VISIBLE'
const PAUSE = 'PAUSE'
const HIDE = 'HIDE'

export default {
  props: ['sidebarData', 'timeOut'],
  components: {
    ItemSidebarChannel
  },
  data () {
    return {
      statusMenu: HIDE,
      functionTimeOut: null,
      items: document.getElementsByClassName('channel-card'),
      visibleItems: 3,
      mouseWheels: false,
      displacement: 0
    }
  },
  vuex: {
    getters: {
      getPlayingChannel
    }
  },
  ready: function () {
    this.initialize()
    // Agregamos el evento que muestra el sidebar
    window.addEventListener('mousemove', this.show)
    window.addEventListener('mousewheel', this.moveMenu)
    document.querySelector('.sidebar-channel').addEventListener('mouseout', this.continue)
    document.querySelector('.sidebar-channel').addEventListener('mouseover', this.standBy)
  },
  beforeDestroy () {
    // Eliminamos eventos que ya se esten escuchando
    window.removeEventListener('mousemove', this.show)
    window.removeEventListener('mousewheel', this.moveMenu)
    window.removeEventListener('resize', this.initialize)
    document.querySelector('.sidebar-channel').removeEventListener('mouseover', this.standBy)
    document.querySelector('.sidebar-channel').removeEventListener('mouseout', this.continue)
  },
  events: {
    mouseWheelsDown: function () {
      this.mouseWheels--
      this.displacement = 0
    },
    mouseWheelsUp: function () {
      this.mouseWheels++
      this.displacement = 0
    },
    videoPause: function (e) {
      this.show()
    },
    videoPlay: function (e) {
      this.show()
    },
    videoLoadStart: function () {
      this.show()
    }
  },
  computed: {
    carrouselActive: function () {
      return this.sidebarData.length >= 7
    },
    getCurrentPos: function () {
      var position = 0
      if (this.sidebarData.length) {
        for (var key = 0; key < this.sidebarData.length; key++) {
          if (this.sidebarData[key] === this.getPlayingChannel) {
            position = key - 2
            if (position < 0) {
              position = 0
            }
            break
          }
        }
      }
      return position
    },
    sidebarDataAvailable: function () {
      // Definimos las variables a usar
      var channelCurrentPos = 0
      var carrouselLenght = 7 // Debe ser un número impar para que el canal actual se encuentre en el centro.
      var padding = (carrouselLenght - 1) / 2
      var items = []

      if (this.carrouselActive === false) {
        items = this.sidebarData
      }

      if (this.carrouselActive === true) {
        // Obtenemos la posición del canal actual.
        var currentChannel = this.getPlayingChannel
        this.sidebarData.forEach(function (channel, key) {
          if (channel === currentChannel) {
            channelCurrentPos = key
          }
        })

        // Con base a la posición obtenemos el punto de inicio.
        var key = channelCurrentPos - padding + this.displacement
        if (key < 0) {
          key = this.sidebarData.length + key
        }
        if (key > this.sidebarData.length) {
          key = key - this.sidebarData.length
        }

        // Agregamos los canales al carrousel
        while (items.length < carrouselLenght && key < (this.sidebarData.length + padding)) {
          var channel = this.getChannel(key)
          if (channel) {
            items.push(channel)
          }

          key++
          // Si llegamos al final del array continuamos en el inicio
          if (key >= this.sidebarData.length) {
            key = 0
          }
        }
      }

      return items
    }
  },
  methods: {
    getChannel: function (index) {
      var channel = false
      if (this.sidebarData[index]) {
        channel = this.sidebarData[index]
      }
      return channel
    },

    mouseWheelReset: function () {
      this.displacement = 0
      this.mouseWheels = 0
      this.$emit('change')
    },

    moveMenu: function (e) {
      // Si no es visible el sidebar no ejecuta la acción
      if (this.statusMenu === HIDE) {
        return
      }

      if (this.sidebarData.length < 7) {
        return
      }

      // wheelDelta viene en 120 si sube y -120 si baja
      if (e.wheelDelta > 0) {
        this.mouseWheels++
      }
      if (e.wheelDelta < 0) {
        this.mouseWheels--
      }

      if (this.mouseWheels <= 0) {
        this.mouseWheels = this.sidebarData.length
      }

      if (this.mouseWheels > this.sidebarData.length) {
        this.mouseWheels = 1
      }

      this.displacement = this.mouseWheels - 1
      if (this.mouseWheels !== Math.ceil(this.sidebarData.length / 2)) {
        if (this.mouseWheels > 0 && this.mouseWheels < Math.ceil(this.sidebarData.length / 2)) {
          this.displacement = this.mouseWheels * -1
        }
        if (this.mouseWheels > Math.ceil(this.sidebarData.length / 2)) {
          this.displacement = Math.abs(this.mouseWheels - this.sidebarData.length)
        }
      }

      this.show()
    },

    initialize: function (e) {
      this.mouseWheels = this.getCurrentPos
      this.statusMenu = VISIBLE
    },

    hide: function () {
      if (this.statusMenu === VISIBLE) {
        if (document.querySelector('.sidebar-channel')) {
          if (document.querySelector('.sidebar-channel').classList.contains('in') === true) {
            document.querySelector('.sidebar-channel').classList.remove('in')
            this.statusMenu = HIDE
          }
        }
        clearTimeout(this.functionTimeOut)
        this.functionTimeOut = null
      }
      this.$parent.hideControlBar()
    },

    show: function () {
      if (document.querySelector('.sidebar-channel')) {
        if (document.querySelector('.sidebar-channel').classList.contains('in') === false) {
          document.querySelector('.sidebar-channel').classList.add('in')
          this.statusMenu = VISIBLE
        }

        if (this.statusMenu !== PAUSE) {
          clearTimeout(this.functionTimeOut)
          this.functionTimeOut = setTimeout(this.hide, this.timeOut)
        }
      }
      if (document.querySelector('.video-js') && typeof document.querySelector('.video-js') === 'object') {
        window.videojs(document.querySelector('.video-js')).controlBar.show()
      }
    },

    standBy: function () {
      clearTimeout(this.functionTimeOut)
      this.functionTimeOut = null
      this.statusMenu = PAUSE
    },

    continue: function () {
      this.statusMenu = VISIBLE
    }
  }
}
</script>
