/**
 * Calendar Page Component.
 */
import { Observable } from 'rxjs/Observable';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, TemplateRef, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService, TaskService, TripService, EventsService, GoogleCalendarEventsService } from '../../services/index';
import { GlobalVariable } from '../../services/static-variable';
import { ANIMATION_TYPES } from 'ngx-loading';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { IMyDpOptions, IMyCalendarViewChanged, IMyDateModel } from 'mydatepicker';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  providers: [
    CommonAppService,
    UserService,
    TripService,
    EventsService,
    GoogleCalendarEventsService,
    TaskService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html'
})

export class CalendarComponent implements OnInit, AfterViewInit {
  public myForm: FormGroup;
  public currentUser: any;
  public clickedDate: Date;

  public calendarView: string = 'month';
  public viewDate: any = "";
  public selectedDate: any = "";
  public currentStartDate: any = "";
  public currentEndDate: any = "";

  public totalRecords = 0;
  public currentPageCountReminder = 0;
  public currentPageCountTrip = 0;
  public currentPageCountTask = 0;
  public totalCounters = { "ReminderCount": 0, "TaskCount": 0, "TripCount": 0 };


  public isShowLoadingMonth = false;
  public isShowLoadingReminder = false;
  public isShowLoadingTask = false;
  public isShowLoadingTrip = false;
  public isEventsLoading = true;
  public loadingConfig = {};

  public model: any = { date: { year: 2018, month: 10, day: 9 } };
  public myDatePickerOptions: IMyDpOptions = {
    showTodayBtn: false,
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek: 'mo',
    sunHighlight: false,
    inline: true,
    allowSelectionOnlyInCurrentMonth: false
  };

  public flage = false;
  public calendarDayViewEventsList = {};
  public calendarDayViewEventsListAll = {};

  public calendarMonthViewEventsList = [];

  view: string = 'month';
  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();
  refreshDay: Subject<any> = new Subject();
  dtTrigger: Subject<any> = new Subject();

  public tripFilterValue = 'Active';
  public taskFilterValue = 'Active';
  public reminderFilterValue = 'Active';

  public isLoadedLastest = false;

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public _commonAppService: CommonAppService,
    public _userService: UserService,
    public _taskService: TaskService,
    public _tripService: TripService,
    public _eventsService: EventsService,
    public _googleCalendarEventsService: GoogleCalendarEventsService,
    public _viewContainerRef: ViewContainerRef,
    private modal: NgbModal,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {

    this._commonAppService.getCurrentUserSession((user) => {
      this.currentUser = user;
      if (this._commonAppService.isUndefined(this.currentUser)) {
        window.location.href = '/login';
      }
    });

    let THIS = this;
    this.viewDate = this._commonAppService.getCalendarDate(new Date(), this.calendarView);
    this.selectedDate = new Date();
    this.setMonthFirstLastDate(this.selectedDate);

    let data = {};
    this.calendarMonthViewEventsList = [];
    this.loadingConfig = this._commonAppService.getLoadingConfig();
    this.calendarDayViewEventsList = {'reminders': [], 'trip': [], 'tasks' : [], 'totalCounters' : {
        "tripCount": 0,
        "taskCount": 0,
        "reminderCount": 0
      }
    };

    // this._googleCalendarEventsService.pushNotification()
    //   .subscribe((data: any) => {
    //     console.log(' test', data);
    //   },
    //   (error: any) => {
    //     console.log(' Error while pushNotification :  ' + JSON.stringify(error));
    //   });
  }
  spinnerConfig = {
    bdColor: '#333',
    size: 'large',
    color: '#fff'
  }

  public setMonthFirstLastDate(date) {
    this.currentStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.currentEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  public ngAfterViewInit() {
    this.currentStartDate = new Date();
  }

  public ngOnInit() {

    this.reloadMonthViewEvents();
    //this. disableUntil();
    this.myForm = this.formBuilder.group({
      // Empty string or null means no initial value. Can be also specific date for
      // example: {date: {year: 2018, month: 10, day: 9}} which sets this date to initial
      // value.

      myDate: ['', Validators.required]
      // other controls are here...
    });
    this.myDatePickerOptions = {
      showTodayBtn: false,
      dateFormat: 'yyyy-mm-dd',
      firstDayOfWeek: 'mo',
      sunHighlight: false,
      inline: true,
      allowSelectionOnlyInCurrentMonth: false
    };
  }
  public disableUntil() {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    let copy = this.getCopyOfOptions();
    copy.disableUntil = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: 1
    };
    this.myDatePickerOptions = copy;
  }

  // Returns copy of myOptions
  public getCopyOfOptions(): IMyDpOptions {
    return JSON.parse(JSON.stringify(this.myDatePickerOptions));
  }

