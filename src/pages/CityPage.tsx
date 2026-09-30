import { Link, Navigate, useParams } from 'react-router-dom'
import { locationsForCity, noteExcerpt, useJournalStore } from '../store'

export default function CityPage() {
  const { cityId } = useParams()
  const cities = useJournalStore((state) => state.cities)
  const locations = useJournalStore((state) => state.locations)
  const deleteLocation = useJournalStore((state) => state.deleteLocation)

  const city = cities.find((item) => item.id === cityId)
  if (!cityId || !city) {
    return <Navigate to="/" replace />
  }

  const cityLocations = locationsForCity(locations, cityId)

  return (
    <section className="stack">
      <Link className="back-link" to="/">
        ← All cities
      </Link>
      <div className="page-head">
        <div>
          <h2>{city.name}</h2>
          <p className="lede">{city.country || 'Locations and notes from this trip.'}</p>
        </div>
        <Link className="button" to={`/city/${cityId}/locations/new`}>
          Add location
        </Link>
      </div>

      {cityLocations.length === 0 ? (
        <p className="empty">No locations in {city.name} yet. Add a café, trail, or street you want to remember.</p>
      ) : (
        <div className="city-list">
          {cityLocations.map((location) => (
            <article className="location-card" key={location.id}>
              <div>
                <h3>{location.title}</h3>
                <p className="muted">{location.streetAddress || 'No street address'}</p>
                {location.url ? (
                  <p>
                    <a href={location.url} target="_blank" rel="noreferrer">
                      {location.url}
                    </a>
                  </p>
                ) : null}
                {location.lat !== null && location.lng !== null ? (
                  <p className="muted">
                    Pin: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                ) : (
                  <p className="muted">No map coordinates</p>
                )}
                {location.notes ? <p className="notes">{noteExcerpt(location.notes, 220)}</p> : null}
              </div>
              <div className="actions">
                <Link className="button secondary" to={`/city/${cityId}/locations/${location.id}/edit`}>
                  Edit
                </Link>
                <button
                  type="button"
                  className="danger"
                  onClick={() => {
                    if (window.confirm(`Delete ${location.title}?`)) {
                      deleteLocation(location.id)
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
