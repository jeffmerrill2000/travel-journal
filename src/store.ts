import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedCities, seedLocations, type City, type Location } from './types'

function createId(): string {
  return crypto.randomUUID()
}

type JournalState = {
  cities: City[]
  locations: Location[]
  addCity: (input: { name: string; country: string }) => string
  updateCity: (id: string, input: { name: string; country: string }) => void
  deleteCity: (id: string) => void
  addLocation: (input: Omit<Location, 'id'>) => string
  updateLocation: (id: string, input: Omit<Location, 'id' | 'cityId'>) => void
  deleteLocation: (id: string) => void
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      cities: seedCities,
      locations: seedLocations,

      addCity: ({ name, country }) => {
        const id = createId()
        set((state) => ({
          cities: [...state.cities, { id, name: name.trim(), country: country.trim() }],
        }))
        return id
      },

      updateCity: (id, { name, country }) => {
        set((state) => ({
          cities: state.cities.map((city) =>
            city.id === id ? { ...city, name: name.trim(), country: country.trim() } : city,
          ),
        }))
      },

      deleteCity: (id) => {
        set((state) => ({
          cities: state.cities.filter((city) => city.id !== id),
          locations: state.locations.filter((location) => location.cityId !== id),
        }))
      },

      addLocation: (input) => {
        const id = createId()
        set((state) => ({
          locations: [...state.locations, { ...input, id, title: input.title.trim() }],
        }))
        return id
      },

      updateLocation: (id, input) => {
        set((state) => ({
          locations: state.locations.map((location) =>
            location.id === id
              ? { ...location, ...input, title: input.title.trim() }
              : location,
          ),
        }))
      },

      deleteLocation: (id) => {
        set((state) => ({
          locations: state.locations.filter((location) => location.id !== id),
        }))
      },
    }),
    { name: 'travel-journal' },
  ),
)

export function locationsForCity(locations: Location[], cityId: string): Location[] {
  return locations.filter((location) => location.cityId === cityId)
}

export function mappedLocations(locations: Location[]): Location[] {
  return locations.filter(
    (location) => location.lat !== null && location.lng !== null,
  )
}

export function noteExcerpt(notes: string, max = 140): string {
  const trimmed = notes.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max).trimEnd()}…`
}
