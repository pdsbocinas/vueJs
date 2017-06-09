import Vue from 'vue'
import Grid from './views/Grid'
import Player from './views/Player'
import Error from './views/Error'

const routes = {
  '/itv/error': {
    component: Vue.component('error', Error),
    name: 'error'
  },
  '/itv/player/vivo/': {
    component: Vue.component('live-player', Player),
    name: 'live'
  },
  '/itv/player/vivo/:channelSlug': {
    component: Vue.component('live-player', Player),
    name: 'live-player'
  },
  '/itv/programacion/': {
    component: Vue.component('mama-grid', Grid),
    name: 'channel-grid'
  },
  '/itv/programacion/:channelSlug': {
    component: Vue.component('program-mama-grid', Grid),
    name: 'program-grid'
  },
  // para que funcione con el ambiente de desarrollo de symfony
  '/app_dev.php/itv/error': {
    component: Vue.component('error', Error),
    name: 'error-develop'
  },
  '/app_dev.php/itv/player/vivo/': {
    component: Vue.component('live-player', Player),
    name: 'live-develop'
  },
  '/app_dev.php/itv/player/vivo/:channelSlug': {
    component: Vue.component('live-player', Player),
    name: 'live-player-develop'
  },
  '/app_dev.php/itv/programacion/': {
    component: Vue.component('mama-grid', Grid),
    name: 'channel-grid-develop'
  },
  '/app_dev.php/itv/programacion/:channelSlug': {
    component: Vue.component('program-mama-grid', Grid),
    name: 'program-grid-develop'
  }
}

export default routes
