var template = `<transition name="sw-update-popup">
<div
  class="sw-update-popup" :class=""
>
  New content is available.<br>
  <button @click="reload">Refresh</button>
</div>
</transition>`;
var popUpComponent = Vue.extend({
    template,
    data() {
        return {
            updateEvent: null
        }
    },
      computed: {
        enabled () {
          return this.updateEvent
        }
      },
      methods: {
        reload () {
          if (this.updateEvent) {
            this.updateEvent.skipWaiting().then(() => {
              location.reload(true)
            })
            this.updateEvent = null
          }
        },
        onSWUpdated(e) {
            this.updateEvent = e
        }
      },
      created() {
        this.$on('sw-updated', this.onSWUpdated)
      }
    }
);