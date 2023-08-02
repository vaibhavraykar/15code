import { Injectable, Optional } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonPopupComponent } from '../components/common-popup/common-popup.component';
import { DialogRef } from '@angular/cdk/dialog';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AdminV2CommonPopupErrorComponent } from '../components/adminv2-common-popup-error/adminv2-common-popup-error.component';

@Injectable()
export class ErrorHandlingInterceptor  implements HttpInterceptor {

  dialogRef : any;
  constructor(private dialog: MatDialog, private authService : AuthService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request)
          .pipe(
              catchError((error: HttpErrorResponse) => {
                  let errorMsg = '';
                  let errors = [];
                  if(error)
                  {
                    if ( error.status === 0) {
                        this.authService.appLogout();
                      }
                      else
                      {
                        if(error.error.message)
                        {
                            errorMsg = error.error.message
                            errors = error.error.errors;
                        }
                        else{
                            errorMsg = `Something went wrong. Please try again.`;
                        }

                        this.dialogRef?.close();
                        if (window.location.href.indexOf('/adminv2/') > -1) {
                          this.dialogRef = this.dialog.open(
                            AdminV2CommonPopupErrorComponent,
                            {
                              width: '500px',
                              height: 'auto',
                              data: {
                                title: 'isErrorMsg',
                                message: errorMsg,
                                errorList: errors,
                              },
                            }
                          );
                        } else {
                          this.dialogRef = this.dialog.open(
                            CommonPopupComponent,
                            {
                              width: '500px',
                              height: 'auto',
                              data: {
                                title: 'isErrorMsg',
                                message: errorMsg,
                                errorList: errors,
                              },
                            }
                          );
                        }




                      }

                  }

                  return throwError(error);
              })
          )
  }

}
