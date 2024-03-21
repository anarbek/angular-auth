import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import {User} from "../models";
import {environment} from "../../environments/environment";

export type UserOptional = User|null;

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject?: BehaviorSubject<UserOptional>;
    public currentUser?: Observable<UserOptional>;

    constructor(private http: HttpClient) {
      let currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        this.currentUserSubject = new BehaviorSubject<User|null>(
          JSON.parse(currentUser));
        this.currentUser = this.currentUserSubject.asObservable();
      } else {
          this.currentUserSubject = new BehaviorSubject<User|null>(null);
          this.currentUser = this.currentUserSubject.asObservable();
      }
    }

    public get currentUserValue(): UserOptional {
        return this.currentUserSubject ? this.currentUserSubject.value : null;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/authenticate`,
            { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject?.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject?.next(null);
    }
}
