import * as TransactionReducer from "./transaction.reducers";
import { createSelector } from '@ngrx/store';
import { createFeatureSelector } from '@ngrx/store';

const selectTransactionState = createFeatureSelector<TransactionReducer.TransactionState>('TRANSACTION')

export const getActiveResult = createSelector(selectTransactionState, (state) => {
    return {
        activeTransactions : state.ActiveTransactions
    }
})

export const getPreviousResult = createSelector(selectTransactionState, (state) => {
    return {
        previousTransactions : state.PreviousTransactions
    }
})

export const getSavedResult = createSelector(selectTransactionState, (state) => {
    return {
        savedTransactions : state.SavedTransactions
    }
})

export const getNewResult = createSelector(selectTransactionState, (state) => {
    return {
        newTransactions : state.NewTransactions
    }
})