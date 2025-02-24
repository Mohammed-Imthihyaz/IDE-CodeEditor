import axios from "axios";
import { create } from "zustand";

const API_URI = import.meta.env.VITE_API_URI;
export const UseSnippetStore = create((set) => ({
  snippets: [],
  starredSnippets: [],
  error: null,
  message: null,
  isLoading: false,
  searchQuery: "",
  selectedLanguage: null,
  fetchSnippets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URI}/get-snippets`);
      set({ isLoading: false, snippets: response.data.data });
    } catch (error) {
      set({ error: "Error fetching snippets", isLoading: false });
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedLanguage: (language) =>
    set((state) => ({
      selectedLanguage: state.selectedLanguage === language ? null : language,
    })),
    deleteSnippet:async(snippetId)=>{
      set({isLoading:true,error:null});
      try {
        const response =await axios.delete(`${API_URI}/delete-Snippet/${snippetId}`);
        set ({isLoading:false,message:response.data.message});
      } catch (error) {
        set({ error: "Failed to delete", isLoading: false});
      }
      return;
    },
    isSnippetStarred: async (snippetId) => {
      try {
        const response = await axios.get(`${API_URI}/is-starred/${snippetId}`);
        return response.data.isStarred;
      } catch (error) {
        console.error("Failed to check if snippet is starred:", error);
        return false;
      }
    },
    getStarCount: async (snippetId) => {
      try {
        const response = await axios.get(`${API_URI}/get-StarCount/${snippetId}`);
        return response.data.starCount;
      } catch (error) {
        console.error("Failed to get star count:", error);
        return 0;
      }
    },
    starSnippet: async (snippetId) => {
      try {
        const response = await axios.post(`${API_URI}/Star/${snippetId}`);
        return response.data.message;
      } catch (error) {
        console.error("Failed to star snippet:", error);
      }
    },
    fetchStarredSnippets: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.get(`${API_URI}/get-starsnippets`);
        set({ isLoading: false, starredSnippets: response.data.data });
      } catch (error) {
        set({ error: "Error fetching starred snippets", isLoading: false });
      }
    },
  }));
