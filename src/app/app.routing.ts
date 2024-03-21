import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './user-list';
import { LoginComponent } from './login';
import { AuthGuard } from './auth';
import {HomeComponent} from "./home/home.component";
import {ForbiddenComponent} from "./forbidden/forbidden.component";

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'users', component: UserListComponent },
    { path: 'forbidden', component: ForbiddenComponent },

    // otherwise redirect to user-list
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);