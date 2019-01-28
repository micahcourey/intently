import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  errorMessage: any;
  successMessage: string;
  signupForm: FormGroup;
  apiLoginError;
  loggingIn: boolean;
  loginError: string;
  loggedIn: boolean;
  isError: boolean;
  user: any;

  constructor(private authService: AuthService, private router: Router) { 
    this.signupForm = new FormGroup({    
			email: new FormControl('', [ Validators.required, Validators.email ]),
			password: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
  }

  tryRegister(){
    this.authService.doRegister(this.signupForm.value)
    .then(res => {
      this.errorMessage = "";
      this.successMessage = "Your account has been successfully created";
      this.router.navigate(['/home']);

    }, err => {
      console.error(err);
      this.errorMessage = err.message;
      this.successMessage = "";
    })
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

}
