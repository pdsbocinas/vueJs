import { getCountry } from '../vuex/getters'
import store from '../vuex/store'

const helpers = {
  getCookie (name) {
    let value = '; ' + document.cookie
    let parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  },
  getChannelLogoPath (logoName) {
    return `${process.application[getCountry(store.state)].CDN_URL + process.application.CHANNEL_LOGOS_PATH + logoName}`
  },
  getProgramLogoPath (logoName) {
    if (logoName === undefined) {
      return `${process.application[getCountry(store.state)].CDN_URL + process.application.DEFAULT_PROGRAM_LOGO_NAME}`
    }

    return `${process.application[getCountry(store.state)].CDN_URL + process.application.PROGRAM_LOGOS_PATH + logoName}`
  },
  getTransmissionsPath (imgFile, resolve) {
    if (imgFile === undefined) {
      return `${process.application.DEFAULT_CDN_TRANSMISSION_BASE_URL + process.application.DEFAULT_PROGRAM_LOGO_NAME}`
    }

    return `${process.application.DEFAULT_CDN_TRANSMISSION_BASE_URL + imgFile}`
  },
  // Object { type: [style|script], source: [path-source] }
  external (externalSource) {
    if (!externalSource) return
    const head = document.querySelector('head')
    if (externalSource.type === 'script') {
      const script = document.createElement('script')
      script.src = externalSource.source
      head.appendChild(script)
      return script
    }

    if (externalSource.type === 'style') {
      const style = document.createElement('link')
      style.href = externalSource.source
      style.rel = 'stylesheet'
      style.type = 'text/css'
      head.appendChild(style)
      return style
    }
  },
  cookieDecode (cookie) {
    return JSON.parse(new Buffer(decodeURIComponent(cookie), 'base64').toString())
  }
}

export default helpers
