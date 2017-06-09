<template>
 <div class="card channel-card" v-bind:class="{ active: isActive }">
  <div class="box-image">
    <div v-if="isMobile" class="bg-gray"></div>
    <img :src="cdnImage" alt="{{ camelizedTitle }}">
  </div>
  <a v-on:click=sliderChannelClick>
    <div class="card-info">
      <div class="card-title">{{ camelizedTitle }}</div>
    </div>
  </a>
  <div v-if="!isMobile" class="channel-card-info">
    <span>Ahora</span>
    <h4>{{ titleActual }}</h4>
    <span>después</span> {{ titleUpcoming }}
  </div>
  <div v-else class="channel-card-info-mobile">
      <h4>{{ titleActual }}</h4>
      <span>después {{ titleUpcoming }}</span> 
  </div>
  </div>
</template>
<script>
import Utils from '../common/utils'
import { setPlayingChannel } from '../vuex/actions'
import { getPlayingChannel, isMobile } from '../vuex/getters'
export default {
  props: ['item', 'currentChannel'],
  vuex: {
    actions: {
      setPlayingChannel
    },
    getters: {
      getPlayingChannel,
      isMobile
    }
  },
  computed: {
    camelizedTitle () {
      return this.item.name.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      })
    },
    cdnImage () {
      // Por defecto es un canal
      let imgPath = Utils.getChannelLogoPath(this.item.logo)
      return imgPath
    },
    titleActual () {
      return (this.item.actualTransmission) ? this.item.actualTransmission.Program.mainTitle : ''
    },
    titleUpcoming () {
      return (this.item.upcomingTransmission) ? this.item.upcomingTransmission.Program.mainTitle : ''
    },
    isActive: function () {
      return this.currentChannel === this.item
    }
  },
  methods: {
    transformRoute (route) {
      return process.env.NODE_ENV === 'development' ? route + '-develop' : route
    },
    sliderChannelClick () {
      if (this.getPlayingChannel.id !== this.item.id) {
        this.setPlayingChannel(this.item)
        this.$emit('slider-channel-click')
      }
    }
  }
}
</script>
