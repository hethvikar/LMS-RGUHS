import { createAction, props } from '@ngrx/store';
import { User } from './auth.reducer';

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string; role?: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Register
export const register = createAction(
  '[Auth] Register',
  props<{ email: string; password: string; firstName: string; lastName: string; role: string }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success'
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Logout
export const logout = createAction('[Auth] Logout');

// Load User
export const loadUser = createAction('[Auth] Load User');

export const loadUserSuccess = createAction(
  '[Auth] Load User Success',
  props<{ user: User }>()
);

export const loadUserFailure = createAction(
  '[Auth] Load User Failure',
  props<{ error: string }>()
);

// Change Password
export const changePassword = createAction(
  '[Auth] Change Password',
  props<{ oldPassword: string; newPassword: string }>()
);

export const changePasswordSuccess = createAction(
  '[Auth] Change Password Success'
);

export const changePasswordFailure = createAction(
  '[Auth] Change Password Failure',
  props<{ error: string }>()
);