import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "./authService";

interface IState {
  user: any;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

interface IUserData {
  username: string;
  email: string;
  password: string;
}

interface ILoginData {
  username: string;
  password: string;
}

//Register new user
export const register = createAsyncThunk<any, IUserData>(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Login user
export const login = createAsyncThunk<any, ILoginData>(
  "auth/login",
  async (user, thunkAPI) => {
    try {
      return await authService.login(user);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

//Fetch user
export const fetchUser = createAsyncThunk<void>(
  "auth/fetchUser",
  async (_: any, thunkAPI) => {
    try {
      return await authService.fetchUser();
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const user = localStorage.getItem("user");

const initialState: IState = {
  user: user ? JSON.parse(user) : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.user = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        throw Error(action.payload);
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        throw new Error(action.payload);
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isSuccess = false;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
