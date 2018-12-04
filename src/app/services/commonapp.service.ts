/**
 * Common App Services.
 */

import { Injectable } from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalVariable } from '../services/static-variable';
import { DialogsService } from '../services/dialogs.service';
import { AlertService } from '../services/alert.service';
import { Observable } from 'rxjs/Observable';
import swal from 'sweetalert2';
import * as _ from 'underscore';
import { NgxSpinnerService } from 'ngx-spinner';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ANIMATION_TYPES } from 'ngx-loading';
import * as moment from "moment";

@Injectable()
export class CommonAppService {
	public headers: Headers;
	public currentUser: any;
	public dialogResult: any;
	public requiredFieldMessage = 'Required field value missing!';
	public removeConfirmMessage = 'Are you sure you want to remove this record?';
	public TripNotFoundMessage = 'Trip not found, Please save the trip first.'
	public beginJourneyTitle = 'Begin your journey aboard ';

	public valid_CSV_EXCEL_Exts = new Array('.xlsx', '.xls', '.csv');
	public days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	public months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	public loadingConfig = {
		animationType: ANIMATION_TYPES.rectangleBounce,
		backdropBackgroundColour: 'rgba(0,0,0,0.5)',
		backdropBorderRadius: '2px',
		primaryColour: '#ffffff',
		secondaryColour: '#ffffff',
		tertiaryColour: '#ffffff'
	};

	public id_regex = new RegExp("^[0-9a-fA-F]{24}$");


	constructor(
		public _dialogsService: DialogsService,
		public _alertService: AlertService,
		public _coolLocalStorage: CoolLocalStorage,
		public spinner: NgxSpinnerService
	) {
	}

	public isUndefined(obj: any) {
		if (typeof obj == 'undefined' || obj == null || obj == '') {
			return true;
		} else {
			return false;
		}
	}



	public _getFormattedBirthday(birthdate, startDate, endDate) {
		if (birthdate != "") {

			let checkDate = new Date(birthdate);

			let _startDate = this._getAsDate(startDate, '00:00');
			let _endDate = this._getAsDate(endDate, '23:59');

			// console.log("_startDate : " + _startDate);
			// console.log("_endDate : " + _endDate);
			// if ((checkDate.getMonth() - 1) >= _startDate.getMonth() && (checkDate.getMonth()-1) <= _endDate.getMonth()) {

			// 	if ((checkDate.getDate() - 1) >= _startDate.getDate() && (checkDate.getDate()-1) <= _endDate.getDate()) {
			// 		console.log("_startDate : " + _startDate);
			// 		console.log("_endDate : " + _endDate);
			return this._getAge(checkDate, _startDate);

			// } else { return ""; }

			// } else { return ""; }

		} else { return ""; }

	}



	public _getAsDate(day, time) {
		let hours = Number(time.match(/^(\d+)/)[1]);
		let minutes = Number(time.match(/:(\d+)/)[1]);
		// let AMPM = time.match(/\s(.*)$/)[1];
		// if(AMPM == "pm" && hours<12) hours = hours+12;
		// if(AMPM == "am" && hours==12) hours = hours-12;


		let sHours = hours.toString();
		let sMinutes = minutes.toString();
		if (hours < 10) sHours = '0' + sHours;
		if (minutes < 10) sMinutes = '0' + sMinutes;
		time = sHours + ':' + sMinutes + ':00';
		let d = new Date(day);
		let n = d.toISOString().substring(0, 10);
		let newDate = new Date(n + "T" + time);
		return newDate;
	}

	public _getFormattedAnniversaryDate(anniversaryDate, startDate, endDate) {
		if (anniversaryDate && anniversaryDate != "") {

			return this.getDateMMddyyyy(anniversaryDate);
			// let checkDate = new Date(anniversaryDate);

			// let _startDate = this.getAsDate(startDate, '00:00');
			// let _endDate = this.getAsDate(endDate, '23:59');

			// console.log("_startDate : " + _startDate);
			// console.log("endDate : " + _endDate);

			// if (checkDate.getMonth() >= _startDate.getMonth() && checkDate.getMonth() <= _endDate.getMonth()) {
			// 	if (checkDate.getDate() >= _startDate.getDate() && checkDate.getDate() <= _endDate.getDate()) {
			// 		var message = '(Anniversary date: ' + anniversaryDate + ')';
			// 		return message;
			// 	}
			// 	else { return ""; }

			// } else { return ""; }

		} else { return ""; }
	}


