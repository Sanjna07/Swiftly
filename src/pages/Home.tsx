import { motion } from 'framer-motion';
import { MapPin, Clock, Filter, Car, Sparkles, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const shimmerVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: {
      x: '100%',
      opacity: 0.6,
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white  via-blue-200 to-gray-500 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-400 bg-clip-text text-transparent">
          Your Shortcut to Hassle-Free Parking!
          </h1>
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Discover and secure premium parking spots in your area with just a few taps, making your journey seamless from start to finish
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-10 mb-16"
        >
          {/* First Feature Box - Navy & Light Blue Theme */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(30, 58, 138, 0.2)" }}
            className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-lg relative overflow-hidden group h-full border border-blue-100"
          >
            <motion.div
              variants={shimmerVariants}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-0 group-hover:opacity-40"
            />
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-blue-800 to-blue-600 p-4 rounded-xl inline-block mb-6 group-hover:from-blue-700 group-hover:to-blue-500 transition-colors duration-300">
                <MapPin className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-blue-900 group-hover:text-blue-700 transition-colors duration-300">Smart Location Finding</h3>
              <p className="text-gray-600 text-lg">Discover available parking spots near you with real-time availability updates and interactive maps</p>
            </div>
          </motion.div>

          {/* Second Feature Box - Cyan & Teal Theme */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(6, 182, 212, 0.2)" }}
            className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg relative overflow-hidden group h-full border border-cyan-100"
          >
            <motion.div
              variants={shimmerVariants}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50 to-transparent opacity-0 group-hover:opacity-40"
            />
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-cyan-500 to-teal-400 p-4 rounded-xl inline-block mb-6 group-hover:from-cyan-400 group-hover:to-teal-300 transition-colors duration-300">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-cyan-800 group-hover:text-cyan-600 transition-colors duration-300">Premium Experience</h3>
              <p className="text-gray-600 text-lg">Enjoy hassle-free booking with flexible durations, from hourly parking to monthly reservations</p>
            </div>
          </motion.div>

          {/* Third Feature Box - Steel Blue & Gray Theme */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(51, 65, 85, 0.2)" }}
            className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg relative overflow-hidden group h-full border border-slate-200"
          >
            <motion.div
              variants={shimmerVariants}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-0 group-hover:opacity-40"
            />
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-slate-600 to-blue-500 p-4 rounded-xl inline-block mb-6 group-hover:from-slate-500 group-hover:to-blue-400 transition-colors duration-300">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-800 group-hover:text-slate-700 transition-colors duration-300">Secure & Reliable</h3>
              <p className="text-gray-600 text-lg">All parking spots are verified and secured with 24/7 monitoring and customer support</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <Link
            to="/search"
            className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold rounded-lg overflow-hidden group shadow-lg shadow-blue-100/50"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-slate-700 via-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)] -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></span>
            <span className="absolute inset-0 shadow-inner opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            <span className="relative z-10 flex items-center">
              <Car className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              Find Perfect Parking Now
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}