var merge = require('webpack-merge')
var common = require('./common.env')

module.exports = merge(common, {
  AR: {
    ITV_API_URL: '"http://itvapi.qubit.tv/api/v2/"',
    CDN_URL: '"//st.qubit.tv/assets/public/qubit/qubit-ar/staging/itv/images/"',
  },
  CO: {
    ITV_API_URL: '"http://itvapico.qubit.tv/api/v2/"',
    CDN_URL: '"//st.qubit.tv/assets/public/qubit/qubit-co/staging/itv/images/"',
  }
})
