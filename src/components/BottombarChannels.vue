<style src="../assets/styles/layout/_bottombar-channels.scss" lang="scss"></style>

<template>
  <a class="trigger toggle-button"></a>
  <div class="bottombar-container" id="menu">
    <div class="bottombar-channel">
      <item-sidebar-channel v-for="item in sidebarData"
      :current-channel=getPlayingChannel :item=item v-on:slider-channel-click="changeChannel">
      </item-sidebar-channel>
    </div>
  </div>
</template>

<script>
import ItemSidebarChannel from './ItemSidebarChannel'
import { getPlayingChannel, isMobile } from '../vuex/getters'

export default {
  props: ['sidebarData'],
  components: {
    ItemSidebarChannel
  },
  data () {
    return {
      items: document.getElementsByClassName('channel-card')
    }
  },
  vuex: {
    getters: {
      getPlayingChannel,
      isMobile
    }
  },
  ready: function () {
    this.initialize()
  },
  computed: {
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
    changeChannel: function () {
      window.scrollTo(0, 0)
      this.$emit('change')
    },
    initialize: function (e) {
      this.mouseWheels = this.getCurrentPos
    }
  }
}
</script>
