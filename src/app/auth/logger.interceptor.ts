import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthenticationService} from "../user-services";
import {Router} from "@angular/router";

@Injectable()
export class LoggerInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`Current URL: ${request.url}`);
        let currentDate = new Date();
        console.log(`Current DateTime: ${currentDate}`);
        return next.handle(request);
    }
}
