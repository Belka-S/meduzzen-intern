import * as API from 'api/userApi';
import axios from 'axios';
import { store } from 'store';
import { createAppAsyncThunk } from 'store';
import { TUser } from 'store/user';

export const getAllUsersThunk = createAppAsyncThunk(
  'users/getAll',
  async (params: API.TParams, thunkAPI) => {
    const { access_token } = store.getState().auth.user;
    try {
      if (access_token) {
        return await API.getAllUsers(access_token, params);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
    }
  },
);

export const getUserThunk = createAppAsyncThunk(
  'users/get',
  async (id: number, thunkAPI) => {
    const { access_token } = store.getState().auth.user;
    try {
      if (access_token) {
        return await API.getUser(access_token, id);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
    }
  },
);

export const deleteUserThunk = createAppAsyncThunk(
  'users/delete',
  async (id: number, thunkAPI) => {
    const { access_token } = store.getState().auth.user;
    try {
      if (access_token) {
        return await API.deleteUser(access_token, id);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
    }
  },
);

export const updateUserInfoThunk = createAppAsyncThunk(
  'users/updateInfo',
  async (user: Partial<TUser>, thunkAPI) => {
    const { access_token } = store.getState().auth.user;
    try {
      if (access_token) {
        return await API.updateUserInfo(access_token, user);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
    }
  },
);

export const updatePasswordThunk = createAppAsyncThunk(
  'users/updatePassword',
  async (user: Partial<TUser>, thunkAPI) => {
    const { access_token } = store.getState().auth.user;
    try {
      if (access_token) {
        return await API.updatePassword(access_token, user);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
    }
  },
);

export const updateAvatarThunk = createAppAsyncThunk(
  'users/updateAvatar',
  async (formData: FormData, thunkAPI) => {
    const { access_token } = store.getState().auth.user;
    const { user_id } = store.getState().auth.user;
    try {
      if (access_token && user_id) {
        return await API.updateAvatar(access_token, user_id, formData);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data);
      }
    }
  },
);