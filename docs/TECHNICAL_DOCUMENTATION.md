# Technical Documentation

## Architecture
React SPA (Vercel) → REST API (Express on Render) → MongoDB Atlas. Media is stored on Cloudinary. A service worker caches route/landmark API responses and images/audio.

## Folder Structure
```
server/  config/ middleware/ models/ routes/ seed.js server.js
client/  src/{components,context,pages,utils} public/sw.js
```

## Database Schema
- **User**: name, email, password (hash), role, language, visited[], favorites[]
- **Route**: name, city, description, image
- **Landmark**: route, name, qrCode, description{en,hi}, lat, lng, images[], audioUrl{en,hi}, videoUrl, modelUrl, timeline[{year,event}], character{name,quote}, order
- **Interaction**: user, sessionId, landmark, route, type(view|ar|qr), duration
- **Rating**: user, landmark, stars(1-5), comment (unique per user+landmark)

## REST API
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | public | Register |
| POST | /api/auth/login | public | Login |
| GET | /api/auth/me | user | Current user |
| PUT | /api/auth/language | user | Set language |
| POST | /api/auth/favorites/:id | user | Toggle favorite |
| GET | /api/routes | public | List routes |
| GET | /api/routes/:id | public | Route + landmarks |
| POST/DELETE | /api/routes, /api/routes/:id | admin | Create/delete route |
| GET | /api/landmarks/:id | public | Landmark detail |
| GET | /api/landmarks/qr/:code | public | Landmark by QR |
| POST | /api/landmarks/:id/visit | user | Mark visited |
| POST/PUT/DELETE | /api/landmarks(/:id) | admin | Manage landmarks |
| POST | /api/ratings | user | Rate landmark |
| GET | /api/ratings/:landmarkId | user | Average + own rating |
| POST | /api/analytics/track | public | Log interaction |
| GET | /api/analytics/summary | admin | KPIs |
| POST | /api/upload | admin | Upload media to Cloudinary |

## AR Implementation
- Camera: `getUserMedia` (rear camera) video background with story overlay
- 3D: Google `<model-viewer>` with WebXR/Scene Viewer/Quick Look AR on supported devices
- QR: html5-qrcode scans a landmark code and opens its AR view
- GPS: `watchPosition` + haversine distance; within 200 m shows an "Unlock AR story" prompt

## Security
bcrypt password hashing, JWT (7d), role-based middleware, helmet, auth rate limiting, CORS restricted to CLIENT_URL, upload limit 50 MB admin-only.

## Deployment
MongoDB Atlas, Render (server), Vercel (client), Cloudinary (media). Env vars are listed in the README.

## Test Cases
| # | Scenario | Expected |
|---|----------|----------|
| 1 | Register new user | Redirected to routes page |
| 2 | Login with wrong password | Error message |
| 3 | Open /admin as normal user | Redirected to home |
| 4 | Select route | Map with markers and polyline |
| 5 | Simulate location at a landmark | "Unlock AR story" banner appears |
| 6 | Open landmark | Description, timeline, 3D model load |
| 7 | Switch language to Hindi | Description changes |
| 8 | Scan QR `HR-REDFORT` | Opens AR view for Red Fort |
| 9 | Rate landmark | Average updates |
| 10 | Admin adds/edits/deletes landmark | List updates |
| 11 | Admin uploads image/audio/model | URL filled in form |
| 12 | Admin analytics | KPIs show after usage |
| 13 | Go offline after visiting a page | Page content still loads |