<template>
  <div class="menu-links">
    <a v-link="{name: transformRoute('live-player'), params: {channelSlug: 'telefe'}}">Ahora</a>
    <a v-link="{name: transformRoute('channel-grid')}">Programación</a>
    <a href="http://qubit.tv">Películas</a>
  </div>
</template>

<script type="text/javascript">
export default {
  methods: {
    transformRoute (route) {
      return process.env.NODE_ENV === 'development' ? route + '-develop' : route
    }
  }
}
</script>

/* Y acá llamamos a otro que pisa y hereda de common */
<style src="../assets/styles/components/_navbar.scss" lang="scss"></style>
