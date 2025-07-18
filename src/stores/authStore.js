import { create } from 'zustand';
import axios from 'axios';
import { ENV } from '../constants/api';
import { toast } from 'react-toastify';

// Get auth state from localStorage if available
const savedAuth = JSON.parse(localStorage.getItem('auth')) || {
  isLoggedIn: false,
  token: null,
  role: null,
  username: null,
};

const useAuthStore = create((set) => ({
  isLoggedIn: savedAuth.isLoggedIn,
  role: savedAuth.role,
  username: savedAuth.username,
  loading: false,
  error: null,

  login: async (data) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(
        `${ENV.API_BASE_URL}/admin/admin-login`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      const { role, username, msg,token } = response.data;

      // Save to Zustand state
      set({
        isLoggedIn: true,
        role,
        token,
        username,
        loading: false,
        error: null,
      });

      // Persist to localStorage
      localStorage.setItem(
        'auth',
        JSON.stringify({
          isLoggedIn: true,
          role,
          username,
          token
        })
      );

      toast.success(msg || 'Login Successful');

      return true;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        'Login failed';

      set({ error: errMsg, loading: false });
      toast.error(errMsg);
    }
  },

  logout: () => {
    // Clear from localStorage
    localStorage.removeItem('auth');

    // Clear Zustand state
    set({
      isLoggedIn: false,
      role: null,
      username: null,
      error: null,
    });

    toast.success('Logged out successfully');
  },
}));

export default useAuthStore;
