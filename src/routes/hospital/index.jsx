import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import './Hospital.css';

const HospitalFinder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js';
    script.async = true;
    
    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
    link.rel = 'stylesheet';

    script.onload = () => {
      if (window.mapboxgl && MAPBOX_TOKEN) {
        window.mapboxgl.accessToken = MAPBOX_TOKEN;
        
        // Default center - India (New Delhi)
        mapRef.current = new window.mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [77.2090, 28.6139], // New Delhi, India
          zoom: 5
        });

        mapRef.current.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
        setMapLoaded(true);
      }
    };

    document.head.appendChild(link);
    document.body.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [MAPBOX_TOKEN]);

  // Get user's current location
  const handleGetCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.flyTo({ center: [longitude, latitude], zoom: 13 });
            addUserMarker(latitude, longitude);
            searchNearbyHospitals(latitude, longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter your location manually.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  // Search for hospitals by location
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a location');
      return;
    }
    setLoading(true);
    try {
      const geocodeResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.trim())}.json?access_token=${MAPBOX_TOKEN}`
      );
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.features && geocodeData.features.length > 0) {
        const [lng, lat] = geocodeData.features[0].center;
        if (mapRef.current) {
          mapRef.current.flyTo({ center: [lng, lat], zoom: 13 });
          addUserMarker(lat, lng);
          searchNearbyHospitals(lat, lng);
        }
      } else {
        alert('Location not found. Please try another search.');
        setLoading(false);
      }
    } catch (e) {
      console.error('Error searching location', e);
      alert('Error searching location. Please try again.');
      setLoading(false);
    }
  };

  // Add user location marker
  const addUserMarker = (lat, lng) => {
    if (!mapRef.current) return;
    
    // Remove existing user marker if any
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    
    const el = document.createElement('div');
    el.className = 'user-marker';
    el.innerHTML = '📍';
    el.style.fontSize = '32px';
    
    userMarkerRef.current = new window.mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
  };

  // Search for nearby hospitals
  const searchNearbyHospitals = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/hospital.json?proximity=${lng},${lat}&limit=10&types=poi&access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      // Clear existing hospital markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      if (data.features && data.features.length > 0) {
        data.features.forEach((feature, index) => {
          const hospitalLng = feature.center[0];
          const hospitalLat = feature.center[1];
          const hospitalName = feature.text || feature.properties?.name || 'Hospital';
          
          // Create hospital marker
          const el = document.createElement('div');
          el.className = 'hospital-marker';
          el.innerHTML = `<div class="marker-icon">${index + 1}</div>`;
          
          const marker = new window.mapboxgl.Marker(el)
            .setLngLat([hospitalLng, hospitalLat])
            .addTo(mapRef.current);
          
          // Click to open in Mapbox (new tab)
          marker.getElement().addEventListener('click', () => {
            const mapboxUrl = `https://www.mapbox.com/search/${hospitalLat},${hospitalLng}`;
            window.open(mapboxUrl, '_blank');
          });
          
          markersRef.current.push(marker);
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      alert('Error fetching hospital data. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <LocalHospitalIcon className="text-4xl text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Find Nearby Hospitals
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Locate hospitals near you quickly and easily. Enter your location or use your current position.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your location (e.g., New Delhi, India)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex-1 gradient-primary text-white"
                >
                  <SearchIcon className="mr-2" />
                  Search Hospitals
                </Button>
                <Button
                  onClick={handleGetCurrentLocation}
                  disabled={loading}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <MyLocationIcon className="mr-2" />
                  Use My Location
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border/50">
            <div 
              ref={mapContainerRef} 
              className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden"
            />
            {!mapLoaded && (
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <LocalHospitalIcon className="text-6xl text-primary mb-2 animate-pulse" />
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="text-center py-6 mt-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-border/50">
              <LocalHospitalIcon className="text-4xl text-primary mb-2 animate-pulse" />
              <p className="text-muted-foreground font-medium">Searching for hospitals...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalFinder;
