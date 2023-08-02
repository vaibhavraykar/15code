import { createAction, props } from '@ngrx/store';

const AUTH : string = 'AUTH';

export const LOGIN = createAction(`${AUTH} LOGIN`,(payload: any = {}) => payload);
export const LOGINSUCCESS = createAction(`${AUTH} LOGIN SUCCESS`, 
                                                        props<{response : any}>());
export const LOGINFAILURE = createAction(`${AUTH} LOGIN FAILURE`, 
                                                        props<{error : any}>());
                                                        
export const PASSCODELOGIN = createAction(`${AUTH} PASSCODELOGIN`,(payload: any = {}) => payload);
export const PASSCODESUCCESS = createAction(`${AUTH} PASSCODE SUCCESS`, 
                                                        props<{response : any}>());
export const PASSCODEFAILURE = createAction(`${AUTH} PASSCODE FAILURE`, 
                                                        props<{error : any}>());


export const OTPGENERATELOGIN = createAction(`${AUTH} OTPGENERATELOGIN`,(payload: any = {}) => payload);
export const OTPGENERATESUCCESS = createAction(`${AUTH} OTPGENERATE SUCCESS`, 
                                                        props<{response : any}>());
export const OTPGENERATEFAILURE = createAction(`${AUTH} OTPGENERATE FAILURE`, 
                                                        props<{error : any}>());                                                     

export const clearState = createAction(`${AUTH} Clear AUTH State`);