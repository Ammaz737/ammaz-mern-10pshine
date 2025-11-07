import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNoteStore } from '../../store/noteStore';
import NoteCard from '../components/NoteCard';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = ({ selectedFolder }) => {
  const { notes, getNotes, isLoading } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    let inFolder = true;
    if (selectedFolder === "") {
      inFolder = !note.folder;
    } else if (selectedFolder) {
      inFolder = note.folder === selectedFolder;
    }

    return (
      inFolder &&
      (note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query))))
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className='w-full min-h-screen m-4 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
    >
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search notes by title, content, or tags...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredNotes.length > 0 ? (
            filteredNotes.sort((a, b) => b.isPinned - a.isPinned).map((note) => <NoteCard key={note._id} note={note} />)
          ) : (
            <p className='text-center text-gray-400 col-span-full'>No notes found.</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardPage;

