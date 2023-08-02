import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
    isAuthenticated: boolean;
    loginResponse: any | null;
    passcodeResponse: any | null;
    sendOtpEmailResponse : any | null;
    errorMessage: string | null;
}

const initialValues = {
    isAuthenticated: false,
    loginResponse: null,
    passcodeResponse: null,
    sendOtpEmailResponse:null,
    errorMessage: null,
}

export const initialAuthState : AuthState = {
    ...initialValues
}

export const authReducer = createReducer(
    initialAuthState,
    on(AuthActions.LOGINSUCCESS, (state, action) => {
        return {
            ...state,
            isAuthenticated: true,
            loginResponse: action.response,
        }
    }),    
    on(AuthActions.LOGINFAILURE, (state, action) => {
        return {
            ...state,
            isAuthenticated: false,
            errorMessage: action.error,
        }
    }),
    on(AuthActions.PASSCODESUCCESS, (state, action) => {
        return {
            ...state,
            isAuthenticated: true,
            passcodeResponse: action.response,
        }
    }),    
    on(AuthActions.PASSCODEFAILURE, (state, action) => {
        return {
            ...state,
            isAuthenticated: false,
            errorMessage: action.error,
        }
    }),
    on(AuthActions.OTPGENERATESUCCESS, (state, action) => {
        return {
            ...state,
            sendOtpEmailResponse: action.response,
        }
    }),    
    on(AuthActions.OTPGENERATEFAILURE, (state, action) => {
        return {
            ...state,
            errorMessage: action.error,
        }
    }),
    on(AuthActions.clearState, state => {
        return {
            ...initialAuthState
        }
    })



);