import App from './App'
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueGesture from 'vue-gesture'
import routes from './routes'
import store from './vuex/store'
import helpers from './common/utils'
import { doLogin, keepAlive, setCountry, setIsMobile, setPlayerVersion } from './vuex/actions'
import MobileDetect from 'mobile-detect'

// Le digo a vue que vamos a utilizar el router
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueGesture)

const router = new VueRouter({
  history: true
})

// let iQubitPlayerCookie = helpers.getCookie('iQubitPlayer')
let iQubitPlayerCookie = 'eyJDb3VudHJ5IjoiQVIiLCJWZXJzaW9uIjoiMS45LjcifQ%3D%3D'

let iTvPlayer = false
if (iQubitPlayerCookie) {
  iTvPlayer = helpers.cookieDecode(iQubitPlayerCookie)
}

let country = iTvPlayer.Country
let playerVersion = iTvPlayer.Version
if (process.country !== false) {
  country = process.country
}
setCountry(store, country)
setPlayerVersion(store, playerVersion)

router.map(routes)

// En cada transición de rutas, tenemos que verificar que el usuario esté logeado
router.beforeEach(transition => {
  // Detectamos si es un dispositivo Mobile
  let isMobile = false
  let md = new MobileDetect(navigator.userAgent)
  if (md.mobile() !== null) {
    isMobile = true
  }
  setIsMobile(store, isMobile)

  // Si está logeado, seguimos con la transición
  if (store.state.logged) {
    return transition.next()
  }
  // Sino está logeado, vamos a intentar logearlo
  // let cookie = helpers.getCookie('iQubit')
  let cookie = 'N4IgrgzgpgTgdgQwLZRALhABwguBjACygC8ABARzACMBLAFwDo6A3EAGhEtroFVoZ0dGGCgdMMAPYATMHjoR0AbRAARKADMEYADZ0AtAEEASiAC6HOhIDWUOOhABOAMwAOdU4BMANgcAGFwDsTsEALACMUL4OUlK%2BTuoeYVRQIXgxIeoBVO54vlIIHgFSIVQBYeohDuV4AKwOAXiBvuoOUE7lHnk1Ll5OXlAO6mEIcV4eLSGTHilQUF54Hk4OLg5UvghUeHhULmE17FiS6jTaqGigNFIACkcnZyBhAQ7eHgeYCDC2dAjaAMIScCEEm06BCHEQKHs2FwhBIIAAvvCgA%3D%3D'
  // // Si lo estabamos llevando a la pantalla de error, procedemos sin validar nada
  // Todavía no está implementado
  if (transition.to.name === 'error') {
    return transition.next()
  }

  return doLogin(store, cookie)
    .then(resp => {
      setInterval(() => {
        keepAlive(store)
      }, (resp.data.expire_in * 0.51) * 1000)
      return true
    })
    .catch(err => {
      return transition.redirect(`/error?code=${err.data.status}&msg=${err.data.message}`)
    })
})

router.redirect({
  '/': '/itv/programacion/'
})

router.start(App, '#app')
