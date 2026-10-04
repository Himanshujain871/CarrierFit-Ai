import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Async Thunk: Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password, targetJobTitle }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/register', {
        name,
        email,
        password,
        targetJobTitle,
      });
      if (response.data.success && response.data.token) {
        localStorage.setItem('careerfit_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

// Async Thunk: Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.data.success && response.data.token) {
        localStorage.setItem('careerfit_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Login failed. Please check credentials.';
      return rejectWithValue(message);
    }
  }
);

// Async Thunk: Fetch Current User Profile
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('careerfit_token');
      if (!token) {
        return null;
      }
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      localStorage.removeItem('careerfit_token');
      const message = error.response?.data?.message || 'Session expired. Please log in again.';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('careerfit_token') || null,
  loading: !!localStorage.getItem('careerfit_token'),
  actionLoading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthSuccess: (state) => {
      state.successMessage = null;
    },
    logout: (state) => {
      localStorage.removeItem('careerfit_token');
      state.user = null;
      state.token = null;
      state.loading = false;
      state.actionLoading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.successMessage = action.payload.message || 'Account created successfully!';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.successMessage = action.payload.message || 'Logged in successfully!';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // Fetch Current User
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user) {
          state.user = action.payload.user;
        } else {
          state.user = null;
          state.token = null;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearAuthError, clearAuthSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
