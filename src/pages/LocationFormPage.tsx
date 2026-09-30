import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useJournalStore } from '../store'

type FormState = {
  title: string
  streetAddress: string
  url: string
  lat: string
  lng: string
  notes: string
}

function parseCoord(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const number = Number(trimmed)
  return Number.isFinite(number) ? number : null
}

export default function LocationFormPage() {
  const { cityId, locationId } = useParams()
  const navigate = useNavigate()
  const cities = useJournalStore((state) => state.cities)
  const locations = useJournalStore((state) => state.locations)
  const addLocation = useJournalStore((state) => state.addLocation)
  const updateLocation = useJournalStore((state) => state.updateLocation)

  const city = cities.find((item) => item.id === cityId)
  const existing = locations.find((item) => item.id === locationId)

  const initial = useMemo<FormState>(() => {
    if (existing) {
      return {
        title: existing.title,
        streetAddress: existing.streetAddress,
        url: existing.url,
        lat: existing.lat === null ? '' : String(existing.lat),
        lng: existing.lng === null ? '' : String(existing.lng),
        notes: existing.notes,
      }
    }
    return {
      title: '',
      streetAddress: '',
      url: '',
      lat: '',
      lng: '',
      notes: '',
    }
  }, [existing])

  const [form, setForm] = useState<FormState>(initial)
  const [geoMessage, setGeoMessage] = useState('')
  const [geoError, setGeoError] = useState('')

  if (!cityId || !city) {
    return <Navigate to="/" replace />
  }

  if (locationId && !existing) {
    return <Navigate to={`/city/${cityId}`} replace />
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function useMyLocation() {
    setGeoError('')
    setGeoMessage('')
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not available in this browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateField('lat', position.coords.latitude.toFixed(6))
        updateField('lng', position.coords.longitude.toFixed(6))
        setGeoMessage('Filled latitude and longitude from this device.')
      },
      () => {
        setGeoError('Could not read location. You can type coordinates instead.')
      },
    )
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!form.title.trim()) return
    const payload = {
      title: form.title,
      streetAddress: form.streetAddress.trim(),
      url: form.url.trim(),
      lat: parseCoord(form.lat),
      lng: parseCoord(form.lng),
      notes: form.notes,
    }
    if (!city) return
    if (existing) {
      updateLocation(existing.id, payload)
    } else {
      addLocation({ ...payload, cityId: city.id })
    }
    navigate(`/city/${city.id}`)
  }

  return (
    <section className="stack">
      <Link className="back-link" to={`/city/${cityId}`}>
        ← Back to {city.name}
      </Link>
      <div className="page-head">
        <div>
          <h2>{existing ? 'Edit location' : 'New location'}</h2>
          <p className="lede">Notes stay on this device. Coordinates are optional; they only matter for the map.</p>
        </div>
      </div>
      <form className="panel stack" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Neighborhood café"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="address">Street address</label>
          <input
            id="address"
            value={form.streetAddress}
            onChange={(event) => updateField('streetAddress', event.target.value)}
            placeholder="12 Rua Augusta"
          />
        </div>
        <div className="field">
          <label htmlFor="url">URL (optional)</label>
          <input
            id="url"
            type="url"
            value={form.url}
            onChange={(event) => updateField('url', event.target.value)}
            placeholder="https://"
          />
        </div>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="lat">Latitude (optional)</label>
            <input
              id="lat"
              inputMode="decimal"
              value={form.lat}
              onChange={(event) => updateField('lat', event.target.value)}
              placeholder="38.7223"
            />
          </div>
          <div className="field">
            <label htmlFor="lng">Longitude (optional)</label>
            <input
              id="lng"
              inputMode="decimal"
              value={form.lng}
              onChange={(event) => updateField('lng', event.target.value)}
              placeholder="-9.1393"
            />
          </div>
        </div>
        <div className="row">
          <button type="button" className="secondary" onClick={useMyLocation}>
            Use my location
          </button>
          {geoMessage ? <p className="geo-status">{geoMessage}</p> : null}
          {geoError ? <p className="error">{geoError}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="What you ate, how you got there, who you were with…"
          />
        </div>
        <div className="actions">
          <button type="submit">{existing ? 'Save changes' : 'Add location'}</button>
          <Link className="button secondary" to={`/city/${cityId}`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}
