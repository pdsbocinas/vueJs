import Vuex from 'vuex'
import Vue from 'vue'
import * as MutationTypes from './mutation-types'

Vue.use(Vuex)

const state = {
  country: false,
  playerVersion: 0,
  logged: false,
  userInfo: {},
  fromTimestamp: 0,
  toTimestamp: 0,
  channels: {},
  lowerChannelNumber: 0,
  higherChannelNumber: 0,
  programs: [],
  playingChannel: {},
  playingUrl: '',
  videoPlayer: {},
  isMobile: false
}

// we can use the ES2015 computed property name feature
// to use a constant as the function name
// [CONSTANTE] y la función toma ese nombre
const mutations = {
  [MutationTypes.COUNTRY] (state, country) {
    state.country = country
  },
  [MutationTypes.PLAYER_VERSION] (state, playerVersion) {
    state.playerVersion = playerVersion
  },
  [MutationTypes.LOGIN_REQUEST] (state) {
  },
  [MutationTypes.LOGIN_OK] (state, loginResponse) {
    state.logged = true
    state.userInfo = loginResponse
  },
  [MutationTypes.LOGIN_FAIL] (state) {
    state.logged = false
    state.userInfo = {}
  },
  [MutationTypes.KEEP_ALIVE_OK] (state, keepAliveResponse) {
    state.logged = true
    state.userInfo.access_token = keepAliveResponse.access_token
  },
  [MutationTypes.KEEP_ALIVE_FAIL] (state) {
    state.logged = false
    state.userInfo = {}
  },
  [MutationTypes.SET_FROM_TIMESTAMP] (state, fromTimestamp) {
    state.fromTimestamp = fromTimestamp
  },
  [MutationTypes.SET_TO_TIMESTAMP] (state, toTimestamp) {
    state.toTimestamp = toTimestamp
  },
  [MutationTypes.CHANNELS_OK] (state, channels) {
    state.channels = channels
  },
  [MutationTypes.LOWER_CHANNEL] (state, lowerChannelNumber) {
    state.lowerChannelNumber = lowerChannelNumber
  },
  [MutationTypes.HIGHER_CHANNEL] (state, higherChannelNumber) {
    state.higherChannelNumber = higherChannelNumber
  },
  [MutationTypes.CHANNELS_FAIL] (state) {
    state.channels = []
  },
  [MutationTypes.PROGRAMS_OK] (state, programs) {
    state.programs = programs
  },
  [MutationTypes.PROGRAMS_FAIL] (state) {
    state.programs = []
  },
  [MutationTypes.PROGRAM_REMINDER] (state, idTransmission, reminded) {
    state.programs.filter(program => {
      return program.id === idTransmission
    })[0].reminded = reminded
  },
  [MutationTypes.CHANGE_PLAYER_CHANNEL] (state, channel) {
    state.playingChannel = channel
  },
  [MutationTypes.CHANGE_PLAYER_URL] (state, url) {
    state.playingUrl = url
  },
  [MutationTypes.SET_VIDEO_PLAYER] (state, player) {
    state.videoPlayer = player
  },
  [MutationTypes.IS_MOBILE] (state, isMobile) {
    state.isMobile = isMobile
  }
}

export default new Vuex.Store({
  state,
  mutations
})
