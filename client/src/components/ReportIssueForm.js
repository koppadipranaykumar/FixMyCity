import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import './ReportIssueForm.css';
import L from 'leaflet';

// Set default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

// Marker component for selecting location
const LocationSelector = ({ marker, setMarker }) => {
  useMapEvents({
    click(e) {
      setMarker(e.latlng);
    }
  });

  return marker ? <Marker position={marker} /> : null;
};

const ReportIssueForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [marker, setMarker] = useState({ lat: 20.5937, lng: 78.9629 });
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch address from coordinates
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${marker.lat}&lon=${marker.lng}`
        );
        const data = await response.json();
        setAddress(data.display_name || 'Address not found');
      } catch (err) {
        setAddress('Unable to fetch address');
      }
    };

    fetchAddress();
  }, [marker]);

  // Search location from address
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMarker({ lat, lng: lon });
      } else {
        alert('Location not found');
      }
    } catch (err) {
      alert('Search failed');
    }
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

   const formData = new FormData();
formData.append('title', title);
formData.append('description', description);
formData.append('location', address);
formData.append('lat', marker.lat);
formData.append('lng', marker.lng);
if (photo) {
  formData.append('photo', photo);
}

if (onSubmit) {
  onSubmit(formData);
}

    
  };

  return (
    <div className="report-wrapper">
      <form className="report-form" onSubmit={handleSubmit}>
        {/* Left Panel */}
        <div className="form-left">
          <h2>Report an Issue</h2>

          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Upload Photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              required
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Location (Auto-filled):</label>
            <textarea
              value={address}
              disabled
              placeholder="Location will appear here..."
            />
          </div>

          <div className="form-actions">
            <div className="button-row">
              <button type="submit" className="submit-btn">Submit Issue</button>
              <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="form-right">
          <h4>Pin Location:</h4>

          <div className="form-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search address..."
              style={{
                marginBottom: '10px',
                padding: '10px',
                borderRadius: '8px'
              }}
            />
            <button
              type="button"
              onClick={handleSearch}
              style={{
                padding: '6px 10px',
                fontSize: '0.9rem',
                borderRadius: '6px',
                marginTop: '6px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                width: 'fit-content',
                alignSelf: 'flex-start'
              }}
            >
              Search
            </button>
          </div>

          <div className="map-container">
            <MapContainer
              center={[marker.lat, marker.lng]}
              zoom={5}
              scrollWheelZoom={true}
              className="leaflet-map"
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationSelector marker={marker} setMarker={setMarker} />
            </MapContainer>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportIssueForm;
