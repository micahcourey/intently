import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, Validators, FormControl } from '@angular/forms'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material'
import { Router } from '@angular/router'
import { UserService } from '../services/user.service'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  apiLoginError;
  loggingIn: boolean;
  loginError: string;
  loggedIn: boolean;
  isError: boolean;
  user: any;

  constructor(private userService: UserService, private router: Router, private dialog: MatDialog, private authService: AuthService) { 
    this.loggingIn = false;
    this.loginError = "";
    this.loggedIn = false;
    this.isError = false;
		this.loginForm = new FormGroup({    
			email: new FormControl('', [ Validators.required, Validators.email ]),
			password: new FormControl('', [ ]),
    })
  }

  ngOnInit() {

  }

  tryLogin(){
    this.authService.doLogin(this.loginForm.value)
    .then(res => {
      this.router.navigate(['/home']);
    }, err => {
      console.error(err);
      this.isError = true;
      this.apiLoginError = err.message;
    })
  }

  resetPassword(email) {
    console.log(email)
    this.authService.sendResetPassword(email).then(() => {
      console.log('email sent')
    })
  }

  openResetPasswordDialog(): void {
    let data = {
      email: this.loginForm.get('email').value
    }
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
      width: '350px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === false) {
        return
      }
      this.resetPassword(result.email)
    });
  }

}

@Component({
  selector: 'reset-password-dialog',
  templateUrl: 'reset-password-dialog.component.html',
})
export class ResetPasswordDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
