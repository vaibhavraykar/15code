import { createAction, props } from '@ngrx/store';

const TRANSACTION : string = 'TRANSACTION';

export const GetActiveTransaction = createAction(`${TRANSACTION} Get Active Transaction`,(payload: any = {}) => payload);
export const GetActiveTransactionSuccess = createAction(`${TRANSACTION} Get Active Transaction Success`, 
                                                        props<{response : any}>());
export const GetActiveTransactionFailure = createAction(`${TRANSACTION} Get Active Transaction Failure`, 
                                                        props<{error : any}>());
                                                        
export const GetPreviousTransaction = createAction(`${TRANSACTION} Get Previous Transaction`,(payload: any = {}) => payload);
export const GetPreviousTransactionSuccess = createAction(`${TRANSACTION} Get Previous Transaction Success`, 
                                                        props<{response : any}>());
export const GetPreviousTransactionFailure = createAction(`${TRANSACTION} Get Previous Transaction Failure`, 
                                                        props<{error : any}>());
                                                        
export const GetSavedTransaction = createAction(`${TRANSACTION} Get Saved Transaction`,(payload: any = {}) => payload);
export const GetSavedTransactionSuccess = createAction(`${TRANSACTION} Get Saved Transaction Success`, 
                                                        props<{response : any}>());
export const GetSavedTransactionFailure = createAction(`${TRANSACTION} Get Saved Transaction Failure`, 
                                                        props<{error : any}>());
                                                        
export const GetNewTransaction = createAction(`${TRANSACTION} Get New Transaction`,(payload: any = {}) => payload);
export const GetNewTransactionSuccess = createAction(`${TRANSACTION} Get New Transaction Success`, 
                                                        props<{response : any}>());
export const GetNewTransactionFailure = createAction(`${TRANSACTION} Get New Transaction Failure`, 
                                                        props<{error : any}>());