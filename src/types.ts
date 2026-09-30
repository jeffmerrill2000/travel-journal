export type City = {
  id: string
  name: string
  country: string
}

export type Location = {
  id: string
  cityId: string
  title: string
  streetAddress: string
  url: string
  lat: number | null
  lng: number | null
  notes: string
}

export const KYOTO_ID = 'city-kyoto'
export const LISBON_ID = 'city-lisbon'

export const seedCities: City[] = [
  { id: KYOTO_ID, name: 'Kyoto', country: 'Japan' },
  { id: LISBON_ID, name: 'Lisbon', country: 'Portugal' },
]

export const seedLocations: Location[] = [
  {
    id: 'loc-fushimi-inari',
    cityId: KYOTO_ID,
    title: 'Fushimi Inari Taisha',
    streetAddress: '68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto',
    url: 'https://inari.jp/en/',
    lat: 34.9671,
    lng: 135.7727,
    notes:
      'Walked the lower torii tunnels at dusk. Crowds thinned after the first few hundred gates. Fox statues everywhere — bring a flashlight if you go higher up the mountain after sunset.',
  },
  {
    id: 'loc-nishiki',
    cityId: KYOTO_ID,
    title: 'Nishiki Market',
    streetAddress: 'Nakagyo Ward, Kyoto',
    url: '',
    lat: null,
    lng: null,
    notes:
      'Pickled vegetables, grilled mochi, and a stall with yuzu kosho worth buying to take home. Go earlier in the day — it gets shoulder-to-shoulder by lunch.',
  },
]
