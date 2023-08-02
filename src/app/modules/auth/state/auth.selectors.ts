import * as AuthReducer from "./auth.reducers";
import { createSelector } from '@ngrx/store';
import { createFeatureSelector } from '@ngrx/store';

const selectAuthState = createFeatureSelector<AuthReducer.AuthState>('AUTH');

export const getAuthResult = createSelector(selectAuthState, (state) => {
    return {
        stateCollection : state
    }
})


export const getSendOTPResult = createSelector(selectAuthState, (state) => {
    return {
        stateCollection : state
    }
})

export const getPasscodeResult = createSelector(selectAuthState, (state) => {
    return {
        stateCollection : state
    }
})


