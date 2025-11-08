import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './Hospital.css';

const HospitalFinder = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const userMarkerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [committedSearch, setCommittedSearch] = useState(false);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

  // Initialize map
  useEffect(() => {
    if (!MAPBOX_TOKEN || map.current || !mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [77.209, 28.6139], // Default to New Delhi
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      map.current.on('click', 'poi-label', (e) => {
        if (e.features.length > 0) {
          const feature = e.features[0];
          const coordinates = feature.geometry.coordinates.slice();
          const name = feature.properties.name || 'Unknown Location';
          const category = feature.properties.class || '';

          const medicalKeywords = ['hospital', 'clinic', 'medical', 'health', 'emergency', 'doctor'];
          const isHealthcare = medicalKeywords.some(
            (keyword) =>
              name.toLowerCase().includes(keyword) || category.toLowerCase().includes(keyword)
          );

          if (!isHealthcare) return;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          const popupContent = `
            <div class="hospital-popup">
              <h3>${name}</h3>
              <button class="direction-btn" onclick="window.openGoogleMaps(${
                coordinates[1]
              }, ${coordinates[0]}, '${name.replace(/'/g, "\\'")}')">
                Get Directions on Google Maps
              </button>
            </div>
          `;

          new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupContent).addTo(map.current);
        }
      });

      map.current.on('mouseenter', 'poi-label', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'poi-label', () => {
        map.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [MAPBOX_TOKEN]);

  // Handle search query changes and fetch suggestions
  useEffect(() => {
    // If a search has been committed, suppress suggestions
    if (committedSearch) {
      setIsSuggestionsVisible(false);
      return;
    }

    if (searchQuery.trim().length > 2) {
      const fetchSuggestions = async () => {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchQuery
          )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
        setIsSuggestionsVisible(true);
      };
      const debounce = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  }, [searchQuery, MAPBOX_TOKEN, committedSearch]);

  // Handle location selection from search or GPS
  const handleLocationSelect = (lat, lng, name) => {
    setSearchQuery(name);
    setSuggestions([]);
    setIsSuggestionsVisible(false);
    setCommittedSearch(true);
    setUserLocation([lng, lat]);

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    userMarkerRef.current = new mapboxgl.Marker({ color: '#FF0000' })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>${name}</h3>`))
      .addTo(map.current);

    map.current.flyTo({
      center: [lng, lat],
      zoom: 14,
      essential: true,
    });
    setLoading(false);
  };
  
  // Handle search button click
  const handleSearch = () => {
    setIsSuggestionsVisible(false);
    setCommittedSearch(true);
      if (suggestions.length > 0) {
          const firstSuggestion = suggestions[0];
          handleLocationSelect(firstSuggestion.center[1], firstSuggestion.center[0], firstSuggestion.place_name);
      } else if (searchQuery.trim()) {
          // If no suggestions, just geocode the raw query
          const geocode = async () => {
              setLoading(true);
              const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&limit=1`);
              const data = await response.json();
              if (data.features && data.features.length > 0) {
                  const feature = data.features[0];
                  handleLocationSelect(feature.center[1], feature.center[0], feature.place_name);
              } else {
                  alert("Location not found. Please try a different search term.");
                  setLoading(false);
              }
          };
          geocode();
      }
  };

  // Get user's current GPS location
  const handleGetCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleLocationSelect(position.coords.latitude, position.coords.longitude, "Your Current Location");
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please ensure location services are enabled.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  // Global function to open Google Maps
  useEffect(() => {
    window.openGoogleMaps = (lat, lng) => {
      const origin = userLocation ? `${userLocation[1]},${userLocation[0]}` : '';
      const destination = `${lat},${lng}`;
      const url = origin
        ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(url, '_blank');
    };

    return () => {
      delete window.openGoogleMaps;
    };
  }, [userLocation]);

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
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Enter a location or use your GPS to find hospitals. Click on any hospital name on the map to get directions.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-grow w-full">
                            <Input
                                type="text"
                                placeholder="Enter your location (e.g., New Delhi)"
                                value={searchQuery}
                onChange={(e) => { setCommittedSearch(false); setSearchQuery(e.target.value); }}
                                onFocus={() => setIsSuggestionsVisible(true)}
                                onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 200)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
                                className="w-full"
                            />
                        </div>
                        <Button
                            onClick={handleGetCurrentLocation}
                            disabled={loading}
                            variant="outline"
                            className="p-2 h-10 w-full sm:w-auto flex items-center justify-center"
                        >
              <MyLocationIcon className="mr-2" />
              Detect My Location
                        </Button>
                    </div>
                    
                    {isSuggestionsVisible && suggestions.length > 0 && (
                        <ul className="suggestions-list-static">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.id}
                                    onMouseDown={() => handleLocationSelect(suggestion.center[1], suggestion.center[0], suggestion.place_name)}
                                >
                                    {suggestion.place_name}
                                </li>
                            ))}
                        </ul>
                    )}
                    
                    <Button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full gradient-primary text-white"
                    >
                        <SearchIcon className="mr-2" />
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </div>
            </div>
        </div>

        {/* Map */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border/50">
            <div
              ref={mapContainer}
              className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden"
            />
          </div>
           <div className="text-center mt-4 text-sm text-muted-foreground">
              💡 Tip: Zoom in closer to see more hospitals and medical facilities appear on the map.
            </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalFinder;