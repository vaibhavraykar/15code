import { createReducer, on } from '@ngrx/store';
import * as TransactionActions from './transaction.actions';

export interface TransactionState {
    ActiveTransactions: any | null;
    PreviousTransactions: any | null;
    SavedTransactions: any | null;
    NewTransactions: any | null;
    errorMessage: string | null;
}

const initialValues = {
    ActiveTransactions: null,
    PreviousTransactions: null,
    SavedTransactions: null,
    NewTransactions: null,
    errorMessage: null,
}

export const initialTransactionState : TransactionState = {
    ...initialValues
}

export const transactionReducer = createReducer(
    initialTransactionState,
    on(TransactionActions.GetActiveTransactionSuccess, (state, action) => {
        return {
            ...state,
            ActiveTransactions: action.response,
        }
    }),    
    on(TransactionActions.GetActiveTransactionFailure, (state, action) => {
        return {
            ...state,
            errorMessage: action.error,
        }
    }),
    
    on(TransactionActions.GetPreviousTransactionSuccess, (state, action) => {
        return {
            ...state,
            PreviousTransactions: action.response,
        }
    }),    
    on(TransactionActions.GetPreviousTransactionFailure, (state, action) => {
        return {
            ...state,
            errorMessage: action.error,
        }
    }),
    
    on(TransactionActions.GetSavedTransactionSuccess, (state, action) => {
        return {
            ...state,
            SavedTransactions: action.response,
        }
    }),    
    on(TransactionActions.GetSavedTransactionFailure, (state, action) => {
        return {
            ...state,
            errorMessage: action.error,
        }
    }),
    
    on(TransactionActions.GetNewTransactionSuccess, (state, action) => {
        return {
            ...state,
            NewTransactions: action.response,
        }
    }),    
    on(TransactionActions.GetNewTransactionFailure, (state, action) => {
        return {
            ...state,
            errorMessage: action.error,
        }
    })



);