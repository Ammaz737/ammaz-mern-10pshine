import { motion } from "framer-motion";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNoteStore } from "../../store/noteStore";
import { formatDate } from "../utils/date";
import { FiEdit, FiArrowLeft } from "react-icons/fi";

const NoteViewPage = () => {
    const { id } = useParams();
    const { notes, getNotes } = useNoteStore();
    const note = notes.find((note) => note._id === id);

    useEffect(() => {
        if (notes.length === 0) {
            getNotes();
        }
    }, [getNotes, notes.length]);

    if (!note) {
        return <div className="text-white text-center">Loading...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto my-10 p-8 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text mb-2">
                        {note.title}
                    </h2>
                    <div className="flex items-center text-sm text-gray-400 space-x-4">
                        <span>Created: {formatDate(note.createdAt)}</span>
                        <span>Last updated: {formatDate(note.updatedAt)}</span>
                    </div>
                </div>
                <Link to={`/note/edit/${note._id}`}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='flex items-center space-x-2 py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    >
                        <FiEdit />
                        <span>Edit</span>
                    </motion.button>
                </Link>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 mb-6"
                dangerouslySetInnerHTML={{ __html: note.content }}
            ></div>

            {note.tags && note.tags.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag, index) => (
                            <span key={index} className='px-3 py-1 bg-green-700 text-green-200 rounded-full text-sm'>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 border-t border-gray-700 pt-6">
                <Link to="/">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='flex items-center space-x-2 py-2 px-4 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    >
                        <FiArrowLeft />
                        <span>Back to Dashboard</span>
                    </motion.button>
                </Link>
            </div>
        </motion.div>
    );
};

export default NoteViewPage;
