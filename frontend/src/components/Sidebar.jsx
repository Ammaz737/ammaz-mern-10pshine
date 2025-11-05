import { useEffect, useState } from "react";
import { useNoteStore } from "../../store/noteStore";
import { useFolderStore } from "../../store/folderStore";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlus, FaFolder } from "react-icons/fa";
import { MoreVertical, Edit, Trash2, Pin, Move, ChevronRight } from "lucide-react";

const Sidebar = ({ setSelectedFolder }) => {
  const { notes, getNotes, isLoading: notesLoading, deleteNote, pinNote, moveNoteToFolder } = useNoteStore();
  const { folders, getFolders, createFolder, isLoading: foldersLoading, renameFolder, deleteFolder } = useFolderStore();
  const [newFolderName, setNewFolderName] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openMoveMenuId, setOpenMoveMenuId] = useState(null);
  const [openFolderMenuId, setOpenFolderMenuId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [collapsedFolders, setCollapsedFolders] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
    getFolders();
  }, [getNotes, getFolders]);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (newFolderName.trim() !== "") {
      await createFolder(newFolderName);
      setNewFolderName("");
    }
  };

  const notesInFolder = (folderId) => {
    return notes.filter((note) => note.folder === folderId).sort((a, b) => b.isPinned - a.isPinned);
  };

  const notesWithoutFolder = () => {
    return notes.filter((note) => !note.folder).sort((a, b) => b.isPinned - a.isPinned);
  };

  const handleMenuClick = (noteId) => {
    setOpenMenuId(openMenuId === noteId ? null : noteId);
    setOpenMoveMenuId(null);
  };

  const handleEdit = (id) => {
    navigate(`/note/edit/${id}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNote(id);
      setOpenMenuId(null);
    }
  };

  const handlePin = async (id, isPinned) => {
    await pinNote(id, !isPinned);
    setOpenMenuId(null);
  };

  const handleMove = async (noteId, folderId) => {
    await moveNoteToFolder(noteId, folderId);
    setOpenMoveMenuId(null);
    setOpenMenuId(null);
  };

  const handleMoveClick = (noteId) => {
    setOpenMoveMenuId(openMoveMenuId === noteId ? null : noteId);
  };

  const handleFolderMenuClick = (folderId) => {
    setOpenFolderMenuId(openFolderMenuId === folderId ? null : folderId);
  };

  const handleRenameFolder = (folder) => {
    setEditingFolderId(folder._id);
    setEditingFolderName(folder.name);
    setOpenFolderMenuId(null);
  };

  const handleRenameFolderSubmit = async (e) => {
    e.preventDefault();
    if (editingFolderName.trim() !== "") {
      await renameFolder(editingFolderId, editingFolderName);
      setEditingFolderId(null);
      setEditingFolderName("");
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm("Are you sure you want to delete this folder? All notes within it will be moved to Uncategorized.")) {
      // Move notes to uncategorized
      const notesToMove = notesInFolder(folderId);
      for (const note of notesToMove) {
        await moveNoteToFolder(note._id, null);
      }
      await deleteFolder(folderId);
      setOpenFolderMenuId(null);
    }
  };

  const toggleFolderCollapse = (folderId) => {
    setCollapsedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const renderNoteItem = (note) => (
    <motion.li
      key={note._id}
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      className="mb-2 flex items-center justify-between p-2 rounded-lg"
    >
      <Link
        to={`/note/view/${note._id}`}
        className="flex-grow text-gray-300 hover:text-white"
      >
        {note.isPinned && <Pin className="inline-block w-4 h-4 mr-2 text-yellow-400" />} 
        {note.title}
      </Link>
      <div className="relative">
        <button onClick={() => handleMenuClick(note._id)} className="p-1 rounded-full hover:bg-gray-700">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
        {openMenuId === note._id && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10"
          >
            <ul className="py-1">
              <li>
                <button onClick={() => handleEdit(note._id)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </button>
              </li>
              <li>
                <button onClick={() => handleDelete(note._id)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              </li>
              <li>
                <button onClick={() => handlePin(note._id, note.isPinned)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center">
                  <Pin className="w-4 h-4 mr-2" /> {note.isPinned ? "Unpin" : "Pin"}
                </button>
              </li>
              <li className="relative">
                <button onClick={() => handleMoveClick(note._id)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center">
                  <Move className="w-4 h-4 mr-2" /> Move to
                </button>
                {openMoveMenuId === note._id && (
                  <motion.ul
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-20"
                  >
                    <li>
                      <button onClick={() => handleMove(note._id, null)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Uncategorized</button>
                    </li>
                    {folders.map((folder) => (
                      <li key={folder._id}>
                        <button onClick={() => handleMove(note._id, folder._id)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                          {folder.name}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </motion.li>
  );

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-1/4 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 border-r border-gray-700 flex flex-col flex-shrink-0"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">My Notes</h2>
        <Link to="/note/new">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-green-500 rounded-full text-white"
          >
            <FaPlus />
          </motion.button>
        </Link>
      </div>
      <div className="flex-grow overflow-y-auto">
        {foldersLoading ? (
          <p className="text-gray-400">Loading folders...</p>
        ) : (
          <ul>
            {folders.map((folder) => (
              <motion.li
                key={folder._id}
                className="mb-2"
              >
                <div className="flex items-center justify-between p-2 rounded-lg text-gray-300 hover:text-white bg-gray-700">
                  <div className="flex items-center flex-grow" onClick={() => setSelectedFolder(folder._id)}>
                    <button onClick={(e) => { e.stopPropagation(); toggleFolderCollapse(folder._id); }} className="mr-2">
                      <ChevronRight className={`w-5 h-5 transform transition-transform ${!collapsedFolders[folder._id] ? 'rotate-90' : ''}`} />
                    </button>
                    <FaFolder className="mr-2" />
                    {editingFolderId === folder._id ? (
                      <form onSubmit={handleRenameFolderSubmit} className="flex-grow">
                        <input
                          type="text"
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          className="w-full bg-gray-600 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          autoFocus
                          onBlur={() => setEditingFolderId(null)}
                        />
                      </form>
                    ) : (
                      <span className="font-bold">{folder.name}</span>
                    )}
                  </div>
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); handleFolderMenuClick(folder._id); }} className="p-1 rounded-full hover:bg-gray-600">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                    {openFolderMenuId === folder._id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10"
                      >
                        <ul className="py-1">
                          <li>
                            <button onClick={() => handleRenameFolder(folder)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center">
                              <Edit className="w-4 h-4 mr-2" /> Rename
                            </button>
                          </li>
                          <li>
                            <button onClick={() => handleDeleteFolder(folder._id)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </button>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </div>
                {!collapsedFolders[folder._id] && (
                  <ul className="ml-4 mt-2">
                    {notesInFolder(folder._id).map(renderNoteItem)}
                  </ul>
                )}
              </motion.li>
            ))}
          </ul>
        )}

        <div className="mt-4" onClick={() => setSelectedFolder("")}>
          <h3 className="text-lg font-bold text-white mb-2">Uncategorized</h3>
          {notesLoading ? (
            <p className="text-gray-400">Loading notes...</p>
          ) : (
            <ul>
              {notesWithoutFolder().map(renderNoteItem)}
            </ul>
          )}
        </div>

        <form onSubmit={handleCreateFolder} className="mt-4">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button type="submit" className="w-full mt-2 p-2 bg-green-500 rounded-lg text-white font-bold">Create Folder</button>
        </form>
      </div>
    </motion.div>
  );
};

export default Sidebar;

