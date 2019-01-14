export default class SWUpdateEvent {
    constructor (registration) {
      Object.defineProperty(this, 'registration', {
        value: registration,
        configurable: true,
        writable: true
      })
    }
  
    /**
     * Check if the new service worker exists or not.
     */
    update () {
      return this.registration.update()
    }
  
    /**
     * Activate new service worker to work 'location.reload()' with new data.
     */
    skipWaiting () {
      const worker = this.registration.waiting
      if (!worker) {
      console.error('No waiting service worker')
        return Promise.resolve()
      }
      console.log('[sw] Doing worker.skipWaiting().')
      console.log(worker);

      return new Promise((resolve, reject) => {
        const channel = new MessageChannel()
        console.log(channel);
        
        channel.port1.onmessage = (event) => {
          console.log('[sw] Done worker.skipWaiting().')
          if (event.data.error) {
            reject(event.data.error)
          } else {
            resolve(event.data)
          }
        }
        
        console.log('Sending skip-waiting message');
        worker.postMessage({ type: 'skip-waiting' }, [channel.port2])
      })
    }
  }