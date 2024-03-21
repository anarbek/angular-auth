import {Component, OnInit} from '@angular/core';
import { first } from 'rxjs/operators';
import {User} from "../models";
import {UserService} from "../user-services";


@Component({ templateUrl: 'user-list.component.html' })
export class UserListComponent implements OnInit {
    loading = false;
    users?: User[];

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });
    }
}
