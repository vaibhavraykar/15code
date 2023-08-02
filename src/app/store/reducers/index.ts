import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { AppActionTypes } from "../actions/logout.action";

export interface IAppState { }

export const reducers: ActionReducerMap<IAppState> = {

};
export function clearState(reducer : ActionReducer<IAppState>) {
  return function (state : any, action : any) {

    if (action.type === AppActionTypes.LOGOUT) {
      state = undefined;
    }

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<IAppState>[] = !environment.production
  ? [clearState]
  : [clearState];
