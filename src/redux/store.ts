import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { api } from "./api";
import { dashboardApi } from "./api/dashboardApi";

import {
  persistStore,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// keep your side-effect imports (NO CHANGE)
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

// ✅ combine reducers (NO API CHANGE)
const rootReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
});

// ✅ persist ONLY auth (SAFE)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // ONLY auth will persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(api.middleware)
      .concat(dashboardApi.middleware),
});

// ✅ export persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./authSlice";
// import { api } from "./api";
// import { dashboardApi } from "./api/dashboardApi"; // ✅ IMPORTANT

// // keep your side-effect imports
// import "./api/inquiryApi";
// import "./api/collegeApi";
// import "./api/studentApi";
// import "./api/entranceTestApi";
// import "./api/studentlogApi";
// import "./api/teachersApi";
// import "./api/blogApi";
// import "./api/testimonialApi";
// import "./api/reportsApi";
// import "./api/placementApi";
// import "./api/courseApi";
// import "./api/categoryApi";
// import "./api/subcategoryApi";
// import "./api/paymentApi";
// import "./api/meetingApi";
// import "./api/batchApi";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,

//     // ✅ main api
//     [api.reducerPath]: api.reducer,

//     // ✅ dashboard api
//     [dashboardApi.reducerPath]: dashboardApi.reducer,
//   },

//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     })
//       .concat(api.middleware)
//       .concat(dashboardApi.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;