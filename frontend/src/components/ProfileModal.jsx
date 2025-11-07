import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../utils/date';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className='absolute top-14 right-0 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 w-full max-w-xs p-6 z-50'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-2xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
              Profile
            </h2>

            <div className='space-y-4'>
              <motion.div
                className='p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className='text-lg font-semibold text-green-400 mb-2'>Profile Information</h3>
                <p className='text-gray-300 text-sm'>Name: {user.name}</p>
                <p className='text-gray-300 text-sm'>Email: {user.email}</p>
              </motion.div>
              <motion.div
                className='p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className='text-lg font-semibold text-green-400 mb-2'>Account Activity</h3>
                <p className='text-gray-300 text-sm'>
                  <span className='font-bold'>Joined: </span>
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className='text-gray-300 text-sm'>
                  <span className='font-bold'>Last Login: </span>
                  {formatDate(user.lastLogin)}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className='mt-6'
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className='w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900'
              >
                Logout
              </motion.button>
            </motion.div>
          </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;