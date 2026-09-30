import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { locationsForCity, useJournalStore } from '../store'

export default function CityListPage() {
  const cities = useJournalStore((state) => state.cities)
  const locations = useJournalStore((state) => state.locations)
  const addCity = useJournalStore((state) => state.addCity)
  const updateCity = useJournalStore((state) => state.updateCity)
  const deleteCity = useJournalStore((state) => state.deleteCity)

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCountry, setEditCountry] = useState('')

  function onAdd(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    addCity({ name, country })
    setName('')
    setCountry('')
  }

  function startEdit(cityId: string, currentName: string, currentCountry: string) {
    setEditingId(cityId)
    setEditName(currentName)
    setEditCountry(currentCountry)
  }

  function onSaveEdit(event: FormEvent) {
    event.preventDefault()
    if (!editingId || !editName.trim()) return
    updateCity(editingId, { name: editName, country: editCountry })
    setEditingId(null)
  }

  return (
    <section className="stack">
      <div className="page-head">
        <div>
          <h2>Cities visited</h2>
          <p className="lede">A short list of places you have been. Open a city to add streets, notes, and map pins.</p>
        </div>
      </div>

      <form className="panel stack" onSubmit={onAdd}>
        <h3>Add a city</h3>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="city-name">City name</label>
            <input
              id="city-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Kyoto"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="city-country">Country (optional)</label>
            <input
              id="city-country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              placeholder="Japan"
            />
          </div>
        </div>
        <div>
          <button type="submit">Add city</button>
        </div>
      </form>

      {cities.length === 0 ? (
        <p className="empty">No cities yet. Add one above.</p>
      ) : (
        <div className="city-list">
          {cities.map((city) => {
            const count = locationsForCity(locations, city.id).length
            const isEditing = editingId === city.id
            return (
              <article className="city-card" key={city.id}>
                {isEditing ? (
                  <form className="stack" onSubmit={onSaveEdit}>
                    <div className="grid-2">
                      <div className="field">
                        <label htmlFor={`edit-name-${city.id}`}>City name</label>
                        <input
                          id={`edit-name-${city.id}`}
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          required
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`edit-country-${city.id}`}>Country</label>
                        <input
                          id={`edit-country-${city.id}`}
                          value={editCountry}
                          onChange={(event) => setEditCountry(event.target.value)}
                        />
                      </div>
                    </div>
                    <div className="actions">
                      <button type="submit">Save</button>
                      <button type="button" className="secondary" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <Link className="city-link" to={`/city/${city.id}`}>
                      <h3>{city.name}</h3>
                      <p className="muted">
                        {city.country ? `${city.country} · ` : ''}
                        {count} {count === 1 ? 'location' : 'locations'}
                      </p>
                    </Link>
                    <div className="actions">
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => startEdit(city.id, city.name, city.country)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => {
                          if (window.confirm(`Delete ${city.name} and its locations?`)) {
                            deleteCity(city.id)
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