  public reloadMonthViewEvents() {
    this._commonAppService.spinner.show();
    this.getEventsList(this.currentStartDate, this.currentEndDate, "All", (err, data) => {
      if (data) {
        // this.calendarDayViewEventsList = Object.assign({}, data['result']['events']);
        let _EVENTS = Object.assign({}, data['result']['events']);
        // console.log('month calendarDayViewEventsList ' + JSON.stringify(this.calendarDayViewEventsList));
        this.setMonthEvents(_EVENTS);
      }
    });
  }

  public reloadDayViewEvents(date) {
    //fix for correct data retrieval for day view change without selecting any date
    let regex1 = /^\d{4}/;
    if (!(regex1.test(date))) {
      date = this._commonAppService.getDateYYYYMMDD(date);
    }
    this.currentPageCountReminder = 0;
    this.currentPageCountTrip = 0;
    this.currentPageCountTask = 0;

    this.getEventsList(date, date, "All", (err, data) => {
      if (data) {
        this.zone.run(() => {
          this.calendarDayViewEventsList = Object.assign({}, data['result']['events']);
          this.calendarDayViewEventsListAll = Object.assign({}, this.calendarDayViewEventsList);
          // this.filterEventsByType(this.tripFilterValue, 'trip');
          // console.log('day calendarDayViewEventsList ' + JSON.stringify(this.calendarDayViewEventsList));
          this.cdr.detectChanges();
        });
      }
    });
  }

  public filterEventsByType(filterValue, type, fullArray) {
    if (filterValue != 'All') {
      if (type == 'trip') {
        let ALLTRIPS = Object.assign([], fullArray['trips']);

        let filterArray = ALLTRIPS.filter((itm) => {
          return itm.status == this.tripFilterValue;
        });

        this.calendarDayViewEventsList['trips'] = Object.assign([], filterArray);
        this.calendarDayViewEventsListAll['trips'] = Object.assign([], ALLTRIPS);
        this.cdr.detectChanges();
      } else if (type == 'task') {
        let ALLTASKS = Object.assign([], fullArray['tasks']);

        let filterArray = ALLTASKS.filter((itm) => {
          return itm.status == this.taskFilterValue;
        });

        this.calendarDayViewEventsList['tasks'] = Object.assign([], filterArray);
        this.calendarDayViewEventsListAll['tasks'] = Object.assign([], ALLTASKS);
        // this.calendarDayViewEventsList['totalCounters']['taskCounter'] = filterArray.length;
        this.cdr.detectChanges();
      }
    } else {
      this.calendarDayViewEventsList = Object.assign({}, fullArray);
      this.cdr.detectChanges();
    }
  }

  public setMonthEvents(calendarDayViewEventsList) {
    // this.resetEventsList();
    if (this._commonAppService.isUndefined(calendarDayViewEventsList)) {
      this.calendarMonthViewEventsList = [];
    } else {

      this.calendarMonthViewEventsList = [];
      if (!this._commonAppService.isArrayEmpty(calendarDayViewEventsList.trips)) {
        calendarDayViewEventsList.trips.forEach(trip => {
          this.calendarMonthViewEventsList.push({
            start: startOfDay(trip['startDate']),
            end: startOfDay(trip['endDate']),
            title: trip['title'],
            color: colors.yellow,
            type: 'trip',
            id: trip['_id']
          });
        });
        this.refresh.next();
      }

      if (!this._commonAppService.isArrayEmpty(calendarDayViewEventsList.reminders)) {
        calendarDayViewEventsList.reminders.forEach(reminder => {
          this.calendarMonthViewEventsList.push({
            start: startOfDay(reminder['startDate']),
            end: startOfDay(reminder['endDate']),
            title: reminder['title'],
            color: colors.yellow,
            type: 'reminder',
            id: reminder['_id']
          });
        });
        this.refresh.next();
      }

      if (!this._commonAppService.isArrayEmpty(calendarDayViewEventsList.tasks)) {
        calendarDayViewEventsList.tasks.forEach(task => {
          this.calendarMonthViewEventsList.push({
            start: startOfDay(task['startDate']),
            end: startOfDay(task['endDate']),
            title: task['title'],
            color: colors.yellow,
            type: 'task',
            id: task['_id']
          });
        });
        this.refresh.next();
      }
    }
  }

