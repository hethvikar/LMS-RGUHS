import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { environment } from '../../../environments/environment';

// Auth
import * as fromAuth from './auth/auth.reducer';

// Feature state interface
export interface AppState {
  router: RouterReducerState;
  auth: fromAuth.AuthState;
}

// Action reducers
export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  auth: fromAuth.authReducer,
};

// Meta reducers
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];