import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Car, Navigation, MapPin, Clock, DollarSign, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// Mock data for parking spots
const PARKING_SPOTS = [
  {
    id: 1,
    name: "Expo Mart Car Parking",
    address: "FF8V+F36, Knowledge Park III, Greater Noida, Uttar Pradesh 201310, India",
    position: [28.4695, 77.5020], 
    price: 0, 
    available: true,
    distance: "5.2", 
    rating: 4.0,
    totalSpots: 100, 
    availableSpots: 60, 
  },
  {
    id: 2,
    name: "India Expo Mart Exhibitor Parking",
    address: "Plot No 23-24 & 27-29, Knowledge Park II, Near Pari Chowk, Greater Noida, Uttar Pradesh 201306, India",
    position: [28.4680, 77.5100],
    price: 0, 
    available: true,
    distance: "4.8",
    rating: 4.2,
    totalSpots: 150, 
    availableSpots: 80, 
  },
  {
    id: 3,
    name: "Alpha 1 Metro Parking",
    address: "Alpha 1 Metro Station, Greater Noida, Uttar Pradesh, India",
    position: [28.4745, 77.5105],
    price: 0, 
    available: true,
    distance: "3.0",
    rating: 4.1,
    totalSpots: 200, 
    availableSpots: 120, 
  },
  {
    id: 4,
    name: "The Grand Venice Mall Parking",
    address: "Plot No SH3, Site IV, Near Pari Chowk Metro Station, Greater Noida, Uttar Pradesh, India",
    position: [28.4595, 77.5080],
    price: 0, 
    available: true,
    distance: "6.0",
    rating: 4.5,
    totalSpots: 500, 
    availableSpots: 300, 
  }
];

function LocationMarker() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, 13);
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function RouteMap({ userLocation, destination }: { userLocation: [number, number]; destination: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: '#22c55e', weight: 4 }] // Green line for the route
      },
      show: false, // Hide the text directions
      addWaypoints: false, // Prevent adding new waypoints
      draggableWaypoints: false // Prevent dragging waypoints
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, destination]);

  return null;
}

type Step = 'filters' | 'results' | 'directions';

interface BookingModalProps {
  spot: typeof PARKING_SPOTS[0];
  onClose: () => void;
  onBook: () => void;
  onShowDirections: () => void;
}

function BookingModal({ spot, onClose, onBook, onShowDirections }: BookingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
      >
        <h3 className="text-2xl font-bold mb-4">{spot.name}</h3>
        <div className="space-y-4 mb-6">
          <p className="text-gray-600">{spot.address}</p>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Price per hour:</span>
            <span className="font-semibold">${spot.price}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Available spots:</span>
            <span className="font-semibold">{spot.availableSpots}/{spot.totalSpots}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Distance:</span>
            <span className="font-semibold">{spot.distance} km</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onShowDirections}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
          >
            <Route className="w-5 h-5 mr-2" />
            Get Directions
          </button>
          <button
            onClick={onBook}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Clock className="w-5 h-5 mr-2" />
            Book Now
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

export default function Search() {
  const [step, setStep] = useState<Step>('filters');
  const [selectedSpot, setSelectedSpot] = useState<typeof PARKING_SPOTS[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [formData, setFormData] = useState({
    vehicleType: 'car',
    duration: '2',
    maxPrice: '50',
    searchRadius: '5'
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your location. Please enable location services.');
        }
      );
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('results');
  };

  const handleBook = () => {
    toast.success('Parking spot booked successfully!');
    setShowModal(false);
  };

  const handleShowDirections = () => {
    setStep('directions');
    setShowModal(false);
  };

  if (step === 'filters') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Find Available Parking
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="truck">Truck</option>
                  <option value="suv">SUV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[1, 2, 3, 4, 6, 8, 12, 24].map(hours => (
                    <option key={hours} value={hours}>{hours} hours</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Price (₹)
                </label>
                <select
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[10, 20, 30, 50, 75, 100].map(price => (
                    <option key={price} value={price}>₹{price}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius (km)
                </label>
                <select
                  name="searchRadius"
                  value={formData.searchRadius}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[1, 2, 5, 10, 15, 20].map(radius => (
                    <option key={radius} value={radius}>{radius} km</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Navigation className="mr-2 h-5 w-5" />
                Find Parking Spots
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setStep('filters')}
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <Car className="h-5 w-5 mr-2" />
              Change Filters
            </button>
            <div className="text-gray-600">
              Found {PARKING_SPOTS.length} parking spots
            </div>
          </div>

          <div className="space-y-4">
            {PARKING_SPOTS.map((spot) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{spot.name}</h3>
                      <p className="text-gray-600 mb-4">{spot.address}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          24/7
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ₹{spot.price}/hour
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {spot.distance} km
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold mb-2">
                        {spot.availableSpots} spots available
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSpot(spot);
                          setShowModal(true);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showModal && selectedSpot && (
            <BookingModal
              spot={selectedSpot}
              onClose={() => setShowModal(false)}
              onBook={handleBook}
              onShowDirections={handleShowDirections}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white shadow-sm p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setStep('results')}
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <Car className="h-5 w-5 mr-2" />
              Back to Results
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-700">
                <MapPin className="h-5 w-5 text-green-600" />
                <span>Your Location</span>
              </div>
              <div className="mt-2 text-gray-900">
                {userLocation ? 'Location detected' : 'Detecting location...'}
              </div>
            </div>
            
            {selectedSpot && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-700">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <span>Destination</span>
                </div>
                <div className="mt-2">
                  <div className="font-semibold text-gray-900">{selectedSpot.name}</div>
                  <div className="text-gray-600">{selectedSpot.address}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="h-[70vh]">
          <MapContainer
            center={userLocation || [51.505, -0.09]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {userLocation && selectedSpot && (
              <RouteMap
                userLocation={userLocation}
                destination={selectedSpot.position}
              />
            )}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>Your location</Popup>
              </Marker>
            )}
            {selectedSpot && (
              <Marker position={selectedSpot.position}>
                <Popup>
                  <div className="p-2">
                    <p className="font-semibold">{selectedSpot.name}</p>
                    <p className="text-sm text-gray-600">{selectedSpot.address}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}