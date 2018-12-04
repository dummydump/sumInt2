/**
 * My tasks Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, EventsService, TripService, UserService, TaskService, SettingsService, GoogleCalendarEventsService } from '../../services/index';
import { GlobalVariable } from '../../services/static-variable';


@Component({
    providers: [
        CommonAppService,
        TripService,
        UserService,
        TaskService,
        EventsService,
        SettingsService,
        GoogleCalendarEventsService
    ],
    styleUrls: ['./mytasks.component.css'],
    templateUrl: './mytasks.component.html'
})

export class MyTasksComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public pageCount = 0;
    public limit = 10;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];
    public pgList = {};
    public tasks = [];
    public agentsList = [];
    public taskTypes = [];
    public reminderList = [];
    public statusTypes = [];
    public existingEventObject = null;
    @Input('tripObject') tripObject;
    @ViewChild('btnModelClose') btnModelClose: ElementRef;
    @Output() updateCount = new EventEmitter();
    public isSpinner = true;
    public isSearching = false;
    public isFirstTimeLoading = true;
    public todayDate = new Date().toJSON().split('T')[0];
    public newTask = {
        'subject': '',
        'dueDate': '',
        'reminder': '',
        "assignedToAgentId": "",
        'assignedTo': {
            "agentFirstName": '',
            "agentLastName": '',
            "agentId": ''
        },
        'description': '',
        'taskType': '',
        'taskStatus': '',
        'tripId': "",
        '_id': 0,
        '_assignedToAgentName': ''
    };
    public minDate = "";
    public searchObject = {
        'subject': '',
        'dueDate': '',
        'reminder': '',
        'assignedToAgentId': '',
        'assignedTo': '',
        'taskType': '',
        'taskStatus': ''
    };

    private userRole = '';

    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    };

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef,
        public _eventsService: EventsService,
        public _googleCalendarEventsService: GoogleCalendarEventsService,
        public _taskService: TaskService,
        public _settingsService: SettingsService

    ) {

        this._commonAppService.getCurrentUserSession((user) => {
            this.currentUser = user;
            // this.currentUser.user.roleName = 'Agent';
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            } else {

                this.getAgentList();
                this.getTaskTypes();
                this.getStatusTypes();
                this.getReminderTypes();
                var cDate = new Date();
                cDate.setDate(cDate.getDate() - 1);
                this.minDate = cDate.toJSON().split('T')[0];
                //  this.getTasks();
            }
        });

    }

    public ngOnInit() {
        this.getTasks(this.pageCount, this.limit);
    }

    public ngAfterViewInit() {
        this._commonAppService.spinner.hide();
        this._commonAppService.spinner.show();
        setTimeout(() => {
            this._commonAppService.spinner.hide();
        }, 1000);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tripObject) {
            if (!this._commonAppService.isUndefined(this.tripObject)) {
                this.RefreshTasks();
            }
        }
    }
    public getNewTask() {
        return {
            'subject': '',
            'dueDate': '',
            'reminder': '',
            "assignedToAgentId": "",
            'assignedTo': {
                "agentFirstName": '',
                "agentLastName": '',
                "agentId": ''
            },
            'description': '',
            'taskType': '',
            'taskStatus': '',
            'tripId': '',
            '_id': 0,
            '_assignedToAgentName': ''

        };
    }

    public onSearchChange() {
        this.checkIsSearching();
        this.getTasks(this.currentPageCount, this.limit);
    }

    public checkIsSearching() {
        this.isSearching = false;
        for (var i in this.searchObject) {
            if (this.searchObject[i] != '') {
                this.isSearching = true;
            }
        }
    }

    public RefreshTasks() {
        this.getTasks(this.pageCount, this.limit);
    }

    public getDueDateText(_dueDateString) {
        var todayDate = new Date();
        var dueDate = new Date(_dueDateString);
        var timeDiff = Math.abs(dueDate.getTime() - todayDate.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays === 0) {
            return " due today";
        }
        else if (diffDays > 0 && diffDays < 7) {
            return " in " + diffDays + " days";
        }
        else if (diffDays > 6 && diffDays < 31) {
            let weeks = (diffDays) / 7;
            return " in " + weeks.toFixed() + " weeks";
        }
        else if (diffDays > 30) {
            var months = diffDays / 30;
            return " in " + months.toFixed() + " months";
        }

    }

    public getAgentList() {
        this._userService.getAllAgents(this.currentUser, {})
            .subscribe((data: any) => {
                if (data.status === '1') {
                    this.agentsList = this.getAgentListOptions(data.result.users);
                } else {
                    this.agentsList = [];
                }
            },
            (error: any) => {
                console.log(' Error while getAllAgents :  ' + JSON.stringify(error));
            });
    }
    public getAgentListOptions(users) {
        var agentList = [];
        for (var i = 0; i < users.length; i++) {
            agentList.push({
                name: users[i].firstName + " " + users[i].lastName,
                _id: users[i]._id,
                firstName: users[i].firstName,
                lastName: users[i].lastName
            })
        }
        return agentList;
    }
    public getTaskTypes() {
        let THIS = this;
        var data = {
            settingObject: GlobalVariable.SETTING_KEYS.TASK_TYPE
        }
        THIS._settingsService.getSettingByKey(THIS.currentUser, data)
            .subscribe((data: any) => {
                if (data.status === '1') {
                    if (data.result.settings.length > 0) {
                        THIS.taskTypes = data.result.settings[0].settingValues, 'name';
                    }
                    else {
                        THIS.taskTypes = [];
                    }
                } else {
                    THIS.taskTypes = [];
                }
            },
            (error: any) => {
                console.log(' Error while getAllAgents :  ' + JSON.stringify(error));
            });
    }
    public getReminderTypes() {
        let THIS = this;
        var data = {
            settingObject: GlobalVariable.SETTING_KEYS.REMINDER
        }
        THIS._settingsService.getSettingByKey(THIS.currentUser, data)
            .subscribe((data: any) => {
                if (data.status === '1') {
                    if (data.result.settings.length > 0) {
                        THIS.reminderList = data.result.settings[0].settingValues, 'name';
                    }
                    else {
                        THIS.reminderList = [];
                    }
                } else {
                    THIS.reminderList = [];
                }
            },
            (error: any) => {
                console.log(' Error while getAllAgents :  ' + JSON.stringify(error));
            });
    }
    public getStatusTypes() {
        this.statusTypes = [{
            name: 'Active',
            val: 'Active'
        }, {
            name: 'Inactive',
            val: 'Inactive'
        }];
    }
    public addNewTask() {

        this.newTask = this.getNewTask();
        this.newTask.dueDate = this._commonAppService.getCurrentDate();
        if (this.currentUser.user.roleName === 'Agent') {
            this.newTask["assignedToAgentId"] = this.currentUser.user._id;

            this.newTask['assignedTo'] = {
                "agentId": this.currentUser.user._id,
                "agentLastName": this.currentUser.user.firstName,
                "agentFirstName": this.currentUser.user.lastName
            }
            this.newTask._assignedToAgentName = this.currentUser.user.firstName + " " + this.currentUser.user.lastName;
        }
    }
    public editTask(_task) {
        this.newTask = _task;
        this.newTask._assignedToAgentName = this.getAgentById(_task.assignedToAgentId);
        this.fetchEventById(this.newTask._id, (isExists) => {
            if (!isExists) {
                this.existingEventObject = {};
            }
        });
    }

    public checkSearchObject(callback) {
        if (!this.searchObject.assignedToAgentId || this.searchObject.assignedToAgentId == '') {
            callback(false);
        } else {
            callback(true);
        }
    }

    public getAgentIdsBySearchValue(callback) {
        if (this.currentUser.user.roleName == 'Agent') {
            console.log(this.currentUser.user);
            let agentIds = [];
            agentIds.push(this.currentUser.user._id);
            callback(agentIds);
        } else {
            if (this.searchObject.assignedToAgentId && this.searchObject.assignedToAgentId != '') {
                let newList = this.agentsList.filter((agent) => {
                    return ((agent.firstName.toLowerCase().indexOf(this.searchObject.assignedToAgentId.toLowerCase()) != -1) || (agent.lastName.toLowerCase().indexOf(this.searchObject.assignedToAgentId.toLowerCase()) != -1))
                });

                let agentIds = newList.map((item) => { return item["_id"]; });
                callback((agentIds && agentIds.length > 0) ? agentIds : []);
            } else {
                console.log('calling all');
                callback(null);
            }
        }
    }

    public getTasks(pageCount, limit) {
        this.getAgentIdsBySearchValue((agentIds) => {
            this.taskList(pageCount, limit, agentIds);
        });
    }

    public taskList(pageCount, limit, agentIds) {
        console.log(agentIds);
        this.currentPageCount = pageCount;
        var data = {
            "pageCount": pageCount,
            "limit": limit,
            search: this.searchObject,
            agentIds: agentIds
        };

        if (this.currentUser.user.roleName === 'Agent') {
            data['assignedToAgentId'] = this.currentUser.user._id;
        }
        if (this.isSpinner && !this.isSearching) {
            this._commonAppService.spinner.show();
        }

        this._taskService.getTasksByRole(this.currentUser, data)
            .subscribe((data: any) => {
                this._commonAppService.spinner.hide();
                this.isSpinner = true;
                if (data.status === '1') {
                    this.tasks = data.result.tasks;
                    this.totalRecords = data.result.totalRecords;
                    this.updateCount.emit({ tasks: this.totalRecords });
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, pageCount);
                    this.pgList = (_pList) ? _pList : [];
                    /*for(var i=0 ;i<this.tasks.length ;i++)
                    {
                        console.log(this.tasks[i]);
                    }*/

                } else {
                    this.tasks = [];
                    this.totalRecords = 0;
                    this.updateCount.emit({ tasks: this.totalRecords });
                    this.pagerList = [];
                    this.pgList['pages'] = [];
                }
            },
            (error: any) => {
                console.log(' Error while taskList :  ' + JSON.stringify(error));
            });

    }

    public saveTask() {

        var data = this.newTask;
        if (!this.isValidatedData(data)) {
            return;
        }

        this._commonAppService.spinner.show();
        this.saveData(data, (res) => {
            this.btnModelClose.nativeElement.click();
            this._commonAppService.showSuccessMessage('Alert', res.result.message, (alertRes) => { });

            let _taskId = res.result._id;
            let startDate = new Date(this.newTask.dueDate).getTime();
            this.addEditGoogleCalendarEvent(startDate, startDate, this.newTask.subject, this.newTask.description, this.existingEventObject, (googleErr, googleCalendarEventId) => {
                console.log('1googleCalendarEventId ' + googleCalendarEventId);
                let eventObject = {
                    '_id': this._commonAppService.isUndefined(this.existingEventObject) ? '' : this.existingEventObject['_id'],
                    'startDate': new Date(this.newTask.dueDate).getTime(),
                    'endDate': new Date(this.newTask.dueDate).getTime(),
                    'type': 'task',
                    'title': this.newTask.subject,
                    'status': this.newTask.taskStatus,
                    'agentId': this.newTask.assignedToAgentId,
                    'taskId': _taskId,
                    'tripId': '',
                    'googleCalendarEventId': googleCalendarEventId
                };

                let isUpdate = (this.existingEventObject && !this._commonAppService.isUndefined(this.existingEventObject["_id"])) ? true : false;

                this._eventsService.addEditEvent(this.currentUser, eventObject, isUpdate)
                    .subscribe((dataRes: any) => {
                        if (dataRes.status == '1') {

                            this._commonAppService.spinner.show();
                            this.getReminderExistingEvent(_taskId, (fl, reminderEvent) => {
                                if (fl) {
                                    let a = new Date(this.newTask.dueDate);
                                    a.setDate(a.getDate() - +(this.newTask.reminder).split(' ')[0]);

                                    this.addEditGoogleCalendarEvent(a.getTime(), a.getTime(), this.newTask.subject, this.newTask.description, reminderEvent, (googleErr, googleCalendarEventId) => {
                                        
                                        eventObject = {
                                            '_id': (this._commonAppService.isUndefined(reminderEvent)) ? '' : reminderEvent['_id'],
                                            'startDate': a.getTime(),
                                            'endDate': a.getTime(),
                                            'type': 'reminder',
                                            'agentId': this.newTask.assignedToAgentId,
                                            'title': this.newTask.subject,
                                            'status': this.newTask.taskStatus,
                                            'taskId': _taskId,
                                            'tripId': '',
                                            'googleCalendarEventId': googleCalendarEventId
                                        };

                                        let isUpdate = (reminderEvent && !this._commonAppService.isUndefined(reminderEvent['_id'])) ? true : false;

                                        this._eventsService.addEditEvent(this.currentUser, eventObject, isUpdate)
                                            .subscribe((data: any) => {
                                                this._commonAppService.spinner.hide();
                                                setTimeout(() => {
                                                    this._commonAppService.showSuccessMessage('Alert', data.result.message, (alertRes) => { });
                                                }, 1000);
                                            },
                                            (error: any) => {
                                                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                                            });
                                    });

                                }
                            });
                        }
                    },
                    (error: any) => {
                        this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                    });
            });

            this.RefreshTasks();
            this.totalRecords = res.result.totalRecords;
        });
    }

    public addEditGoogleCalendarEvent(startDate, endDate, subject, description, existingEventObject, callback) {
        let googleEventObject = {
            'startDate': startDate,
            'endDate': endDate,
            'title': subject,
            'description': description,
            'googleCalendarEventId': (existingEventObject) ? existingEventObject.googleCalendarEventId : "",
            "type": "task"
        };
        console.log(' googleEventObject ' + JSON.stringify(googleEventObject));

        this._googleCalendarEventsService.addEditGoogleCalendarEvent(this.currentUser, googleEventObject, !this._commonAppService.isUndefined(googleEventObject.googleCalendarEventId))
            .subscribe((data: any) => {
                if (data.status == '1') {
                    callback(null, data.result.event.id);
                } else {
                    callback(data.result.err, "");
                }
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
            });
    }

    public saveData(data, callback) {
        let THIS = this;
        if (data["_id"] !== 0) {
            this._taskService.updateTaskById(this.currentUser, data)
            .subscribe((res: any) => {
                setTimeout(() => {
                    this._commonAppService.spinner.hide();
                }, 1000);
                if (res.status === '1') {
                    callback(res);
                }
            },
            (error: any) => {
                console.log(' Error while updateTaskById :  ' + JSON.stringify(error));
                this._commonAppService.spinner.hide();
            });
        } else {
            this._taskService.addTask(this.currentUser, data, false)
            .subscribe((res: any) => {
                setTimeout(() => {
                    this._commonAppService.spinner.hide();
                }, 1000);
                if (res.status === '1') {
                    callback(res);
                } else {

                }
            },
            (error: any) => {
                console.log(' Error while addTask :  ' + JSON.stringify(error));
                this._commonAppService.spinner.hide();
            });
        }
    }

    public fetchEventById(taskId, callback) {
        this._eventsService.getEventTaskById(this.currentUser, "", taskId, 'task')
            .subscribe((data: any) => {

                if (data.status == '1') {
                    this.existingEventObject = data.result.event;
                    callback(true);
                } else {
                    callback(false);
                }
            },
            (error: any) => {
                console.log(' Error :  ' + JSON.stringify(error));
            });
    }

    public getReminderExistingEvent(taskId, callback) {
        this._eventsService.getEventTaskById(this.currentUser, '', taskId, 'reminder')
            .subscribe((data: any) => {
                if (data.status == '1') {
                    this.existingEventObject = data.result.event;
                    callback(true, this.existingEventObject);
                } else {
                    callback(false, {});
                }
            },
            (error: any) => {
                console.log(' Error :  ' + JSON.stringify(error));
            });
    }

    public showValidationMessage(message) {
        this._commonAppService.showErrorMessage('Alert', message, function (alertRes) {
        });
    }

    public isValidatedData(task) {

        if (task.subject.trim() === '') {
            this.showValidationMessage('Subject is required');
            return false;
        }
        if (task.dueDate.trim() === '') {
            this.showValidationMessage('Due Date is required');
            return false;
        }
        if (task.dueDate < this.todayDate) {
            this.showValidationMessage('Due Date should not be past date');
            return false;
        }

        if (task.assignedToAgentId === '') {
            this.showValidationMessage('Assigned To is required');
            return false;
        }
        if (task.taskType === '') {
            this.showValidationMessage('Task Type is required');
            return false;
        }
        if (task.taskStatus === '') {
            this.showValidationMessage('Task Status is required');
            return false;
        }
        return true;
    }

    public getAgentById(id) {
        if (this._commonAppService.isUndefined(id)) {
            return "";
        } else {
            let agent = this.agentsList.filter(item => item._id == id);
            return (agent && agent.length > 0) ? (agent[0].firstName + ' ' + agent[0].lastName) : "";
        }
    }

    public typeaHeadAssignedToOnSelect(e: any, task): void {
        let id = e.item._id;
        let agent = this.agentsList.find(i => i._id === id);

        task["assignedToAgentId"] = agent._id;

        task['assignedTo'] = {
            "agentId": agent._id,
            "agentLastName": agent.firstName,
            "agentFirstName": agent.lastName
        }
    }
}
