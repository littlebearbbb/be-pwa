
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js')
if (workbox) {
  workbox.core.setCacheNameDetails({
    prefix: 'html-demo',
    suffix: 'v0.0.1'
  })
  workbox.core.skipWaiting()
  workbox.core.clientsClaim()

  workbox.precaching.precacheAndRoute(self.__precacheManifest || [])

  workbox.routing.registerRoute(
    /.*.css/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'css-cache'
    })
  )

  workbox.routing.registerRoute(
    /.*.js/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'js-cache'
    })
  )

  workbox.routing.registerRoute(
    /.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 设置缓存有效期为30天
        })
      ]
    })
  )
}
