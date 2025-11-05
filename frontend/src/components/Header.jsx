import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';

const Header = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileIconRef = useRef(null);
  const navigate = useNavigate();

  const openProfileModal = () => setIsProfileModalOpen(prev => !prev);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const handleCreateNoteClick = () => {
    navigate('/note/new');
  };

  return (
    <>
      <header className='bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
          NotesApp
        </h1>
        <div className='flex items-center space-x-4'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNoteClick}
            className='px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
          >
            Create Note
          </motion.button>
          <motion.div
            ref={profileIconRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openProfileModal}
            className='cursor-pointer relative'
          >
            <FaUserCircle className='text-4xl text-green-400' />
          </motion.div>
        </div>
      </header>
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
    </>
  );
};

export default Header;
