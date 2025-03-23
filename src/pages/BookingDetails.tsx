import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Clock, DollarSign, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    setLoading(true);
    try {
      // Simulated booking API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Booking confirmed successfully!');
    } catch (error) {
      toast.error('Failed to confirm booking. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-semibold mb-6">Parking Spot Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              <span>123 Example Street, City</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>Available 24/7</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-indigo-600" />
              <span>₹2/hour</span>
            </div>

            <button
              onClick={handleBooking}
              disabled={loading}
              className={`w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <MapContainer
            center={[51.505, -0.09]}
            zoom={15}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[51.505, -0.09]} />
          </MapContainer>
        </motion.div>
      </div>
    </div>
  );
}