export interface BasicMediaQueryList {
  readonly matches: boolean
  readonly media: string
}

export type MediaQuery = string
export type MediaQueryAlias = string
export interface MediaQueryBag {
  [alias: string]: MediaQuery
}
export type MediaQueryEntry = [MediaQueryAlias, MediaQuery]
export type MediaQueryListener = (mql: BasicMediaQueryList) => void
export interface MediaQueryMatches {
  [alias: string]: boolean
}
export type MediaQueryUnsubscribeFn = () => void

export interface Dictionary<T> {
  [key: string]: T
}

export type BoolDictionary = Dictionary<boolean>
