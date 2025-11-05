
import { create } from "zustand";
import { api } from "../src/pages/api";

const API_URL = "/api/folders";

export const useFolderStore = create((set) => ({
  folders: [],
  error: null,
  isLoading: false,

  getFolders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(API_URL);
      set({ folders: response.data.folders, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message || "Error getting folders", isLoading: false });
    }
  },

  createFolder: async (name) => {
    set({ isLoading: true, error: null });
    console.log("Making API call to create folder with name:", name);
    try {
      const response = await api.post(API_URL, { name });
      console.log("API response:", response);
      set((state) => ({ folders: [...state.folders, response.data.folder], isLoading: false }));
    } catch (error) {
      console.error("Error creating folder:", error);
      set({ error: error.response?.data?.message || "Error creating folder", isLoading: false });
      throw error;
    }
  },

  renameFolder: async (id, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`${API_URL}/${id}`, { name });
      set((state) => ({
        folders: state.folders.map((folder) => (folder._id === id ? response.data.folder : folder)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.response.data.message || "Error renaming folder", isLoading: false });
      throw error;
    }
  },

  deleteFolder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`${API_URL}/${id}`);
      set((state) => ({ folders: state.folders.filter((folder) => folder._id !== id), isLoading: false }));
    } catch (error) {
      set({ error: error.response.data.message || "Error deleting folder", isLoading: false });
      throw error;
    }
  },
}));
