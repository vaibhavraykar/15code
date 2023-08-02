import { Router } from '@angular/router';
import { NgModule, isDevMode, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomerComponent } from './modules/customer/customer.component';
import { AdminComponent } from './modules/admin/admin.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { appInitializer } from 'src/app/core/app.initializer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptor } from 'src/app/core/auth.interceptor';
import { ErrorHandlingInterceptor } from './core/error-handling.interceptor';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ComponentsModule } from './components/components.module';
import { TitleCasePipe } from '@angular/common';
import { OnlyNumbersDirective } from './common/directives/only-numbers.directive';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    CustomerComponent,
    OnlyNumbersDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    NgbModule,
    MatDialogModule,
    ComponentsModule
  ],
   providers: [
    TitleCasePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true
    },
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [AuthService],
      multi: true
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
