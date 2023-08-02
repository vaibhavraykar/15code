import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';
import { LoaderService } from '../services/loader.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(private authService : AuthService,
    private loadingService:LoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this.requestToExclude(request.url)){

      this.loadingService.setLoading(true);
      const token = localStorage.getItem('accessToken');

        if (token) {
          // If we have a token, we set it to the header
          request = request.clone({
              setHeaders: {Authorization: `Bearer ${token}`}
          });
        }
        console.log("Entering next ")
        return next.handle(request).pipe( tap(() => {
        },
        (err: any) => {

          if (err instanceof HttpErrorResponse) {

              if (err.status === 401 ||  err.status === 0) {
                console.log('Printing from 401 Error')
                this.authService.appLogout(request.url);
              }
              else{
                console.log("printing from 401 else")
                return;
              }

          }
        }
      ),
      finalize(() => this.loadingService.setLoading(false)),);
    }
    console.log("Printing from outside the if staement")
    return next.handle(request);
  }

  requestToExclude(resquestedUrl : any)
  {
    if(resquestedUrl.indexOf('master/token') > 0||resquestedUrl.indexOf('country/all/names') > 0||resquestedUrl.indexOf('goods/all') > 0){
      console.log("printing from rxclude true part")
      return true;
    }
    else{
      console.log("printing from rxclude elsee part")
      return false;
    }

  }

}
