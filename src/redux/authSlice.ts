import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  // Legacy fields for backward compatibility
  token: string | null;
  role: "admin" | "teacher" | "student" | null;
  user: any | null;

  // New segregated fields
  adminToken: string | null;
  adminRole: "admin" | null;
  adminUser: any | null;

  studentToken: string | null;
  studentRole: "student" | null;
  studentUser: any | null;

  teacherToken: string | null;
  teacherRole: "teacher" | null;
  teacherUser: any | null;
}

const initialState: AuthState = {
  token: null,
  role: null,
  user: null,

  adminToken: null,
  adminRole: null,
  adminUser: null,

  studentToken: null,
  studentRole: null,
  studentUser: null,

  teacherToken: null,
  teacherRole: null,
  teacherUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Legacy setAuth
    setAuth: (
      state,
      action: PayloadAction<{ token: string; role: AuthState["role"]; user?: any }>
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user || null;
    },
    // Legacy logout
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;
    },

    // Admin specific
    setAdminAuth: (
      state,
      action: PayloadAction<{ token: string; role: AuthState["adminRole"]; user?: any }>
    ) => {
      state.adminToken = action.payload.token;
      state.adminRole = action.payload.role;
      state.adminUser = action.payload.user || null;
    },
    logoutAdmin: (state) => {
      state.adminToken = null;
      state.adminRole = null;
      state.adminUser = null;
    },

    // Student specific
    setStudentAuth: (
      state,
      action: PayloadAction<{ token: string; role: AuthState["studentRole"]; user?: any }>
    ) => {
      state.studentToken = action.payload.token;
      state.studentRole = action.payload.role;
      state.studentUser = action.payload.user || null;
    },
    logoutStudent: (state) => {
      state.studentToken = null;
      state.studentRole = null;
      state.studentUser = null;
    },

    // Teacher specific
    setTeacherAuth: (
      state,
      action: PayloadAction<{ token: string; role: AuthState["teacherRole"]; user?: any }>
    ) => {
      state.teacherToken = action.payload.token;
      state.teacherRole = action.payload.role;
      state.teacherUser = action.payload.user || null;
    },
    logoutTeacher: (state) => {
      state.teacherToken = null;
      state.teacherRole = null;
      state.teacherUser = null;
    },
  },
});

export const {
  setAuth, logout,
  setAdminAuth, logoutAdmin,
  setStudentAuth, logoutStudent,
  setTeacherAuth, logoutTeacher
} = authSlice.actions;
export default authSlice.reducer;
