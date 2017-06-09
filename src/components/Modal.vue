<template>
  <div class="modal-mask {{ cssClass }}" v-show="show" transition="modal">
    <div class="modal-wrapper">
      <div class="modal-container">
        <button class="modal-close-top-button" @click="show = false">X</button>
        <div class="bg-program" v-if="backgroundImage" v-bind:style="{ 'background-image': 'url(' + backgroundImage + ')' }"></div>
        <div class="bg-icon" v-if="responseIcon">
          {{{ responseIcon }}}
        </div>
        <div class="modal-body">
          <h3>{{{ title }}}</h3>
          <div>{{{ body }}}</div>
          <slot name="footer">
            <button class="modal-default-button"
              @click="onClick">
              {{ buttonText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import { setReminder, deleteReminder } from './../vuex/actions'
  const SET = 'SET_REMINDER'
  const DELETE = 'DELETE_REMINDER'
  const SUCCESS = 'SUCCESS'

  export default {
    props: {
      show: {
        type: Boolean,
        required: true,
        twoWay: true
      }
    },
    data () {
      return {
        title: 'Modal title',
        body: 'Default body',
        buttonText: 'Text button',
        cssClass: '',
        action: SET,
        idTransmission: 0,
        backgroundImage: '',
        responseIcon: ''
      }
    },
    vuex: {
      actions: {
        setReminder,
        deleteReminder
      }
    },
    methods: {
      onClick: function (event) {
        if (this.action === SET) {
          this.setReminder(this.idTransmission).then(
            response => {
              if (response === true) {
                this.action = SUCCESS
                this.title = '¡Recordatorio creado!'
                this.body = this.body + '<span>Recibirás un email 10 minutos antes de que <br>comience el programa</span>'
                this.backgroundImage = false
                this.responseIcon = '<img src="//st.qubit.tv/assets/public/qubit/qubit-ar/staging/itv/images/check.svg" width="100%" height="auto"/>'
              }
            }
          ).catch(
            error => {
              console.log(error)
            }
          )
        }

        if (this.action === DELETE) {
          this.deleteReminder(this.idTransmission).then(
            response => {
              if (response === true) {
                this.action = SUCCESS
                this.title = '¡Recordatorio eliminado!'
                this.body = this.body + '<span>El recordatorio se ha eliminado correctamente</span>'
                this.backgroundImage = false
                this.responseIcon = '<img src="//st.qubit.tv/assets/public/qubit/qubit-ar/staging/itv/images/check.svg" width="64" height="64"/>'
              }
            }
          ).catch(
            error => {
              console.log(error)
            }
          )
        }
        if (this.action === SUCCESS) {
          this.image = this.body + '<div class="box-image"></div>'
          this.show = false
          this.action = SET
        }

        this.buttonText = 'Aceptar'
        this.cssClass = 'confirm-modal success'
      }
    },
    events: {
      showModal: function (program) {
        this.show = true
        this.title = (program.reminded === false) ? 'Crear recordatorio para' : 'Eliminar recordatorio para'
        this.body = '<p>' + program.Program.mainTitle + '</p><p class="hour">' + program.formatedHour + 'hs</p>'
        this.buttonText = (program.reminded === false) ? 'Crear recordatorio' : 'Eliminar recordatorio'
        this.action = (program.reminded === true) ? DELETE : SET
        this.idTransmission = program.id
        this.backgroundImage = program.cdnImage
        this.responseIcon = ''
        this.cssClass = ''
      }
    }
  }
</script>
<style src="../assets/styles/components/_modal.scss" lang="scss"></style>
