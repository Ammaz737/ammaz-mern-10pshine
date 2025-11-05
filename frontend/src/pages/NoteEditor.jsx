import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNoteStore } from "../../store/noteStore";
import toast from 'react-hot-toast';
import { generateWithLlm } from "./api";


const NoteEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notes, createNote, updateNote, isLoading } = useNoteStore();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const [llmPrompt, setLlmPrompt] = useState("");
    const [isLlmLoading, setIsLlmLoading] = useState(false);

    const isEditing = id !== undefined;

    useEffect(() => {
        if (isEditing) {
            const note = notes.find((note) => note._id === id);
            if (note) {
                setTitle(note.title);
                setContent(note.content);
                setTags(note.tags || []);
            }
        } else {
            setTitle("");
            setContent("");
            setTags([]);
        }
    }, [id, notes, isEditing]);

    const handleGenerateWithLlm = async () => {
        if (!llmPrompt) {
            toast.error("Please enter a prompt for the AI.");
            return;
        }
        setIsLlmLoading(true);
        try {
            const response = await generateWithLlm(llmPrompt);
            setContent(response.generatedContent);
            toast.success("Content generated with AI!");
        } catch (error) {
            toast.error("Failed to generate content with AI.");
        } finally {
            setIsLlmLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateNote({ id, title, content, tags });
                toast.success('Note updated successfully!');
            } else {
                await createNote({ title, content, tags });
                toast.success('Note created successfully!');
            }
            navigate("/");
        } catch (error) {
            toast.error('Failed to save note.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto my-10 p-8 bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700"
        >
            <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
                {isEditing ? "Edit Note" : "Create a New Note"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-lg font-medium text-gray-300 mb-2">Title</label>
                    <div className="relative">
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 pr-20"
                            placeholder="Enter a title for your note..."
                            maxLength={100}
                        />
                        <span className="absolute right-4 top-3 text-gray-400 text-sm">{title.length} / 100</span>
                    </div>
                </div>
                <div>
                    <label htmlFor="content" className="block text-lg font-medium text-gray-300 mb-2">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                        placeholder="Start writing your note..."
                        rows={10}
                    />
                </div>
                <div className="space-y-4">
                    <label htmlFor="llm-prompt" className="block text-lg font-medium text-gray-300 mb-2">Or generate with AI</label>
                    <textarea
                        id="llm-prompt"
                        value={llmPrompt}
                        onChange={(e) => setLlmPrompt(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                        placeholder="Enter a prompt for the AI..."
                        rows={3}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleGenerateWithLlm}
                        disabled={isLlmLoading}
                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
                    >
                        {isLlmLoading ? 'Generating...' : 'Generate with AI'}
                    </motion.button>
                </div>
                <div>
                    <label htmlFor="tags" className="block text-lg font-medium text-gray-300 mb-2">Tags (comma separated)</label>
                    <input
                        type="text"
                        id="tags"
                        value={tags.join(", ")}
                        onChange={(e) => setTags(e.target.value.split(",").map(tag => tag.trim()))}
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                        placeholder="e.g., work, personal, ideas"
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => navigate('/')}
                        className="py-3 px-6 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                    >
                        Cancel
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : (isEditing ? "Save Changes" : "Create Note")}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default NoteEditor;
