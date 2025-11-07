import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNoteStore } from '../../store/noteStore';

const CreateNoteModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const { createNote } = useNoteStore();

  const handleCreateNote = async () => {
    if (!title || !content) {
       
      return;
    }
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    await createNote({ title, content, tags: tagsArray });
    onClose();
    setTitle('');
    setContent('');
    setTags('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className='bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 w-full max-w-lg p-8 m-4'
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
              Create Note
            </h2>
            <div className='space-y-4'>
              <input
                type='text'
                placeholder='Note Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
              />
              <textarea
                placeholder='Note Content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className='w-full p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 text-white h-40 resize-none focus:outline-none focus:ring-2 focus:ring-green-500'
              />
              <input
                type='text'
                placeholder='Tags (comma-separated)'
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className='w-full p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>
            <div className='mt-6 flex justify-end space-x-4'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className='px-6 py-2 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNote}
                className='px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                Create
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateNoteModal;
