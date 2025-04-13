import axios from "axios";
import type { Category, GalleryImage, ImageMetadata } from "./types";
import { API_URL } from "./config";
import { useAuth } from "./auth";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to handle API responses
const handleResponse = async <T>(response: any): Promise<T> => {
  if (response.status >= 400) {
    throw new Error(response.data?.message || "An error occurred");
  }
  return response.data;
};

// Photo API functions
export const photoApi = {
  // Get all photos
  getAllPhotos: async () => {
    try {
      console.log("Fetching all photos");
      const response = await api.get("/photos");
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching all photos:", error);
      throw error;
    }
  },

  // Get photos by category
  getPhotosByCategory: async (category: string) => {
    try {
      const response = await api.get(`/photos?category=${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching photos for category ${category}:`, error);
      throw error;
    }
  },

  // Get photo by ID
  getPhotoById: async (id: string) => {
    try {
      console.log(`Fetching photo with ID: ${id}`);
      const response = await api.get(`/photos/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching photo ${id}:`, error);
      throw error;
    }
  },

  // Upload new photo
  uploadPhoto: async (formData: FormData) => {
    try {
      console.log("Uploading photo...");
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await api.post("/photos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Photo uploaded successfully:", response);
      return handleResponse(response);
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    }
  },

  // Update photo
  updatePhoto: async (id: string, data: Partial<ImageMetadata>) => {
    try {
      console.log(`Updating photo ${id}`);
      const response = await api.patch(`/photos/${id}`, data);
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating photo ${id}:`, error);
      throw error;
    }
  },

  // Delete photo
  deletePhoto: async (id: string) => {
    try {
      console.log(`Deleting photo ${id}`);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await api.delete(`/photos/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting photo ${id}:`, error);
      throw error;
    }
  },
};
