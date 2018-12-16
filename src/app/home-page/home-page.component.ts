import { Component, OnInit, NgZone } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import {MatSnackBar} from '@angular/material'
import { UserService } from './../services/user.service'
import { AuthService } from './../services/auth.service'
import { User } from '../services/user.model'
import { Task } from '../interfaces/task.interface'
import { Goal } from '../interfaces/goal.interface'
import * as moment from 'moment'

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  user: User = new User()
  users: Array<User>
  userTasks: Array<Task>
  allTasks: Array<Task>
  userGoals: Array<Goal>
  allGoals: Array<Goal>
  isAdmin = false

  constructor(
    private userService: UserService, 
    private authService: AuthService,
    private router: Router, 
    private route: ActivatedRoute,
    public snackBar: MatSnackBar, 
    private ngZone: NgZone
  ) { 
    this.allTasks = new Array<Task>();
    this.allGoals = new Array<Goal>();
  }

  ngOnInit() {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
      }
    })
    this.getTasks()
    this.getGoals()
  }

  getTasks() {
    this.userService.getTasks(this.user.uid).then((tasks: Array<any>) => {
      this.userTasks = tasks;
    }, (error) => {
      console.error(error)
    })
  }

  getGoals() {
    this.userService.getGoals(this.user.uid).then((goals: Array<any>) => {
      this.userGoals = goals
    }, (error) => {
      console.error(error)
    })
  }

  logout() {
    this.authService.doLogout()
    this.router.navigate(['/'])
  }

}
