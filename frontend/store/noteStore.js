import { create } from "zustand";
import axios from "axios";

const API_URL = "/api/notes";

export const useNoteStore = create((set) => ({
  notes: [],
  error: null,
  isLoading: false,
  message: null,

  getNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ notes: response.data.notes, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message || "Error getting notes", isLoading: false });
    }
  },

  createNote: async ({ title, content, tags }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(API_URL, { title, content, tags });
      set((state) => ({ notes: [...state.notes, response.data.note], isLoading: false }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Error creating note", isLoading: false });
      throw error;
    }
  },

  updateNote: async ({ id, title, content, tags }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/${id}`, { title, content, tags });
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
              await axios.delete(`${API_URL}/${id}`);
              set((state) => ({ notes: state.notes.filter((note) => note._id !== id), isLoading: false }));
          } catch (error) {
              set({ error: error.response.data.message || "Error deleting note", isLoading: false });
              throw error;
          }
      },
  
      pinNote: async (id, isPinned) => {
          set({ isLoading: true, error: null });
          try {
              const response = await axios.put(`${API_URL}/${id}/pin`, { isPinned });
              set((state) => ({
                  notes: state.notes.map((note) => (note._id === id ? response.data.note : note)),
                  isLoading: false,
              }));
          } catch (error) {
              set({ error: error.response.data.message || "Error pinning note", isLoading: false });
              throw error;
          }
      },
  }));
