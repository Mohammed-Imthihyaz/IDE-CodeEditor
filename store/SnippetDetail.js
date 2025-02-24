import axios from "axios";
import { create } from "zustand";
const API_URI ="http://localhost:3000/api/codes";
export const useSnippetDetail=create((set)=>({
  comments: [],
  error: null,
  message: null,
  isLoading: false,
  getSnippetById: async (snippetId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URI}/get-snippetById/${snippetId}`);
      set({ isLoading: false});
      return response.data.snippet;
    } catch (error) {
      set({ error: "Error fetching snippets", isLoading: false });
    }
  },
  getComments: async(snippetId)=>{
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URI}/get-comments/${snippetId}`);
      set({ isLoading: false, comments:response.data.comments || [] });
    } catch (error) {
      set({ error: "Error fetching snippets", isLoading: false });
    }
  },
  addComments: async (snippetId, comment) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URI}/add-comment/${snippetId}`, { content: comment });
      set((state) => ({
        isLoading: false,
        message: response.data.message,
        comments: [...state.comments, response.data.newComment],
      }));
    } catch (error) {
      set({ error: "Error adding comment", isLoading: false });
    }
  },  
  deleteComment: async (commentId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URI}/delete-comment/${commentId}`);
      set((state) => ({
        isLoading: false,
        comments: state.comments.filter((c) => c._id !== commentId),  
      }));
    } catch (error) {
      set({ error: "Error deleting comment", isLoading: false });
    }
  },
})); 