import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserService } from '../services/user.service';
import { User } from '../services/user.model';

@Injectable()
export class UserResolver implements Resolve<User> {

  constructor(public userService: UserService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot) : Promise<User> {

    let user = new User();

    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
      .then(res => {
        if(res.providerData[0].providerId == 'password'){
          user.image = 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png';
          user.email = res.email;
          user.uid = res.uid;
          user.provider = res.providerData[0].providerId;
          return resolve(user);
        }
        else{
          user.image = res.photoURL;
          user.email = res.email;
          user.provider = res.providerData[0].providerId;
          return resolve(user);
        }
      }, err => {
        this.router.navigate(['/login']);
        return reject(err);
      })
    })
  }
}