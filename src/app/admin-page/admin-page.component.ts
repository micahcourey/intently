import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms'
import * as moment from 'moment'
import { UserService } from './../services/user.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';
import { User } from '../interfaces/user.interface'

@Component({
  selector: 'admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  user: User;
  userForm: FormGroup

  constructor(private _userService: UserService, private router: Router, public snackBar: MatSnackBar) { 
    // this.userForm = new FormGroup({    
    //   email: new FormControl('', [ Validators.required, Validators.email ]),
    //   username: new FormControl('', [ Validators.required ]),
    //   password: new FormControl('', [ Validators.required ]),
    //   realm: new FormControl('user', [ Validators.required ]),
    //   emailVerified: new FormControl(false, [])
    // })
  }

  ngOnInit() {
    // this.user = JSON.parse(localStorage.getItem('matrix_user'))
  }

  // logout() {
  //   this._userService.logout()
  //   this.router.navigate(['/'])
  // }

  // registerUser() {
  //   console.log(this.userForm.value)
  //   this._userService.registerUser(this.userForm.value).then((res) => {
  //     console.log('user created', res)
  //   }, (error) => {
  //     console.log('oops')
  //   })
  // }

}