	public _getAge(birth_date, tripStartDate) {

		var a = moment(tripStartDate);
		var b = moment(birth_date);
		birth_date = this.getDateMMddyyyy(birth_date);
		let aDate = a.toDate();
		let bDate = b.toDate();

		let year_diff = aDate.getFullYear() - bDate.getFullYear();
		let month_diff = Math.abs(aDate.getMonth() - bDate.getMonth());
		let day_diff = Math.abs(aDate.getDate() - bDate.getDate());

		var years = a.diff(b, 'year');
		b.add(years, 'years');


		var months = a.diff(b, 'months');
		b.add(months, 'months');
		 
		var days = a.diff(b, 'days');
		var message = '(Birth date: ' + birth_date + ' / ' + year_diff + ' years ' + month_diff + ' months ' + day_diff + ' days old on trip start day)';
		return message;
	}

	public getDateMMddyyyy(date) {
		let d = new Date(date);
		let monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"];

		return monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
	}

	public isArrayEmpty(array: any) {
		if (typeof array == 'undefined' || array == null || array.legnth < 0) {
			return true;
		} else {
			return false;
		}
	}

	public toJSON(obj) {
		return JSON.stringify(obj);
	}

	public isValidEmail(email) {
		let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email.toLowerCase());
	}
	
	public isValidId(id) {
		if (typeof id != 'undefined' && id != "") {
			return this.id_regex.test(id);
		} else {
			return false;
		}
	}

	public isSuccess(data: any) {
		return (data.status == '1' || data.status == true) ? true : false;
	}

	public isFail(data: any) {
		return (data.status == '0' || data.status == false) ? true : false;
	}

	public getCurrentUserSession(callback) {
		let user = this._coolLocalStorage.getObject(GlobalVariable.SESSION_USER);
		callback(user);
	}

	public setCurrentUserSession(user: any) {
		this._coolLocalStorage.setObject(GlobalVariable.SESSION_USER, user);
		console.log('User Session Set Successfully..!!');
	}

	public setUserTokenSession(token: any) {
		this._coolLocalStorage.setObject('token', token);
		let token1 = this._coolLocalStorage.getObject('token');
		console.log('Token Session Set Successfully..!!:' + token1);
	}

	public removeCurrentUserSession(callback) {
		this._coolLocalStorage.removeItem(GlobalVariable.SESSION_USER);
		callback(null, 'Done');
	}

	public getDayDiffFromTwoDate(firstDate: any, secondDate: any) {
		let dayDiff = (secondDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
		return dayDiff;
	}

	public getFullFormattedDate(date: any) {
		let dt = new Date(date);
		return (this.isUndefined(date)) ? '' : (dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2)) + ' ' +
			('00' + dt.getHours()).slice(-2) + ':' +
			('00' + dt.getMinutes()).slice(-2) + ':' +
			('00' + dt.getSeconds()).slice(-2);
	}

	public getMMDDYYYYByTimestamp(timestamp: any) {
		if (this.isUndefined(timestamp)) {
			return "";
		}

		let dt = new Date(parseInt(timestamp));

		return (this.isUndefined(dt)) ? "" : (('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2) + '-' + dt.getFullYear());
	}

	public getFormattedTime(date: any) {
		if (date && typeof (date) == 'object') {
			let dt = new Date(date);
			return (('00' + dt.getHours()).slice(-2) + ':' +
				('00' + dt.getMinutes()).slice(-2)).toString();
		} else {
			return date;
		}
	}

	public getDateByTimestamp(timestamp: any) {
		return (this.isUndefined(timestamp)) ? '' : new Date(parseInt(timestamp)).toString();
	}

	public getCurrentTimeZoneDate(timestamp: any) {
		return (this.getFullFormattedDate(new Date(parseInt(timestamp)).toString()));
	}
	public getCurrentDate() {
		let d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}
	public getDateYYYYMMDD(date) {
		let d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	}

	public getDateMMDDYYYY(date) {
		let d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [month, day, year].join('-');
	}

	public getCalendarDate(date, calendarView) {
		let d = new Date(date),
			dayName = '' + this.days[d.getDay()],
			month = '' + this.months[d.getMonth()],
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (calendarView == 'notDayname') {
			return month + ' ' + day + ', ' + year;
		}
		if (calendarView == 'day') {
			return dayName + ', ' + month + ' ' + day + ', ' + year;
		} else {
			return month + ' ' + year;
		}
	}

	public getAsDate(day, time) {
		let hours = Number(time.match(/^(\d+)/)[1]);
		let minutes = Number(time.match(/:(\d+)/)[1]);
		// let AMPM = time.match(/\s(.*)$/)[1];
		// if(AMPM == "pm" && hours<12) hours = hours+12;
		// if(AMPM == "am" && hours==12) hours = hours-12;


		let sHours = hours.toString();
		let sMinutes = minutes.toString();
		if (hours < 10) sHours = '0' + sHours;
		if (minutes < 10) sMinutes = '0' + sMinutes;
		time = sHours + ':' + sMinutes + ':00';
		let d = new Date(day);
		let n = d.toISOString().substring(0, 10);
		let newDate = new Date(n + "T" + time);
		return newDate;
	}

	public getHourFromTime(time, lastMaxTime) {
		if (time) {
			let hourMin = time.split(':');
			return hourMin[0];
		} if (lastMaxTime) {
			let hourMin = lastMaxTime.split(':');
			return hourMin[0];
		} else {
			return 24;
		}

	}

	public getMinFromTime(time, lastMaxTime) {
		if (time) {
			let hourMin = time.split(':');
			return hourMin[1];
		} if (lastMaxTime) {
			let hourMin = lastMaxTime.split(':');
			return hourMin[1];
		} else {
			return 60;
		}
	}

	public getCurrentTime(date) {
		// formats a javascript Date object into a 12h AM/PM time string
		if (!this.isUndefined(date)) {

			let hourMin = date.split(':');
			var hour = hourMin[0];

			var minute = hourMin[1];

			var amPM = (hour > 11) ? 'PM' : 'AM';
			if (hour > 12) {
				hour -= 12;
				hour = (hour <= 9) ? '0' + hour : hour;
			} else if (hour == 0) {
				hour = '12';
			}

			// if(hour < 10) {
			// 	hour = "0" + hour;
			// }

			if (minute < 10 && minute.length <= 1) {
				minute = '0' + minute;
			}
			return hour + ':' + minute + ' ' + amPM;
		} else {
			return '';
		}
	}

	public openConfirmDialog(title: any, message: any, callback) {
		let res = confirm(message);
		callback(res);

		//this.dialogResult = this._dialogsService
		//.confirm(title, message);
		//callback(this.dialogResult);
	}
	public showConfirmDialog(message: any, callback) {
		swal({
			title: 'Are you sure?',
			text: message,
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		})
			.then((result) => {
				if (result.value) {
					callback(result.value);

				}
			})
	}
	public showDeleteConfirmAlert(message: any) {
		swal(
			'Deleted!',
			message,
			'success'
		)
	}
	public showAlert(message: any) {
		swal(
			'Message!',
			message,
			'success'
		)
	}
	public showAlertBox(message: any, title: any, type: any) {
		swal(
			title,
			message,
			type
		)
	}
	public openAlertDialog(title: any, message: any, callback) {
		this.dialogResult = this._dialogsService
			.alert(title, message);
		callback(this.dialogResult);
	}

	public showSuccessMessage(title: any, message: any, callback) {
		let messageString = message.toString();

		if (messageString.indexOf('!') == -1) {
			messageString = messageString + '!';
		}
		this._alertService.success(messageString)
		setTimeout(() => {
			this._alertService.clear();
		}, 5000);
	}

	public showErrorMessage(title: any, message: any, callback) {

		let messageString = message.toString();
		if (messageString.indexOf('!') == -1) {
			messageString = messageString + '!';
		}
		this._alertService.error(messageString);
		setTimeout(() => {
			this._alertService.clear();
		}, 5000);
	}

	public showInfoMessage(title: any, message: any, callback) {

		this._alertService.info(message);
		setTimeout(() => {
			this._alertService.clear();
		}, 5000);
	}

	public showWarnMessage(title: any, message: any, callback) {

		this._alertService.warn(message);
		setTimeout(() => {
			this._alertService.clear();
		}, 5000);
	}

	public getPaginatedItems(items, page, limit) {
		page = page || 1;
		let offset = (page - 1) * limit;
		let paginatedItems = _.rest(items, offset).slice(0, limit);
		return paginatedItems;
	}


	public getPagerList(totalRecords, limit, pageCount) {
		// calculate total pages
		let totalPages = Math.ceil(totalRecords / limit);
		totalPages = totalPages - 1;

		let startPage: number, endPage: number;
		//  if (totalPages <= 10) {
		//      // less than 10 total pages so show all
		//      startPage = 1;
		//      endPage = totalPages;
		//  } else {
		//      // more than 10 total pages so calculate start and end pages
		//      if (pageCount <= 6) {
		//          startPage = 1;
		//          endPage = 10;
		//      } else if (pageCount + 4 >= totalPages) {
		//          startPage = totalPages - 9;
		//          endPage = totalPages;
		//      } else {
		//          startPage = pageCount - 5;
		//          endPage = pageCount + 4;
		//      }
		//  }

		if (totalPages <= 4) {
			startPage = 1;
			endPage = totalPages;
		} else {
			if (pageCount <= 3) {
				startPage = 1;
				endPage = 4;
			} else if (pageCount + 1 >= totalPages) {
				startPage = totalPages - 3;
				endPage = totalPages;
			} else {
				startPage = pageCount - 2;
				endPage = pageCount + 2;
			}
		}

		// calculate start and end item indexes
		let startIndex = (pageCount - 1) * limit;
		let endIndex = Math.min(startIndex + limit - 1, totalRecords - 1);

		// create an array of pages to ng-repeat in the pager control
		let pages = _.range(startPage, endPage + 2);

		// return object with all pager properties required by the view
		return {
			totalRecords: totalRecords,
			pageCount: pageCount,
			limit: limit,
			totalPages: totalPages,
			startPage: startPage,
			endPage: endPage,
			startIndex: startIndex,
			endIndex: endIndex,
			pages: pages
		};
	}

	public getTravelerById(travelerId, clientsList) {
		let _client = clientsList.filter((client) => {
			return client._id === travelerId;
		});
		return (_client && _client.length > 0) ? _client[0] : {};
	}
	public getTravelerEmailById(travelerId, clientsList) {
		let _client = clientsList.filter((client) => {
			return client._id === travelerId;
		});
		if (_client && _client.length > 0) {
			return (_client[0].contactDetails.length > 0) ? _client[0].contactDetails[0] : {};
		}
		//return (_client && _client.length > 0) ? _client[0] : {};
	}
	public getTravelerEmailCountById(travelerId, clientsList) {
		let _client = clientsList.filter((client) => {
			return client._id === travelerId;
		});
		if (_client && _client.length > 0) {
			return (_client[0].contactDetails.length > 1) ? _client[0].contactDetails.length - 1 : 0;
		}
	}
	public checkExcelCSVFile(fileName, callback) {
		let fileExt = fileName;
		fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
		if (this.valid_CSV_EXCEL_Exts.indexOf(fileExt) < 0) {
			callback(false, '');
		} else {
			callback(true, fileExt);
		}
	}

	public checkItineraryDetails(allArray, callback) {
		let isValid = true;
		allArray.forEach((array, index) => {
			array.forEach(element => {
				for (const k in element) {
					if (k == 'roomCategories' && !this.isArrayEmpty(element[k])) {
						element[k].forEach(room => {
							for (const t in room) {
								if (this.isUndefined(element[k])) {
									isValid = false;
								}
							}
						});
					} else if (k != 'isPrimary' && this.isUndefined(element[k])) {
						isValid = false;
					}
				}
			});

			if ((index == (allArray.length - 1)) && (isValid == false)) {
				callback('Please fill all values for itinerary', isValid);
			} else if ((index == (allArray.length - 1)) && (isValid == true)) {
				callback(null, isValid);
			}
		});
	}
	public validateEmail(email) {
		let x = email
		let atpos = x.indexOf('@');
		let dotpos = x.lastIndexOf('.');
		if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
			return true;
		}
		else {
			return false;
		}
	}

	public validateObject(array, callback) {
		let isValid = true;
		array.forEach((element, index) => {
			for (const k in element) {
				if (k == 'roomCategories' && !this.isArrayEmpty(element[k])) {
					element[k].forEach(room => {
						for (const t in room) {
							if (this.isUndefined(element[k])) {
								isValid = false;
							}
						}
					});
				} else if (k != 'isPrimary' && this.isUndefined(element[k])) {
					isValid = false;
				}
			}
			if ((index == (array.length - 1)) && (isValid == false)) {
				callback('Please fill all values', isValid);
			} else if ((index == (array.length - 1)) && (isValid == true)) {
				callback(null, isValid);
			}
		});
	}

	public getRecordById(_id, list) {

		let name = '';
		if (this.isUndefined(_id) || this.isArrayEmpty(list)) {
			return name;
		} else {

			list.forEach(element => {
				if (element._id == _id) {
					name = element.name;
				}
			});
			return name;
		}
	}

	public filterPDFRowColumns(data, callback) {
		let _array = [];

		data.forEach(element => {
			let subArr = [];
			element.forEach(val => {
				let str = val.replace(/(\r\n\t|\n|\r\t)/gm, "|");

				// str = $.trim(str);

				str = str.replace(/  /g, '');

				let _spl = str.split('|');

				str.replace('|', '\n');

				let _getRoomPrefix = _spl[0].substr(0, 4);

				_spl[0] = (_getRoomPrefix == 'rrrr') ? '    ' + _spl[0].substring(4) : _spl[0];

				// let returnVal = _spl[0] + ((_spl[1])? ('\n' + _spl[1]) : '');


				let returnVal = _spl[0] + ((_spl[1]) ? ('\n' + _spl[1]) : '\n');
				subArr.push(returnVal);
			});
			_array.push(subArr);
		});
		callback(_array);
	}

	public filterPDFRowColumns2(data, callback) {

		let _array = [];
		data.forEach(element => {
			let subArr = [];
			element.forEach((val, index) => {

				if (index == 0) {
					let str = val.replace(/(\r\n\t|\n|\r\t)/gm, "|");
					// str = $.trim(str);
					str = str.replace(/  /g, '');

					let _spl = str.split('|');

					let _dayPrefix = _spl[0].substr(0, 3);
					let _roomTypePrefix = _spl[0].substr(0, 8);


					str.replace('|', '\n');
					let returnVal = "";
					if (_dayPrefix === 'Day') {
						let _getVal = _spl[0].substring(3);

						// returnVal = _getVal.replace(/  /g,'') + _getVal;
						returnVal = _getVal.replace(/  /g, '') + '\n' + ((_spl[1]) ? _spl[1] : '') + '\n';
					} else if (_roomTypePrefix === 'roomType') {
						let _getVal = _spl[0].substring(8);
						returnVal = _getVal.replace(/  /g, '') + ((_spl[1]) ? (_spl[1].replace(/  /g, '')) : '');
					} else {
						// let returnVal = '\n\n\n' + _spl[0].replace(/ /g,'') + ((_spl[1])? ('\n' + _spl[1].replace(/ /g,'')) : '');
						returnVal = '\n\n\n' + _spl[0].replace(/  /g, '') + ((_spl[1]) ? (_spl[1].replace(/  /g, '')) : '') + '\n';
					}

					subArr.push(returnVal);
				} else {
					let str = val.replace(/(\r\n\t|\n|\r\t)/gm, "|");
					// str = $.trim(str);
					str = str.replace(/  /g, '');

					let _spl = str.split('|');

					str.replace('|', '\n');

					let _dayPrefix = _spl[0].substr(0, 3);

					let returnVal = '';

					str.replace('|', '\n');
					if (_dayPrefix === 'Day') {
						_spl.forEach((s, index) => {
							returnVal += s + ((index == 1 || index == (_spl.length - 1)) ? '\n\n' : '\n');
						});
					} else {
						_spl.forEach((v, inx) => {
							let _getPrefix = _spl[0].replace(/ /g, '').substr(0, 3);

							let _lastSix = _spl[0].substr(_spl[0].length - 6);

							if (inx == 6 && _getPrefix == 'img') {
								returnVal += v + '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
							} else if (v != '') {
								let _getVal = v.substr(0, 3);

								let _getCheckOutVal = v.substr(0, 11);

								let _getV = v.substring(3);
								if (inx == 0 && _getCheckOutVal == 'nmgcheckout') {
									returnVal += v.substring(11) + '\n';
								} else if (inx == 0 && _getCheckOutVal == 'nmgactivity') {
									returnVal += v.substring(11) + '\n';
								} else if (inx == 0 && _getVal == 'nmg') {
									returnVal += '';
								} else if (inx == 8) {
									returnVal += v + '\n\n';
								} else if (inx == 2) {
									// returnVal += v + '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
									returnVal += v + '\n\n';
								}
								// else if(inx == 0 && _getVal == 'img' && _lastSix == 'cruise'){
								// 	returnVal += _getV.substring(0,  _getV.length - 6) + '\n';
								// }
								else if (inx == 0 && _getVal == 'img') {
									returnVal += _getV + '\n';
								} else if (_getCheckOutVal == 'Confirmatio') {
									returnVal += v + '\n';
								} else {
									returnVal += v + '\n\n';
								}
							}
						});
					}

					subArr.push(returnVal);
				}
			});
			_array.push(subArr);
		});
		callback(_array);
	}

	public getColumns(cols) {

		return {

		}
	}

	public getRoleListByUserRole(role) {
		if (role) {
			if (role == 'Manager') {
				return ['Admin', 'Agent', 'Assistant'];
			} else if (role == 'Admin') {
				return ['Agent', 'Assistant'];
			} else {
				return ['Assistant'];
			}
		} else {
			return ['Agent', 'Assistant'];
		}
	}

	public isManagerOrAdmin(role) {
		if (role) {
			if (role == 'Manager' || role == 'Admin') {
				return true;
			} else {
				return false;
			}
		} else {
			false;
		}
	}

	public getCurrentUserId(currentUser) {
		if (currentUser.user) {
			return currentUser.user._id;
		} else {
			"";
		}
	}

	public getCurrentUserRole(currentUser) {
		if (currentUser.user) {
			return currentUser.user.roleName;
		} else {
			"";
		}
	}

	public getLoadingConfig() {
		return this.loadingConfig;
	}

	public getInvoice(newNum) {
		let invoiceNumber = "";

		if (newNum) {
			let x = 100000, y = 1000000;
			let part1 = Math.round(Math.random() * (y - x) + x);
			x = 10000, y = 100000;
			let part2 = Math.round(Math.random() * (y - x) + x);
			let part3 = Math.round(Math.random() * (9));
			invoiceNumber = "" + part1 + "-" + part2 + "-" + part3;
			return invoiceNumber;
		}

	}

	public isValidTelephone(s)
	{
		if(/^\d{10}$/.test(s)== false)
		return false;
		return true;
	}

}


interface Wrapped<T> {
	valueOf(): T;
}

class NumberWrapper {
	constructor(public value: number) { }
	valueOf(): number { return this.value; }
}
