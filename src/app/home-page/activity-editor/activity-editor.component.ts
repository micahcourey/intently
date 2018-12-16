import { Component, OnInit, ViewChild, NgZone, Input, Output, EventEmitter } from '@angular/core'
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatSnackBar} from '@angular/material';
import { SubscriptionLike as ISubscription } from 'rxjs'
import { debounceTime, take } from 'rxjs/operators'
import { FormGroup, Validators, FormControl } from '@angular/forms'
import * as moment from 'moment'
import { UserService } from '../../services/user.service'
import { Task } from '../../interfaces/task.interface'

@Component({
  selector: 'activity-editor',
  templateUrl: './activity-editor.component.html',
  styleUrls: ['./activity-editor.component.scss']
})
export class ActivityEditorComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize
  @Input() userTasks
  @Input() user
  @Output() update = new EventEmitter();

  todayForm: FormGroup
  tomorrowForm: FormGroup
  today: any
  yesterday: any
  tomorrow: any
  dateSub: ISubscription
  todaySub: ISubscription
  tomorrowSub: ISubscription
  yesterdaysTask
  tomorrowsTask
  todaysTask
  showForms: boolean
  todayError: boolean
  tomorrowError: boolean
  encouragingMessages: Array<string>

  constructor(private _userService: UserService, public snackBar: MatSnackBar, private ngZone: NgZone) {
    this.showForms = true
    this.todayError = false
    this.tomorrowError = false
    this.today = moment().format('MM-DD-YYYY')
    this.yesterday = this.setYesterday(this.today)
    this.tomorrow = this.setTomorrow(this.today)
    this.encouragingMessages = this.getEncouragingMessages()
    this.buildForms()
    this.buildSubscriptions()
  }

  ngOnInit() {
    if (this.userTasks && this.user) {
      this.yesterdaysTask = this.findTask(this.yesterday)
      this.todaysTask = this.findTask(this.today)
      this.tomorrowsTask = this.findTask(this.tomorrow)
      this.patchForms()
    }
  }

  buildForms() {
    this.todayForm = new FormGroup({    
      body: new FormControl('', []),
      date: new FormControl(new Date(), [])
    })
    this.tomorrowForm = new FormGroup({    
			body: new FormControl('', [])
    })
  }

  buildSubscriptions() {
    this.todaySub = this.todayForm.get('body').valueChanges.pipe(debounceTime(2000)).subscribe(() => {
      if (!this.todayForm.valid) {
        this.todayError = true
        return
      }
      this.todayError = false
      const task = {
        body: this.todayForm.get('body').value, 
        date: this.today, 
        userId: this.user.uid
      }
      const existingTask = this.findTask(this.today)
      if (existingTask) {
        this.patchTask(task, existingTask.id)
        return
      }
      this.postTask(task)
    })
    this.tomorrowSub = this.tomorrowForm.get('body').valueChanges.pipe(debounceTime(2000)).subscribe(() => {
      if (!this.tomorrowForm.valid) {
        this.tomorrowError = true
        return
      }
      this.tomorrowError = false
      const task = {
        body: this.tomorrowForm.get('body').value, 
        date: this.tomorrow.format('MM-DD-YYYY'), 
        userId: this.user.uid
      }
      const existingTask = this.findTask(this.tomorrow)
      if (existingTask) {
        this.patchTask(task, existingTask.id)
        return
      }
      this.postTask(task)
    })
    this.dateSub = this.todayForm.get('date').valueChanges.subscribe(() => {
      setTimeout(() => {
        this.showForms = false
        const selectedDate = this.todayForm.get('date').value
        let todayM = moment(selectedDate)
        this.today = moment(selectedDate).format('MM-DD-YYYY')
        this.yesterday = this.setYesterday(selectedDate)
        this.tomorrow = this.setTomorrow(selectedDate)
        if (todayM.diff(moment(), 'days') > -1) {
          this.showForms = true
        }
        if (this.userTasks) {
          this.yesterdaysTask = this.findTask(this.yesterday)
          this.todaysTask = this.findTask(this.today)
          this.tomorrowsTask = this.findTask(this.tomorrow)
        }
        this.patchForms()
      },1)
    })
  }

  setYesterday(today) {
    return moment(today).subtract(1, 'days')
  }

  setTomorrow(today) {
    return moment(today).add(1, 'days')
  }

  findTask(day) {
    const task = this.userTasks.find(t => moment(t.date, "MM-DD-YYYY").format('ll') === moment(day).format('ll'))
    if (!task) {
      return
    }
    return task
  }

  patchForms() {
    if (this.todaysTask) {
      this.todayForm.get('body').patchValue(this.todaysTask.body, {emitEvent: false})
    } else {
      this.todayForm.get('body').patchValue('', {emitEvent: false})
    }
    if (this.tomorrowsTask) {
      this.tomorrowForm.get('body').patchValue(this.tomorrowsTask.body, {emitEvent: false})
    } else {
      this.tomorrowForm.get('body').patchValue('', {emitEvent: false})
    }
  }

  postTask(task) {
    this._userService.postTask(task).then((res) => {
      this.update.emit()
      this.openSnackBar(this.generateMessage(), 'Saved')
    })
  }

  patchTask(task, taskId) {
    this._userService.patchTask(task, taskId).then((res: any) => {
      this.update.emit()
      const message = this.generateMessage()
      this.openSnackBar(message, 'Saved')
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    })
  }

  generateMessage() {
    const i = Math.floor(Math.random() * Math.floor(this.encouragingMessages.length))
    return this.encouragingMessages[i]
  } 

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  getEncouragingMessages() {
    return [
      "Wow you're really getting a lot done!",
      "Keep on crushing it!",
      "Another day another dollar.",
      "Great job, keep it up!"
    ]
  }

}
