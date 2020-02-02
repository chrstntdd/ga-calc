import {
  MediaQuery,
  MediaQueryListener,
  MediaQueryUnsubscribeFn
} from "./types"

/**
 * Since the older `addListener` API is deprecated,
 * but Safari does not support the current standard
 * which inherits from EventTarget, we must perform
 * a check to see if `addEventListener` is available.
 */
let useFallback = false
;(canUseDom => {
  if (!canUseDom) return

  const mql = window.matchMedia("(min-width: 1px)")
  useFallback = typeof mql.addEventListener !== "function"
})(typeof window !== "undefined")

/**
 * SubscribeToMediaQuery takes a MediaQueryString and callback
 * to be called when the media query state changes.
 * The callback will be invoked immediately to ascertain initial state.
 * An unsubscribe function is returned.
 */
export function addMediaQueryListener(
  query: MediaQuery,
  listener: MediaQueryListener
): MediaQueryUnsubscribeFn {
  const mql = window.matchMedia(query)

  if (useFallback) {
    mql.addListener(listener)
  } else {
    mql.addEventListener("change", listener)
  }

  // Trigger initial state since mql fires onchange.
  listener(mql)

  return () => {
    if (useFallback) {
      mql.removeListener(listener)
    } else {
      mql.removeEventListener("change", listener)
    }
  }
}
