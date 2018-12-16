import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatDatepicker} from '@angular/material/datepicker';
import { SubscriptionLike as ISubscription } from 'rxjs'
import * as moment from 'moment'
import { User } from 'src/app/interfaces/user.interface';
import { Task } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss'],
})
export class MatrixComponent implements OnInit {
  @Input() tasks: Array<Task>;
  @Input() user

  matrix: Array<any>;
  matrixColumns = ['day', 'task']
  selectedDate: FormControl
  dateSub: ISubscription
  dayArray: Array<any>
  currentMonth: string;
  
  constructor() { 
    this.selectedDate = new FormControl(new Date());
    this.dateSub = this.selectedDate.valueChanges.subscribe(() => {
      this.dayArray = this.getMonth(moment(this.selectedDate.value).get('month'), moment(this.selectedDate.value).get('year'))
      this.matrix = this.setMatrix(this.selectedDate.value)
    })
    this.dayArray = this.getMonth(moment().get('month'), moment().get('year'))
  }

  ngOnInit() {
    this.matrix = this.setMatrix(moment().format('YYYY-MM-DD'));
  }

  getMonth(month: number, year: number) {
    let days = []
    let daysInMonth = moment(month).daysInMonth()
    this.dayArray = []
    let i = 1
    while(daysInMonth) {
      let date = moment([year, month, i]).format("YYYY-MM-DD")
      let day = moment([year, month, i]).format("dddd, MMMM Do");
      let dayObj = {date: date, day: day}
      days.push(dayObj);
      i++
      daysInMonth--
    }
    return days
  }

  setMatrix(date) { 
    const matrix = []
    this.currentMonth = moment(date).format('MMMM') 
    this.dayArray.forEach((day) => {
      const userTasks: Array<Task> = this.tasks.filter(task => task.userId === this.user.uid)
      matrix.push({
        task: this.findTask(moment(day.date), userTasks),
        date: day.day,
      })
    })
    return matrix
  }

  findTask(day, tasks) {
    const task = tasks.find(t => moment(t.date).format('ll') === moment(day).format('ll'))
    if (!task) {
      return ''  
    }
    return task.body
  }

  chosenMonthHandler(evt) {
    this.dayArray = this.getMonth(moment(evt).get('month'), moment(evt).get('year'))
    this.matrix = this.setMatrix(evt)
  }

}
