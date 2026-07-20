import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock Cinema Data
const initialCinemas = [
  { id: 1, name: "Downtown IMAX", lat: -36.8485, lng: 174.7633, city: "Auckland", price: 21, hasCandyBar: true },
  { id: 2, name: "Metro Cinema Complex", lat: -36.8530, lng: 174.7600, city: "Auckland", price: 18, hasCandyBar: true },
  { id: 3, name: "Harbour View Theatre", lat: -41.2865, lng: 174.7762, city: "Wellington", price: 22, hasCandyBar: false },
  { id: 4, name: "Civic Centre Cinemas", lat: -43.5321, lng: 172.6362, city: "Christchurch", price: 17, hasCandyBar: true },
];

// Define Geographic Bounding Box Restrictions (New Zealand Bounds Example)
const NZ_BOUNDS = [
  [-47.5, 166.0], // Southwest coordinate
  [-34.0, 179.0]  // Northeast coordinate
];

// Custom component to handle map movement (Fixes the Snapping Bug)
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default App;
function App() {
  const [cinemas] = useState(initialCinemas);
  const [filteredCinemas, setFilteredCinemas] = useState(initialCinemas);
  const [mapCenter, setMapCenter] = useState([-36.8485, 174.7633]); // Default to Auckland
  const [selectedCinema, setSelectedCinema] = useState(null);
  
  // Filter and Sort States
  const [sortBy, setSortBy] = useState('name');
  const [filterCandyBar, setFilterCandyBar] = useState(false);

  // Apply Filters and Sorting
  useEffect(() => {
    let result = [...cinemas];

    if (filterCandyBar) {
      result = result.filter(c => c.hasCandyBar);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredCinemas(result);
  }, [sortBy, filterCandyBar, cinemas]);

  // Handle snapping behavior when clicking list item
  const handleCinemaSelect = (cinema) => {
    setSelectedCinema(cinema);
    setMapCenter([cinema.lat, cinema.lng]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar Control Panel */}
      <div style={{ width: '350px', padding: '20px', backgroundColor: '#f4f4f4', overflowY: 'auto', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', zIndex: 1000 }}>
        <h2>🎬 Cinema Finder</h2>
        
        {/* Feature Request: Filtering & Sorting Controls */}
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: '100%', padding: '6px', marginBottom: '12px' }}>
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Ticket Price: Low to High</option>
            <option value="price-high">Ticket Price: High to Low</option>
          </select>

          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={filterCandyBar} 
              onChange={(e) => setFilterCandyBar(e.target.checked)} 
              style={{ marginRight: '8px' }} 
            />
            Has Candy Bar 🍿
          </label>
        </div>

        {/* Cinema List View */}
        <h3>Available Cinemas ({filteredCinemas.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredCinemas.map((cinema) => (
            <div 
              key={cinema.id}
              onClick={() => handleCinemaSelect(cinema)}
              style={{
                padding: '12px',
                backgroundColor: selectedCinema?.id === cinema.id ? '#e0f7fa' : '#fff',
                border: selectedCinema?.id === cinema.id ? '2px solid #00acc1' : '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <h4 style={{ margin: '0 0 5px 0' }}>{cinema.name}</h4>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>📍 {cinema.city}</p>
              <div style={{ display: 'flex', justifyContent: 'between', fontSize: '12px', color: '#444' }}>
                <span>🎟️ ${cinema.price}</span>
                <span style={{ marginLeft: 'auto' }}>{cinema.hasCandyBar ? '🍿 Available' : '❌ No Snacks'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map View Frame (Fixes Bounding Constraints) */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          maxBounds={NZ_BOUNDS} // Implements Bounding Restrictions
          maxBoundsViscosity={1.0} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Synchronizes map camera movement updates */}
          <MapController center={mapCenter} />

          {filteredCinemas.map((cinema) => (
            <Marker 
              key={cinema.id} 
              position={[cinema.lat, cinema.lng]}
              eventHandlers={{
                click: () => handleCinemaSelect(cinema)
              }}
            >
              <Popup>
                <strong>{cinema.name}</strong><br />
                Ticket: ${cinema.price}<br />
                {cinema.hasCandyBar ? '🍿 Snacking Available' : 'No Candy Bar'}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
