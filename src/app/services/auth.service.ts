import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      })
    })
  }

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        this.afAuth.auth.signOut()
        resolve();
      }
      else{
        reject();
      }
    });
  }

  sendResetPassword(emailAddress) {
    return new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(emailAddress).then(() => {
        console.log('Email sent.')
        resolve()
      }).catch(function(error) {
        console.log('An error happened.', error)
      });
    });
  }

  handleResetPassword(newPassword, code) {
    return new Promise((resolve, reject) => {
      firebase.auth().confirmPasswordReset(code, newPassword).then(resp => {
        alert('New password has been saved');
      }).catch(e => {
        alert(e);
      });
    })
  }

}
