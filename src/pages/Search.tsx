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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-200 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_blue-300_1px,_transparent_1px)] bg-[size:20px_20px] animate-pulse"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden relative z-10"
        >
          {/* Card inner glowing border */}
          <div className="absolute inset-0 rounded-xl p-[2px]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-300 via-gray-200 to-blue-400 opacity-60 animate-gradient-x"></div>
          </div>
          
          <div className="relative px-6 py-8 bg-white rounded-xl">
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold text-center mb-8 relative"
            >
              <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-gray-600 bg-clip-text text-transparent">
                Find Available Parking
              </span>
              {/* Decorative underline */}
              <span className="absolute left-1/2 bottom-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-gray-500 transform -translate-x-1/2 rounded-full"></span>
            </motion.h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="group"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Vehicle Type
                </label>
                <div className="relative">
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-blue-100 group-hover:shadow-md z-10 relative"
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="truck">Truck</option>
                    <option value="suv">SUV</option>
                  </select>
                  {/* Highlight effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-transparent opacity-0 group-hover:opacity-20 rounded-md transition-opacity duration-300"></div>
                </div>
              </motion.div>
  
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="group"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Duration (hours)
                </label>
                <div className="relative">
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-blue-100 group-hover:shadow-md z-10 relative"
                  >
                    {[1, 2, 3, 4, 6, 8, 12, 24].map(hours => (
                      <option key={hours} value={hours}>{hours} hours</option>
                    ))}
                  </select>
                  {/* Highlight effect */}
                  <div className="absolute inset-0 bg-gradient-to-l from-blue-200 to-transparent opacity-0 group-hover:opacity-20 rounded-md transition-opacity duration-300"></div>
                </div>
              </motion.div>
  
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="group"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Maximum Price (₹)
                </label>
                <div className="relative overflow-hidden rounded-md">
                  <select
                    name="maxPrice"
                    value={formData.maxPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-blue-100 group-hover:shadow-md z-10 relative"
                  >
                    {[10, 20, 30, 50, 75, 100].map(price => (
                      <option key={price} value={price}>₹{price}</option>
                    ))}
                  </select>
                  {/* Ripple effect */}
                  <div className="absolute inset-0 group-hover:before:content-[''] group-hover:before:absolute group-hover:before:w-32 group-hover:before:h-32 group-hover:before:bg-blue-200 group-hover:before:rounded-full group-hover:before:opacity-20 group-hover:before:animate-ripple"></div>
                </div>
              </motion.div>
  
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="group"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  Search Radius (km)
                </label>
                <div className="relative overflow-hidden rounded-md">
                  <select
                    name="searchRadius"
                    value={formData.searchRadius}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:shadow-blue-100 group-hover:shadow-md z-10 relative"
                  >
                    {[1, 2, 5, 10, 15, 20].map(radius => (
                      <option key={radius} value={radius}>{radius} km</option>
                    ))}
                  </select>
                  {/* Ripple effect reverse */}
                  <div className="absolute inset-0 group-hover:before:content-[''] group-hover:before:absolute group-hover:before:right-0 group-hover:before:w-32 group-hover:before:h-32 group-hover:before:bg-blue-200 group-hover:before:rounded-full group-hover:before:opacity-20 group-hover:before:animate-ripple-reverse"></div>
                </div>
              </motion.div>
  
              <motion.button
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="relative w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white overflow-hidden group"
              >
                {/* Multi-layer gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-gray-600 opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-gray-500 opacity-0 group-hover:opacity-90 transition-opacity duration-500"></div>
                
                {/* Animated light streak */}
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,transparent,transparent,transparent,rgba(255,255,255,0.3),transparent,transparent,transparent,transparent)] -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out"></div>
                
                {/* Content */}
                <Navigation className="mr-2 h-5 w-5 relative z-10 group-hover:animate-bounce-gentle" />
                <span className="relative z-10">Find Parking Spots</span>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }
  
  if (step === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-tl from-blue-200 via-blue-50 to-blue-200 py-8 px-4 sm:px-6 lg:px-8 relative">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-300 opacity-10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 40 + 10}px`,
                height: `${Math.random() * 40 + 10}px`,
                animationDuration: `${Math.random() * 20 + 10}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep('filters')}
              className="relative text-blue-600 hover:text-blue-800 flex items-center group overflow-hidden"
            >
              {/* Button background glow */}
              <div className="absolute -inset-4 bg-blue-100 rounded-full opacity-0 group-hover:opacity-30 transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
              
              <Car className="h-5 w-5 mr-2 group-hover:animate-wiggle" />
              <span className="relative">
                Change Filters
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-gray-400 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </span>
            </motion.button>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-100 to-gray-100 text-gray-600 shadow-sm border border-blue-100 flex items-center"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></div>
              Found {PARKING_SPOTS.length} parking spots
            </motion.div>
          </motion.div>
  
          <div className="space-y-4">
            {PARKING_SPOTS.map((spot, index) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl group relative"
              >
                {/* Gradient border */}
                <div className="absolute inset-0 p-[1px] rounded-xl bg-gradient-to-br from-blue-300 via-gray-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative bg-white rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 relative inline-block">
                        <span className="bg-gradient-to-r from-blue-700 to-gray-700 group-hover:from-blue-600 group-hover:to-gray-600 bg-clip-text text-transparent transition-all duration-300">{spot.name}</span>
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-blue-200 group-hover:w-full transition-all duration-500 ease-out"></span>
                      </h3>
                      <p className="text-gray-600 mb-4">{spot.address}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center group/clock">
                          <Clock className="h-4 w-4 mr-1 text-blue-400 group-hover/clock:text-blue-500 transition-all duration-300 group-hover/clock:rotate-12" />
                          <span className="group-hover/clock:text-blue-500 transition-colors duration-300">24/7</span>
                        </span>
                        <span className="flex items-center group/dollar">
                          <DollarSign className="h-4 w-4 mr-1 text-blue-400 group-hover/dollar:text-blue-500 transition-all duration-300 group-hover/dollar:rotate-12" />
                          <span className="group-hover/dollar:text-blue-500 transition-colors duration-300">₹{spot.price}/hour</span>
                        </span>
                        <span className="flex items-center group/map">
                          <MapPin className="h-4 w-4 mr-1 text-blue-400 group-hover/map:text-blue-500 transition-all duration-300 group-hover/map:rotate-12" />
                          <span className="group-hover/map:text-blue-500 transition-colors duration-300">{spot.distance} km</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold mb-2 transition-transform duration-300 group-hover:translate-y-[-2px]">
                        {spot.availableSpots} spots available
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedSpot(spot);
                          setShowModal(true);
                        }}
                        className="relative px-4 py-2 rounded-md text-white overflow-hidden group/btn"
                      >
                        {/* Multi-layer background */}
                        <span className="absolute inset-0 bg-gradient-to-br from-blue-500 to-gray-600"></span>
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-gray-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                        
                        {/* Sparkle effect */}
                        <span className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_white_10%,_transparent_10%),radial-gradient(circle,_white_10%,_transparent_10%)] bg-[position:var(--x,_0)_var(--y,_0),calc(var(--x,_0)_+_5px)_calc(var(--y,_0)_+_5px)] bg-[size:10px_10px] opacity-0 group-hover/btn:opacity-30 transition-opacity duration-300"></span>
                        
                        <span className="relative z-10 font-medium">Select</span>
                      </motion.button>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-blue-50 to-gray-100 relative">
      {/* Topographic background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cGF0aCBkPSJNMjggNjZMMCA1MEwwIDE2TDI4IDBMNTYgMTZMNTYgNTBMMjggNjZMMjggMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] bg-repeat opacity-10"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-md p-6 relative z-10"
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05, x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep('results')}
              className="text-blue-600 hover:text-blue-800 flex items-center group relative"
            >
              {/* Animated highlight */}
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-100 to-transparent rounded-lg opacity-0 group-hover:opacity-70 blur-sm transform group-hover:translate-x-1 transition-all duration-300"></div>
              
              <Car className="h-5 w-5 mr-2 relative z-10 transform group-hover:-translate-x-1 transition-all duration-300" />
              <span className="relative z-10 font-medium">
                Back to Results
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-transparent group-hover:w-full transition-all duration-300"></span>
              </span>
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex items-center space-x-2 text-gray-700">
                <div className="relative">
                  <div className="absolute -inset-1 bg-green-100 rounded-full opacity-0 group-hover:opacity-70 group-hover:animate-ping-slow"></div>
                  <MapPin className="h-5 w-5 text-green-600 relative z-10" />
                </div>
                <span className="font-medium group-hover:text-blue-600 transition-colors duration-300">Your Location</span>
              </div>
              <div className="mt-2 pl-7 text-gray-900">
                {userLocation ? 
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Location detected</span> : 
                  <span className="inline-flex items-center">
                    Detecting location...
                    <span className="ml-2 h-2 w-2 bg-blue-400 rounded-full animate-pulse"></span>
                    <span className="ml-1 h-2 w-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
                    <span className="ml-1 h-2 w-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></span>
                  </span>
                }
              </div>
            </motion.div>
            
            {selectedSpot && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-red-100 rounded-full opacity-0 group-hover:opacity-70 group-hover:animate-ping-slow"></div>
                    <MapPin className="h-5 w-5 text-red-600 relative z-10" />
                  </div>
                  <span className="font-medium group-hover:text-blue-600 transition-colors duration-300">Destination</span>
                </div>
                <div className="mt-2 pl-7">
                  <div className="font-semibold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-gray-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{selectedSpot.name}</div>
                  <div className="text-gray-600">{selectedSpot.address}</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex-1 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div 
          className="h-[70vh] relative rounded-xl overflow-hidden shadow-xl border border-gray-200"
          whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          {/* Fancy map loading state */}
          <div className="absolute inset-0 bg-blue-50 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-blue-100"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 bg-white bg-opacity-90 rounded-lg shadow-md flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-600 font-medium">Loading map...</span>
              </div>
            </div>
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </div>
          
          <div className="absolute inset-0 rounded-xl p-[2px] z-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-300 via-gray-200 to-blue-300 opacity-20"></div>
          </div>
          
          <MapContainer
            center={userLocation || [51.505, -0.09]}
            zoom={13}
            className="h-full w-full relative z-20 rounded-xl"
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
        </motion.div>
      </motion.div>
    </div>
  );
}