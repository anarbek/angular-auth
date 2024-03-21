import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {AuthenticationService, UserOptional} from './user-services';
import { User } from './models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: UserOptional = null;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser?.subscribe(x =>
          this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
