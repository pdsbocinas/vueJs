<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
const Slideout = require('slideout')

export default {
  data () {
    return {
      slideout: null
    }
  },
  props: {
    panel: { default: '#panel' },
    menu: { default: '#menu' },
    toggleSelectors: {
      default: function () {
        return ['.toggle-button']
      }
    }
  },
  name: 'Slideout',
  ready () {
    this.slideout = new Slideout({
      panel: document.querySelector(this.panel),
      menu: document.querySelector(this.menu),
      side: 'right',
      easing: 'ease-in-out'
    })
    this.toggleSelectors.forEach(selector => {
      document.querySelector(selector).addEventListener('click', () => {
        this.slideout.toggle()
      })
    })
  }
}
</script>

<style media="screen">
  .slideout-menu {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 256px;
    height: 100vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    z-index: 0;
    display: none;
    background-color: #1D1F20;
    color: white;
  }
  .slideout-menu-left {
    left: 0;
  }
  .slideout-menu-right {
    right: 0;
  }
  .slideout-panel {
    background-color: #4B5;
    color: white;
    position: relative;
    z-index: 1;
    will-change: transform;
    min-height: 100vh;
  }
  .slideout-open,
  .slideout-open body,
  .slideout-open .slideout-panel {
    overflow: hidden;
  }
  .slideout-open .slideout-menu {
    display: block;
  }
</style>
