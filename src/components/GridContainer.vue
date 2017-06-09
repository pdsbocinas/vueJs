<template>
    <div class="grid-container">
        <card v-for="card in cards" :card=card :is-program=isProgram :channel-slug=channelSlug></card>
    </div>
</template>

<script>
  import Card from './Card'
  export default {
    props: ['cards', 'isProgram', 'channelSlug'],
    components: { Card }
  }
</script>

<style src="../assets/styles/layout/_grid.scss" lang="scss"></style>
