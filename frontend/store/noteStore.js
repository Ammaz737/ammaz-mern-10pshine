import { create } from "zustand";
import { api } from "../src/pages/api";

const API_URL = "/api/notes";

export const useNoteStore = create((set) => ({
  notes: [],
  error: null,
  isLoading: false,
  message: null,

  getNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(API_URL);
      set({ notes: response.data.notes, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message || "Error getting notes", isLoading: false });
    }
  },

  createNote: async ({ title, content, tags }) => {
    set({ isLoading: true, error: null });
    console.log("Making API call to create note with data:", { title, content, tags });
    try {
      const response = await api.post(API_URL, { title, content, tags });
      console.log("API response:", response);
      set((state) => ({ notes: [...state.notes, response.data.note], isLoading: false }));
    } catch (error) {
      console.error("Error creating note:", error);
      set({ error: error.response?.data?.message || "Error creating note", isLoading: false });
      throw error;
    }
  },

  updateNote: async ({ id, title, content, tags }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`${API_URL}/${id}`, { title, content, tags });
      set((state) => ({
        notes: state.notes.map((note) => (note._id === id ? response.data.note : note)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.response.data.message || "Error updating note", isLoading: false });
      throw error;
    }
  },

      deleteNote: async (id) => {
          set({ isLoading: true, error: null });
          try {
              await api.delete(`${API_URL}/${id}`);
              set((state) => ({ notes: state.notes.filter((note) => note._id !== id), isLoading: false }));
          } catch (error) {
              set({ error: error.response.data.message || "Error deleting note", isLoading: false });
              throw error;
          }
      },
  
      pinNote: async (id, isPinned) => {
          set({ isLoading: true, error: null });
          try {
              const response = await api.put(`${API_URL}/${id}/pin`, { isPinned });
              set((state) => ({
                  notes: state.notes.map((note) => (note._id === id ? response.data.note : note)),
                  isLoading: false,
              }));
          } catch (error) {
              set({ error: error.response.data.message || "Error pinning note", isLoading: false });
              throw error;
          }
      },

      moveNoteToFolder: async (id, folderId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.put(`${API_URL}/move/${id}`, { folderId });
          set((state) => ({
            notes: state.notes.map((note) => (note._id === id ? response.data.note : note)),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error.response.data.message || "Error moving note", isLoading: false });
          throw error;
        }
      },
  }));
