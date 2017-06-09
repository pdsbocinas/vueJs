<template>
    <!-- Si el elemento .card se encuentra en la grilla de programas,
    le agrego la clase .tv-show -->
    <div v-bind:class="[{ 'card-program': !isProgram }, 'card tv-show']"
     :style="{ 'background-image': 'url(' + cdnImagesTv + ')' }">
      <div v-bind:class="[{ 'tv-show': isProgram }]"
        :style="{ 'background-image': 'url(' + cdnImage + ')' }"
        :id="card.id">
          <div class="reminder" v-if="card.reminded"></div>
          <a v-on:click="playButton">
              <div class="card-info">
                <div class="card-title">{{ programTitle }}</div>
                <div class="card-hour">{{ formatedHour }}</div>
              </div>

              <div class="channel-info" v-if="!isProgram">
                <div class="card-title">{{ actualProgram }}</div>
                <div class="card-hour">Ahora</div>
              </div>
          </a>
      </div>
    </div>
</template>

<script>
import Utils from '../common/utils'
import Moment from 'moment'

export default {
  props: ['card', 'isProgram', 'channelSlug'],
  computed: {
    actualProgram () {
      if (!this.isProgram) {
        return this.card.actualTransmission.Program.mainTitle
      }
    },
    cdnImagesTv () {
      let imgPathTv = Utils.getProgramLogoPath()
      return imgPathTv
    },
    cdnImage () {
      // Por defecto es un canal
      let imgPath = Utils.getChannelLogoPath(this.card.logo)

      if (this.isProgram) {
        imgPath = Utils.getProgramLogoPath() // sin parámetro me devuelve el televisorcito

        // Tengo que ajustar esto... ?
        if (this.card.Program.Images.length > 0) {
          imgPath = Utils.getTransmissionsPath(this.card.Program.Images[Math.floor(Math.random() * this.card.Program.Images.length)].file)
        }
      }

      return imgPath
    },
    formatedHour () {
      if (this.isProgram) {
        let startMoment = Moment(this.card.start)
        let finishMoment = Moment(this.card.start).add(this.card.minutes, 'minutes')

        return Moment().isBetween(startMoment, finishMoment, null, '[]') ? 'Ahora' : Moment(this.card.start).format('HH:mm')
      }
    },
    programTitle () {
      return this.isProgram ? this.card.Program.mainTitle : this.card.name
    }
  },
  methods: {
    transformRoute (route) {
      return process.env.NODE_ENV === 'development' ? route + '-develop' : route
    },
    playButton: function () {
      var showModal = (this.isProgram && this.formatedHour !== 'Ahora')
      if (showModal === true) {
        var program = this.card
        program.formatedHour = this.formatedHour
        program.cdnImage = this.cdnImage
        this.$dispatch('showModal', program)
      } else {
        this.$router.go(this.getLink())
      }
    },
    getLink: function () {
      return (this.isProgram)
      ? {name: this.transformRoute('live-player'), params: { channelSlug: this.channelSlug }}
      : {name: this.transformRoute('program-grid'), params: { channelSlug: this.card.slug }}
    }
  }
}
</script>

<style src="../assets/styles/components/_card.scss" lang="scss"></style>
