import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import {asyncScheduler, Observable, of, scheduled, throwError} from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import {User} from "../models";

const users: User[] = [
    {
        id: 1,
        username: 'test',
        password: 'test',
        firstName: 'Mock',
        lastName: 'User',
        authorities: ['CAN_TEST']
    },
    {
        id: 2,
        username: 'user',
        password: 'user',
        firstName: 'Mock',
        lastName: 'Userskiy',
        authorities: ['CAN_LIST_USERS','CAN_USE']
    }
];

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call

        //return handleRoute();
        return scheduled(of(null), asyncScheduler)
            .pipe(mergeMap(handleRoute))
            .pipe(delay(1000))

        function handleRoute() {
            console.log('currUrl:', url);
            if (url.endsWith('/authenticate') && method === 'POST')
                return authenticate();
            else if (url.endsWith('/users') && method === 'GET') {
                console.log('users');
                return getUsers();
            }
            else if (url.endsWith('/testapp') && method === 'GET') {
                console.log('handle test');
                return getTest();
            }
            else {
                // pass through any requests not handled above
                return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user =
                users.find(x =>
                    x.username === username && x.password === password);
            if (!user) {
                return error('Username or password is incorrect');
            }
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: user.username,
            });
        }

        function getUsers() {
            if (!isLoggedIn()) {
                return unauthorized();
            }
            if (!isAuthorized('CAN_LIST_USERS')) {
                return forbidden();
            }
            return ok(users);
        }

        function getTest() {
            if (!isLoggedIn()) {
                return unauthorized();
            }
            console.log('here!');
            if (!isAuthorized('CAN_TEST')) {
                return forbidden();
            }
            return ok(users);
        }

        // helper functions

        function ok(body: any) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function error(message: any) {
            return throwError(() => ({ error: { message } }));
        }

        function unauthorized() {
            return throwError(() => ({ status: 401, error: { message: 'Unauthorised' } }));
        }

        function forbidden() {
            return throwError(() => ({ status: 403, error: { message: 'Forbidden' } }));
        }

        function isLoggedIn() {
            return headers.get('Authorization');
        }

        function isAuthorized(authority: string): boolean {
            let auth = headers.get('Authorization');
            if (auth) {
                let username = auth.split(' ')[1];
                let user = users.find(x => x.username === username);
                if (user && user.authorities) {
                    return user.authorities.includes(authority);
                }
            }
            return false;
        }
    }
}

export let mockBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: MockBackendInterceptor,
    multi: true
};
