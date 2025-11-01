import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student' | 'company';
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error
  })),

  // Register
  on(AuthActions.register, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.registerSuccess, state => ({
    ...state,
    loading: false,
    error: null
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Logout
  on(AuthActions.logout, () => initialState),

  // Load User
  on(AuthActions.loadUser, state => ({
    ...state,
    loading: true
  })),

  on(AuthActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false
  })),

  on(AuthActions.loadUserFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error
  }))
);

// Selectors
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../index';

export const selectAuthState = createFeatureSelector<AppState, AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);