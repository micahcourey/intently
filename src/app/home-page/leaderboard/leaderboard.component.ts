import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { Task } from 'src/app/interfaces/task.interface';
import * as moment from 'moment'

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  @Input() tasks: Array<Task>;
  @Input() users: Array<User>;

  leaderboard: Array<any>;
  startDate: any;
  year: any;
  dayCount: number
  leaderboardCols = ['ranking', 'name', 'count', 'progress']

  constructor() { 
    if (moment().month() === 11) {
      this.year = moment().get('year')
    } else {
      this.year = moment().get('year') - 1
    }

    this.startDate = moment([this.year, 11, 1])
 
    this.dayCount = moment().diff(this.startDate, 'days')

  }

  ngOnInit() {
    this.leaderboard = this.setLeaderboard(this.users);
  }

  setLeaderboard(users) { 
    const leaderboard = []   
    users.forEach((user: User, i) => {
      const userTasks: Array<Task> = this.tasks.filter(task => task.userId === user.id)
      leaderboard.push({
        username: user.username,
        count: userTasks.length,
        progress: (userTasks.length / this.dayCount).toFixed(2)
      })
    })
    leaderboard.sort((a,b) => {
      return b.count - a.count
    })
    return leaderboard
  }



}
