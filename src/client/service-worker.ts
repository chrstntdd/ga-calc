/* A version number is useful when updating the worker logic,
   allowing you to remove outdated cache entries during the update.
*/
let version = preval`
let git = require('git-rev-sync');
module.exports = git.branch() + "--" + git.short();
`

/**
 * @description
 * This array is replaced at build time to include the
 * versioned JS assets as well.
 */
let offlineFundamentals = ["./"]

addEventListener("install", event => {
  event.waitUntil(
    /* The caches built-in is a promise-based API that helps you cache responses,
       as well as finding and deleting them.
    */
    caches
      /* You can open a cache by name, and this method returns a promise. We use
         a versioned cache name here so that we can remove old cache entries in
         one fell swoop later, when phasing out an older service worker.
      */
      .open(version)
      .then(cache => cache.addAll(offlineFundamentals))
  )
})

addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response

      return (
        fetch(event.request)
          // Add fetched files to the cache
          .then(response => {
            // TODO 5 - Respond with custom 404 page
            return caches.open(version).then(cache => {
              cache.put(event.request.url, response.clone())
              return response
            })
          })
      )
    })
  )
})

addEventListener("activate", event => {
  event.waitUntil(
    // We return a promise that settles when all outdated caches are deleted.
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => !key.startsWith(version))
          .map(key => caches.delete(key))
      )
    })
  )
})
