<template>
  <div class="container-fluid">
      <div class="content text-center">
        <p>Se produjo un error al acceder a la aplicación, por favor intenta nuevamente en unos minutos.</p>
        <p>Código de error: {{ errorCode }}</p>
        <p>
          Mensaje: {{ errorMessage }}
        </p>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      errorCode: '',
      errorMessage: ''
    }
  },
  route: {
    data (transition) {
      this.errorCode = transition.to.query.code
      this.errorMessage = transition.to.query.msg
    }
  }
}
</script>
