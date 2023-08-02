import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  handleError(error: any): void {
    const chunkFailedMessage = /Loading chunk/;
     if (chunkFailedMessage.test(error.message)) {
       window.location.reload();
     }
     console.error(error);
   }
}
