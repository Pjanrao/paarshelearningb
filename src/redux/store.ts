import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { api } from "./api";
import { dashboardApi } from "./api/dashboardApi"; // ✅ IMPORTANT

// keep your side-effect imports
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

    // ✅ main api
    [api.reducerPath]: api.reducer,

    // ✅ dashboard api
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(api.middleware)
      .concat(dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;