// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AuthContainer from './components/AuthContainer';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route path="/dashboard*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
