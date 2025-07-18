import axios from "axios";
import { create } from "zustand";

export const usePlaceStore = create((set) => ({
  itineraryPlaces: [],
  galleryPlaces: [],
  
  fetchItineraryPlaces: async (travelType) => {
    try {
      const res = await axios.get(`http://192.168.68.118:5000/admin/destination/${travelType}`);
      set({ itineraryPlaces: res.data.places });
    } catch (error) {
      console.log("Error fetching itinerary places:", error);
      set({ itineraryPlaces: [] });
    }
  },

  fetchGalleryPlaces: async (travelType) => {
    try {
      const res = await axios.get(`http://192.168.68.118:5000/admin/destination/${travelType}`);
      set({ galleryPlaces: res.data.places });
    } catch (error) {
      console.log("Error fetching gallery places:", error);
      set({ galleryPlaces: [] });
    }
  },
}));
