import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { mappedLocations, noteExcerpt, useJournalStore } from '../store'
import { Link } from 'react-router-dom'

const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

export default function MapPage() {
  const cities = useJournalStore((state) => state.cities)
  const locations = useJournalStore((state) => state.locations)
  const pins = mappedLocations(locations)

  const center: [number, number] =
    pins[0] && pins[0].lat !== null && pins[0].lng !== null
      ? [pins[0].lat, pins[0].lng]
      : [34.9671, 135.7727]

  return (
    <section className="stack">
      <div className="page-head">
        <div>
          <h2>Map</h2>
          <p className="lede">
            Pins appear only for locations with latitude and longitude. Map tiles are from OpenStreetMap.
          </p>
        </div>
      </div>
      {pins.length === 0 ? (
        <p className="empty">No mapped locations yet. Add lat/lng on a location to drop a pin.</p>
      ) : (
        <div className="map-wrap">
          <MapContainer center={center} zoom={6} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pins.map((location) => {
              const city = cities.find((item) => item.id === location.cityId)
              return (
                <Marker key={location.id} position={[location.lat as number, location.lng as number]}>
                  <Popup>
                    <p className="popup-title">{location.title}</p>
                    {city ? (
                      <p className="muted">
                        {city.name}
                        {city.country ? `, ${city.country}` : ''}
                      </p>
                    ) : null}
                    {location.notes ? <p className="popup-notes">{noteExcerpt(location.notes)}</p> : null}
                    {city ? (
                      <p>
                        <Link to={`/city/${city.id}/locations/${location.id}/edit`}>Open notes</Link>
                      </p>
                    ) : null}
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      )}
    </section>
  )
}