  public getEventsList(startDate, endDate, type, callback) {
    
    this.isLoadedLastest = false;
    this.isEventsLoading = true;
    if (this.calendarView == 'month' || type == 'All') {
      this.isShowLoadingMonth = true;
    } else if (this.calendarView == 'day' && type == 'reminder') {
      this.isShowLoadingReminder = true;
    } else if (this.calendarView == 'day' && type == 'task') {
      this.isShowLoadingTask = true;
    } else if (this.calendarView == 'day' && type == 'trip') {
      this.isShowLoadingTrip = true;
    }

    if (typeof startDate == 'object' && startDate.formatted) {
      startDate = startDate.formatted;
    }
    if (typeof endDate == 'object' && endDate.formatted) {
      endDate = endDate.formatted;
    }

    let query = { 'startDate': startDate, 'endDate': endDate, "pageReminderCount": this.currentPageCountReminder, "pageTripCount": this.currentPageCountTrip, "pageTaskCount": this.currentPageCountTask, "calendarView": this.calendarView, "tripFilterValue": this.tripFilterValue, "reminderFilterValue": this.reminderFilterValue, "taskFilterValue": this.taskFilterValue, "agentId": this.currentUser['user']['_id'], "pageFlage": type };

    this._commonAppService.spinner.show();

    
    

    this.fetchGoogleCalendarEvents(query, (err, googleCalendarEvents) => {
      // console.log(' googleCalendarEvents ' + JSON.stringify(googleCalendarEvents));

      this._eventsService.getEvents(this.currentUser, query)
        .subscribe((data: any) => {
          
          if (this._commonAppService.isSuccess(data)) {

            if (this.calendarView == 'day' && type == 'reminder') {
              this.calendarDayViewEventsList['reminders'] = data['result']['events']['reminders'];

            } else if (this.calendarView == 'day' && type == 'task') {
              this.calendarDayViewEventsList['tasks'] = data['result']['events']['tasks'];

            } else if (this.calendarView == 'day' && type == 'trip') {
              this.calendarDayViewEventsList['trips'] = data['result']['events']['trips'];

            } else if (type == 'All') {
              // this.calendarDayViewEventsList = data['result']['events'];
            }

            setTimeout(() => {
              this._commonAppService.spinner.hide();
              // console.log(' calendarDayViewEventsList ' + JSON.stringify(this.calendarDayViewEventsList));
              this.isLoadedLastest = true;
              this.isShowLoadingMonth = false;
              this.isShowLoadingReminder = false;
              this.isShowLoadingTask = false;
              this.isShowLoadingTrip = false;
              this.isEventsLoading = false;
              callback(null, data);
            }, 0);
          } else {
            callback(data, null);
          }
        },
        (error: any) => {
          console.log(' Error while getEventsList :  ' + JSON.stringify(error));
        });
    });
  }

  public fetchGoogleCalendarEvents(query, callback){
    this._googleCalendarEventsService.getGoogleCalendarEvents(this.currentUser, query)
      .subscribe((data: any) => {
        callback(null, data);
      },
      (error: any) => {
        console.log(' Error while getGoogleCalendarEvents :  ' + JSON.stringify(error));
        callback(error, null);
      });
  }

  public resetEventsList() {
    this.calendarDayViewEventsList = {'reminders': [], 'trip': [], 'tasks' : [], 'totalCounters' : {
        "tripCount": 0,
        "taskCount": 0,
        "reminderCount": 0
      }
    };
  }

