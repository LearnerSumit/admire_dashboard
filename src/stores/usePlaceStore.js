import axios from "axios";
import { create } from "zustand";
import { ENV } from "../constants/api";
import { toast } from "react-toastify"; // It's good practice to handle notifications here or return a status

export const usePlaceStore = create((set) => ({
  // --- Existing State ---
  itineraryPlaces: [],
  galleryPlaces: [],

  // --- New State for Terms and Conditions ---
  termsList: [], // To store the list of documents (e.g., [{_id, name}, ...])
  isListLoading: false, // To track loading state for the list
  isContentLoaded: false, // To track loading state for the content

  // --- Existing Actions ---
  fetchItineraryPlaces: async (travelType) => {
    try {
      const res = await axios.get(`${ENV.API_BASE_URL}/admin/destination/${travelType}`);
      set({ itineraryPlaces: res.data.places });
    } catch (error) {
      console.log("Error fetching itinerary places:", error);
      set({ itineraryPlaces: [] });
    }
  },

  fetchGalleryPlaces: async (travelType) => {
    try {
      const res = await axios.get(`${ENV.API_BASE_URL}/admin/destination/${travelType}`);
      set({ galleryPlaces: res.data.places });
    } catch (error) {
      console.log("Error fetching gallery places:", error);
      set({ galleryPlaces: [] });
    }
  },

  // --- New Actions for Terms and Conditions ---


  fetchTermsList: async (travelType) => {
    try {
      const res = await axios.get(`${ENV.API_BASE_URL}/admin/destination/${travelType}`);
      set({ termsList: res.data.places });
    } catch (error) {
      console.log("Error fetching gallery places:", error);
      set({ termsList: [] });
    }
  },
}));