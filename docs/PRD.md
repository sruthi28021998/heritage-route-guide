# Product Requirements Document: Heritage Route Digital Guide Platform

## 1. Overview
A web-based interactive guide that lets tourists explore heritage routes on their phones with AR-style storytelling, maps, multimedia and multilingual content.

## 2. Problem Statement
Static boards and brochures limit engagement; language barriers; no centralized digital storytelling platform; AR underused in cultural education.

## 3. Goals
Primary: digital route maps, AR storytelling at landmarks, interactive timelines, immersive content, accessible cultural information.
Secondary: multilingual storytelling, offline access, digital content archive, local tourism promotion, engagement analytics.

## 4. Users
- Tourist: explores routes, unlocks stories, rates experience.
- Admin: manages routes, landmarks, media; monitors analytics.

## 5. Scope (Phase 1)
In: auth, route map, landmark stories, camera/QR/GPS-triggered AR content, multimedia, admin CMS, analytics.
Out: wearable AR, full VR, government database integration, ticketing.

## 6. Functional Requirements
| ID | Requirement |
|----|-------------|
| FR1 | User registers/logs in securely |
| FR2 | User selects a heritage route |
| FR3 | Interactive map shows landmarks and route |
| FR4 | Landmark page shows images, audio, video, 3D model, timeline |
| FR5 | AR mode with camera overlay; QR scan opens landmark content |
| FR6 | GPS proximity (200 m) prompts to unlock story |
| FR7 | User can favorite landmarks and rate them (1-5) |
| FR8 | Language switch (English/Hindi) |
| FR9 | Admin CRUD for routes and landmarks, media upload, QR generation |
| FR10 | Analytics: visitors per route, most viewed landmarks, AR interactions, session duration, satisfaction |

## 7. Non-Functional Requirements
Mobile-responsive, fast loading, secure auth (bcrypt, JWT, helmet, rate limiting), scalable cloud storage, multilingual, offline caching.

## 8. KPIs
Active users, AR interaction rate, average session duration, popular routes, user satisfaction rating.

## 9. Assumptions and Constraints
Users have camera-enabled smartphones and internet; heritage content is accurate and responsibly sourced; AR performance varies by device; media storage is heavy; content authenticity needs validation.

## 10. Future Enhancements
VR tours, treasure-hunt mode, AI recommendations, full offline AR, ticketing integration, social sharing.