import { Component, OnInit } from '@angular/core';
import { TestService } from '../user-services/test.service';
import { User } from '../models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-test',  
  templateUrl: './test-app.component.html'
})
export class TestAppComponent implements OnInit  {
  loading = false;
    users?: User[];

    constructor(private testService: TestService) { }
  ngOnInit(): void {
    this.loading = true;
    this.testService.getAll().pipe(first()).subscribe(users => {
      this.loading = false;
      this.users = users;
  });
  }

}
