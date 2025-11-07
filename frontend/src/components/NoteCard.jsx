import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiEye, FiStar } from 'react-icons/fi';
import { useNoteStore } from '../../store/noteStore';
import { Link } from 'react-router-dom';

const NoteCard = ({ note }) => {
  const { deleteNote, pinNote } = useNoteStore();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(note._id);
    }
  };

  const handlePin = () => {
    pinNote(note._id, !note.isPinned);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`bg-gray-800 bg-opacity-60 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col justify-between ${note.isPinned ? 'border-green-500' : ''}`}>
      <div>
        <h3 className='text-2xl font-bold text-green-400 mb-3 truncate'>{note.title}</h3>
        <p className='text-gray-300 h-24 overflow-hidden overflow-ellipsis'>{note.content}</p>
        <div className='flex flex-wrap gap-2 mt-4'>
          {note.tags && note.tags.map((tag, index) => (
            <span key={index} className='px-2 py-1 bg-green-700 text-green-200 rounded-md text-sm'>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className='flex justify-end items-center space-x-3 mt-4'>
        <Link to={`/note/view/${note._id}`}>
          <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className='text-gray-400 hover:text-green-400'>
            <FiEye size={20} />
          </motion.button>
        </Link>
        <Link to={`/note/edit/${note._id}`}>
          <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className='text-gray-400 hover:text-yellow-400'>
            <FiEdit size={20} />
          </motion.button>
        </Link>
        <motion.button onClick={handleDelete} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className='text-gray-400 hover:text-red-400'>
          <FiTrash2 size={20} />
        </motion.button>
        <motion.button onClick={handlePin} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className={`text-gray-400 ${note.isPinned ? 'text-green-500' : 'hover:text-green-500'}`}>
          <FiStar size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NoteCard;