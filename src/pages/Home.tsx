import { motion } from 'framer-motion';
import { MapPin, Clock, Filter, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find and Book Parking Spots Instantly
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Secure the perfect parking spot in your locality with just a few clicks
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-8 mb-12"
      >
        <div className="bg-white p-6 rounded-xl shadow-md">
          <MapPin className="h-12 w-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Location Based</h3>
          <p className="text-gray-600">Find parking spots near you with real-time availability</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Clock className="h-12 w-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Flexible Duration</h3>
          <p className="text-gray-600">Book for hours, days, or weeks as per your need</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <Filter className="h-12 w-12 text-indigo-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Filters</h3>
          <p className="text-gray-600">Filter by vehicle type, price range, and more</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Link
          to="/search"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Car className="mr-2 h-5 w-5" />
          Find Parking Now
        </Link>
      </motion.div>
    </div>
  );
}