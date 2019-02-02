<template>
  <transition name="sw-update-popup">
    <div
      v-if="enabled"
      class="sw-update-popup"
      @click="reload"
    >
      <p @click="reload">{{message}}</p>
      <a @click="reload">
        {{buttonText}}
      </a>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    updateEvent: {
      type: Object,
      default: null
    }
  },

  computed: {
    enabled () {
      return this.updateEvent
    },

    message () {
      return  'New content is available.'
    },

    buttonText () {
      return 'Refresh'
    }
  },

  methods: {
    reload () {
      if (this.updateEvent && this.enabled) {
        this.updateEvent.skipWaiting()
          .then(() => {
            console.log('Skip waiting succeeded')
            location.reload(true)
          })
          .catch(e => console.error(e))
        this.updateEvent = null
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/config.styl'

.sw-update-popup
  display flex
  position fixed
  left 0
  bottom 0
  padding 0.65em
  border none 
  border-radius 0px
  background $codeBgColor
  box-shadow 0 4px 16px rgba(0, 0, 0, 0.5)
  cursor pointer 
  min-width 100%

  p, a
    flex 1
    font-size 90%
    align-self center

  p
    color: #ffffff
    margin: 0 0
    padding-left: 0.2em
    white-space nowrap
    text-align left

  a
    text-align right
    padding-right 1.5em

// Tablet+
@media (min-width: 768px)
  .sw-update-popup
    border-radius 3px
    left initial
    min-width initial
    right 1em
    bottom 1em
    padding 1em

    text-align left
    border 1px solid $accentColor
  
    p, a
      font-size: 1em
      text-align left
    
    p
      margin 0,0
    
    a
      margin-left 0.5em
      padding-right initial

@media print 
  .sw-update-popup
    display none

.sw-update-popup-enter-active, .sw-update-popup-leave-active
  transition opacity 0.3s, transform 0.3s

.sw-update-popup-enter, .sw-update-popup-leave-to
  opacity 0
  transform translate(0, 50%) scale(0.5)
</style>