  public getEventMessageByEvents(calendarDayEvents) {
    let taskEventCounter = 0;
    let tripEventCounter = 0;
    let reminderEventCounter = 0;

    calendarDayEvents.forEach(evt => {
      if (evt.type == 'task') {
        taskEventCounter++;
      } else if (evt.type == 'trip') {
        tripEventCounter++;
      } else if (evt.type == 'reminder') {
        reminderEventCounter++;
      }
    });

    let eventMessage = "";
    if (tripEventCounter > 0) {
      eventMessage += '<span><h6 class="bluetxt">' + ((tripEventCounter > 1) ? tripEventCounter + ' trips ' : tripEventCounter + ' trip') + '</h6></span>';
    }

    if (taskEventCounter > 0) {
      eventMessage += '<span><h6 class="maroontxt">' + ((taskEventCounter > 1) ? taskEventCounter + ' tasks ' : taskEventCounter + ' task') + '</h6></span>';
    }

    if (reminderEventCounter > 0) {
      eventMessage += '<span><h6 class="text-default">' + ((reminderEventCounter > 1) ? reminderEventCounter + ' reminders ' : reminderEventCounter + ' reminder') + '</h6></span>';
    }
    return eventMessage;
  }
  public setDate(date): void {
    // Set today date using the patchValue function

    this.myForm.patchValue({
      myDate: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

  public changeViewMode(mode) {
    this.calendarView = mode;
    let month = 0;
    let year = 0;
    let day = 0;
    let temp = 0;
    let regex1 = /^\d{4}/;
    let regex2 = /\d\d/g;
    let regex3 = /\d\d$/;
    if (mode == 'month') {
      if (this.selectedDate.date) {
        month = this.selectedDate.date.month - 1;
        year = this.selectedDate.date.year;
        day = this.selectedDate.date.day;
      } else if (!(regex1.test(this.selectedDate))) {
        month = this.selectedDate.getMonth();
        year = this.selectedDate.getFullYear();
        day = this.selectedDate.getDate();
      }
      else {
        year = this.selectedDate.match(regex1);
        let monthArray = this.selectedDate.match(regex2);
        month = monthArray[2] - 1;
        day = this.selectedDate.match(regex3);
      }
    } else {
      if (this.selectedDate.date) {
        month = this.selectedDate.date.month - 1;
        year = this.selectedDate.date.year;
        day = this.selectedDate.date.day;
      } else {
        month = this.selectedDate.getMonth();
        year = this.selectedDate.getFullYear();
        day = this.selectedDate.getDate();
      }
    }

    let date = new Date(year, month, day);
    let _formattedDate = this._commonAppService.getDateYYYYMMDD(date);
    this.setDate(date);

    if (mode == 'day') {
      this.changeToDayView(_formattedDate, false);
    } else {
      this.changeToMonthView(date);
    }
  }

  public calendarDateClick(date) {
    let formattedDate = this._commonAppService.getDateYYYYMMDD(date);
    let month = date.getMonth();
    let year = date.getFullYear();
    let day = date.getDate();
    let d = new Date(year, month, day);
    this.setDate(d);
    this.changeToDayView(formattedDate, false);
  }

  public onDateChanged(event: IMyDateModel) {
    this.changeToDayView(event.formatted, true);
  }

  public onCalendarViewChanged(event: IMyCalendarViewChanged) {
    var date = new Date(event.year, event.month - 1, 1);
    this.changeToMonthView(date);
  }

  public changeToDayView(date, flage) {
    this.calendarView = 'day';
    this.selectedDate = date;
    this.viewDate = this._commonAppService.getCalendarDate(date, this.calendarView);
    this.reloadDayViewEvents(this.selectedDate);
  }

  public changeToMonthView(date) {
    this.calendarDayViewEventsList = [];
    this.calendarView = 'month';
    if (typeof date == 'object' && date.formatted) {
      date = date.formatted;
    }
    this.selectedDate = date;
    this.setMonthFirstLastDate(this.selectedDate);
    this.reloadMonthViewEvents();
    this.viewDate = this._commonAppService.getCalendarDate(date, this.calendarView);
  }

  public getEventDetails(event) {
    if (event) {
      let startDate = this._commonAppService.getMMDDYYYYByTimestamp(event.startDate);
      let endDate = this._commonAppService.getMMDDYYYYByTimestamp(event.endDate);
      return '(' + startDate + ' - ' + endDate + ' ' + event.status + ')';
    } else {
      return "";
    }
  }

  /*-------- pagination -----------*/
  public currentPageCountEvent($event, type) {
    if (type == 'reminder') {
      this.currentPageCountReminder = $event;
    } else if (type == 'task') {
      this.currentPageCountTask = $event;
    } else if (type == 'trip') {
      this.currentPageCountTrip = $event;
    }


    let filterValue = (type == 'trip') ? this.tripFilterValue : this.taskFilterValue;
    this.getEventsList(this.selectedDate, this.selectedDate, type, (err, data) => {
      if (data) {
        // this.calendarDayViewEventsList = data['result']['events'];
        this.calendarDayViewEventsListAll = Object.assign({}, this.calendarDayViewEventsList);
        this.filterEventsByType(filterValue, type, this.calendarDayViewEventsListAll);
        this.cdr.detectChanges();
      }
    });

  }

  public limitChangeEvent($event) {
    // this.limit = $event;
  }

  public onFilterChanged(filter, type) {

    if (type == 'trip') {
      this.currentPageCountEvent(0, 'trip');
    }

    if (type == 'task') {
      this.currentPageCountEvent(0, 'task');
      // this.currentPageCountTask = 0;
      // this.tripFilterValue = filter;
      // this.cdr.detectChanges(); 
    }

    this.getEventsList(this.selectedDate, this.selectedDate, "All", (err, data) => {
      if (data) {
        // this.calendarDayViewEventsList = data['result']['events'];

        // if(type == 'reminder'){
        //   this.calendarDayViewEventsList['reminders'] = data['result']['events']['reminders']; 

        // } else if(type == 'task'){
        //   this.calendarDayViewEventsList['tasks'] = data['result']['events']['tasks'];

        // } else if(type == 'trip'){
        //   this.calendarDayViewEventsList['trips'] =data['result']['events']['trips'];

        // } else if(type == 'All'){
        //   this.calendarDayViewEventsList = data['result']['events'];

        // }

        this.calendarDayViewEventsListAll = Object.assign({}, this.calendarDayViewEventsList);
        this.filterEventsByType(filter, type, this.calendarDayViewEventsListAll);
        this.cdr.detectChanges();
      }
    });

  }

}
