import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RouteSelection = lazy(() => import('./pages/RouteSelection'));
const MapPage = lazy(() => import('./pages/MapPage'));
const LandmarkDetail = lazy(() => import('./pages/LandmarkDetail'));
const ARMode = lazy(() => import('./pages/ARMode'));
const Journey = lazy(() => import('./pages/Journey'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><RouteSelection /></ProtectedRoute>} />
            <Route path="/map/:routeId" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/landmark/:id" element={<ProtectedRoute><LandmarkDetail /></ProtectedRoute>} />
            <Route path="/ar/:id" element={<ProtectedRoute><ARMode /></ProtectedRoute>} />
            <Route path="/ar" element={<ProtectedRoute><ARMode /></ProtectedRoute>} />
            <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}