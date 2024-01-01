export type AuthParams = {
  email: string,
  password: string
};

export type EventType = 'crosspromo' | 'liveops' | 'app' | 'ads'

export type UrlParams = {
  page: number,
  limit: number,
  sort: string,
  order: 'asc' | 'desc',
  name: string | null,
  desc: string | null,
  type: EventType | null,
  approved: boolean | null,
  priority: number | null,
}
