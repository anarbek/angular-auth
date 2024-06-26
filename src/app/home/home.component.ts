import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../user-services";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  get username() {
    return this.authService.currentUserValue?.username
  }

}
