import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as TransactionSelectors from './transaction.selectors';
import * as TransactionActions from './transaction.actions';
import { Router } from '@angular/router';

@Injectable()
export class TransactionFacadeService {
    getActiveResult$ = this.store.select(TransactionSelectors.getActiveResult);
    getPreviousResult$ = this.store.select(TransactionSelectors.getPreviousResult);
    getSavedResult$ = this.store.select(TransactionSelectors.getSavedResult);
    getNewResult$ = this.store.select(TransactionSelectors.getNewResult);
    
    constructor(private store : Store) {        
    }


}