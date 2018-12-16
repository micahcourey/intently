import { Component, OnChanges } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnChanges {

  constructor(private _userService: UserService) {

  }

  ngOnChanges() {

  }

}
