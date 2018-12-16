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
      duration: 4000,
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
      '“The little things? The little moments? They aren’t little.” – Jon Kabat-Zinn',
      '“Wherever you go, there you are.” – Jon Kabat-Zinn',
      '“Mindfulness is a way of befriending ourselves and our experience.” – Jon Kabat-Zinn',
      '“The best way to capture moments is to pay attention. This is how we cultivate mindfulness.” – Jon Kabat-Zinn',
      '“Mindfulness means being awake. It means knowing what you are doing.” – Jon Kabat-Zinn',
      '“To think in terms of either pessimism or optimism oversimplifies the truth. The problem is to see reality as it is.” – Thích Nhất Hạnh',
      '“Many people are alive but don’t touch the miracle of being alive.” – Thích Nhất Hạnh',
      '“The present moment is the only time over which we have dominion.” – Thích Nhất Hạnh',
      '“Live the actual moment. Only this actual moment is life.” – Thích Nhất Hạnh',
      '“The feeling that any task is a nuisance will soon disappear if it is done in mindfulness.” – Thích Nhất Hạnh',
      '“When we get too caught up in the busyness of the world, we lose connection with one another – and ourselves.” – Jack Kornfield',
      '“Wisdom says we are nothing. Love says we are everything. Between these two our life flows.” – Jack Kornfield',
      '“The things that matter most in our lives are not fantastic or grand. They are moments when we touch one another.” – Jack Kornfield',
      '“Much of spiritual life is self-acceptance, maybe all of it.” – Jack Kornfield',
      '“Fear is a natural reaction to moving closer to the truth.” – Pema Chödrön',
      '“Nothing ever goes away until it has taught us what we need to know.” – Pema Chödrön',
      '“The essence of bravery is being without self-deception.” – Pema Chödrön',
      '“Rejoicing in ordinary things is not sentimental or trite. It actually takes guts.” – Pema Chödrön',
      '“Mindfulness isn’t difficult, we just need to remember to do it.” – Sharon Salzberg',
      '“That’s life: starting over, one breath at a time.” – Sharon Salzberg',
      '“You cannot control the results, only your actions.” – Allan Lokos',
      '“Don’t believe everything you think. Thoughts are just that – thoughts.” – Allan Lokos',
      '“Your actions are your only true belongings.” – Allan Lokos',
      '“What would it be like if I could accept life – accept this moment – exactly as it is?” – Tara Brach',
      '“If you want to conquer the anxiety of life, live in the moment, live in the breath.” – Amit Ray',
      '“Looking at beauty in the world, is the first step of purifying the mind.” – Amit Ray',
      '“A few simple tips for life: feet on the ground, head to the skies, heart open…quiet mind.” – Rasheed Ogunlaru',
      '“You only lose what you cling to.” – Buddha',
      '“Peace comes from within. Do not seek it without.” – Buddha',
      '“Three things can not hide for long: the Moon, the Sun and the Truth.” – Buddha',
      '“Nothing can harm you as much as your own thoughts unguarded.” – Buddha',
      '“Attachment leads to suffering.” – Buddha',
      '“Nothing is forever except change.” – Buddha',
      '“Just as a snake sheds its skin, we must shed our past over and over again.” – Buddha',
      '“With our thoughts we make the world.” – Buddha',
      '“Be where you are, otherwise you will miss your life.” – Buddha',
      '“Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.” – Buddha',
      '“If you are facing in the right direction, all you need to do is keep on walking.” – Buddha',
    ]
  }

}
