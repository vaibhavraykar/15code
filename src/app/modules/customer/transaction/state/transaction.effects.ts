import { Injectable } from '@angular/core';
import { Observable, of as observableOf} from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TransactionActions from './transaction.actions';

@Injectable()
export class TransactionEffect {
    constructor(
        private actions$ : Actions,
        ){ }

}