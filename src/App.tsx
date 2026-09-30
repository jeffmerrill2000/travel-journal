import { NavLink, Route, Routes } from 'react-router-dom'
import CityListPage from './pages/CityListPage'
import CityPage from './pages/CityPage'
import LocationFormPage from './pages/LocationFormPage'
import MapPage from './pages/MapPage'

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ✈
          </span>
          <div>
            <p className="brand-kicker">Personal notes</p>
            <h1>Travel journal</h1>
          </div>
        </div>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>
            Cities
          </NavLink>
          <NavLink to="/map">Map</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<CityListPage />} />
          <Route path="/city/:cityId" element={<CityPage />} />
          <Route path="/city/:cityId/locations/new" element={<LocationFormPage />} />
          <Route path="/city/:cityId/locations/:locationId/edit" element={<LocationFormPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </main>
    </div>
  )
}
