# Heritage Route Digital Guide Platform

Web-based interactive guide for heritage routes with AR-style storytelling, QR scanning, GPS-triggered content, multimedia and multilingual (English/Hindi) narratives.

**Live:** https://heritage-route-guide-three.vercel.app |  **API:** https://heritage-route-guide-iq0w.onrender.com

## Features
- Register/login (JWT), role-based access (user/admin)
- Route selection and interactive map (Leaflet + OpenStreetMap)
- Landmark pages: description, images, audio, video, 3D model, animated timeline, historical figure quote
- AR mode: camera overlay with 3D model-viewer and story, QR scan, GPS proximity trigger
- Favorites, visited landmarks, ratings
- Admin panel: add/edit/delete routes and landmarks, upload media, generate QR codes, analytics
- Offline caching of visited content (service worker)

## Tech Stack
React (Vite), React Router, Leaflet, model-viewer, html5-qrcode, Node.js, Express, MongoDB (Mongoose), JWT, Cloudinary, Render, Vercel

## Local Setup
```bash
git clone https://github.com/<your-username>/heritage-route-guide.git
cd heritage-route-guide/server && npm install && npm run seed && npm run dev
cd ../client && npm install && npm run dev
```
Env files: see `server/.env` and `client/.env` below.

**server/.env**: PORT, MONGO_URI, JWT_SECRET, CLIENT_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
**client/.env**: VITE_API_URL

## Demo Accounts
Admin: admin@heritage.com / admin123 (change after seeding in production)

## Folder Structure
See docs/TECHNICAL_DOCUMENTATION.md