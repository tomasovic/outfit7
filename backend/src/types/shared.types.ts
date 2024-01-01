export enum EventType {
  CrossPromo = 'crosspromo',
  LiveOps = 'liveops',
  App = 'app',
  Ads = 'ads',
}

export enum AdsType {
  Pass = 'sure, why not!',
  NoPass = 'you shall not pass!',
}

export interface IQuery {
  page: number
  limit: number
  sort: 'asc' | 'desc'
  order: string
  approved: boolean
  name: string
  type: string
  priority: number
  desc: string
  skip: number
}
