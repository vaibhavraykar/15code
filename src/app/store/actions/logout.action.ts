import { Action } from "@ngrx/store";
export class AppActionTypes {
    static LOGOUT = "[App] logout";
  }

export class Logout implements Action {
  readonly type = AppActionTypes.LOGOUT;
}

export type All = Logout;