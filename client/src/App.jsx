import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import RouteSelection from './pages/RouteSelection';
import MapPage from './pages/MapPage';
import LandmarkDetail from './pages/LandmarkDetail';
import ARMode from './pages/ARMode';
import Admin from './pages/Admin';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><RouteSelection /></ProtectedRoute>} />
          <Route path="/map/:routeId" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
          <Route path="/landmark/:id" element={<ProtectedRoute><LandmarkDetail /></ProtectedRoute>} />
          <Route path="/ar/:id" element={<ProtectedRoute><ARMode /></ProtectedRoute>} />
          <Route path="/ar" element={<ProtectedRoute><ARMode /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}