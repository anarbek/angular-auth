﻿import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { MockBackendInterceptor, mockBackendProvider } from './auth';

import { AppComponent } from './app.component';
import { appRoutingModule } from './app.routing';

import { JwtInterceptor, ErrorInterceptor } from './auth';
import { UserListComponent } from './user-list';
import { LoginComponent } from './login';
import { HomeComponent } from './home/home.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { LoggerInterceptor } from './auth/logger.interceptor';
import { TestAppComponent } from './test/test-app.component';

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        appRoutingModule
    ],
    declarations: [
        AppComponent,
        UserListComponent,
        TestAppComponent,
        LoginComponent,
        HomeComponent,
        ForbiddenComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoggerInterceptor, multi: true },        

        // provider used to create mock backend
        mockBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
