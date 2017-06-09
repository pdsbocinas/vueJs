<template>
  <div class="app">
    <!--<header class="navbar">
      <div class="container-fluid">
        <navbar></navbar>
      </div>
    </header>-->
    <main class="page">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import store from './vuex/store'

export default {
  components: {
    Navbar
  },
  store
}
</script>

/* Acá llamamos a los estilos globales */
<style src="./assets/styles/app.scss" lang="scss"></style>
