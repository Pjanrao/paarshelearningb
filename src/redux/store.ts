import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { api } from "./api";
import "./api/inquiryApi";
import "./api/collegeApi";
import "./api/studentApi";
import "./api/entranceTestApi";
import "./api/studentlogApi";
import "./api/teachersApi";
import "./api/blogApi";
import "./api/testimonialApi";
import "./api/reportsApi";
import "./api/placementApi";
import "./api/courseApi";
import "./api/categoryApi";
import "./api/subcategoryApi";
import "./api/paymentApi";
import "./api/meetingApi";
import "./api/batchApi";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
