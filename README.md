# Travel journal

A personal, client-only web app for cities you have visited, places in those cities, and freeform notes. There is no backend, database, or account system. Everything lives in the browser.

## Local commands

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

`npm run build` writes a static site to `dist/`.

## How persistence works

All cities and locations live in one [Zustand](https://github.com/pmndrs/zustand) store. The `persist` middleware writes that store to `localStorage` under the key `travel-journal`. Clearing site data for this origin wipes the journal. The first visit seeds two example cities (Kyoto with two locations, Lisbon empty). At least one seed location includes coordinates so the map is not empty.

Optional “Use my location” on a location form calls the browser Geolocation API only in the client. It is never required and never sent to a server.

## Deploy on Vercel (Hobby)

1. Push this repo to GitHub.
2. In Vercel, import the project.
3. Framework preset: **Vite**.
4. Output directory: **dist** (Vite default).
5. Build command: `npm run build`.

This app is a single-page React Router site. `vercel.json` rewrites unknown paths to `index.html` so routes like `/city/:cityId` and `/map` work on refresh.

There is also a `Dockerfile` that builds the Vite app and serves `dist` with nginx. Vercel Hobby will not use it; it is only for local or other container hosts.

```bash
docker build -t travel-journal .
docker run --rm -p 8080:80 travel-journal
```

## OpenStreetMap tiles

The map uses public OpenStreetMap raster tiles via Leaflet. That is acceptable for **personal, low-volume** use. Do not point a heavy public production load at `tile.openstreetmap.org`. See [OSM tile usage policy](https://operations.osmfoundation.org/policies/tiles/).

## License

MIT. See [LICENSE](LICENSE).
