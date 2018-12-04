/**
 * Payments Tab Page Component.
 */
// tslint:disable-next-line:max-line-length
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, TripService, UserService, PaymentService,BookingService, ClientService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';
import { DatePipe } from '@angular/common';

@Component({
    providers: [
        CommonAppService,
        TripService,
        UserService,
        PaymentService,
        ClientService
    ],
    selector: 'payments-tab',
    styleUrls: ['./payments-tab.component.css'],
    templateUrl: './payments-tab.component.html'
})

export class PaymentsTabComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public pageCount = 0;
    public limit = 10;
    public totalRecords = 0;
    public currentPageCount = 0;
    public pagerList = [];
    public pgList = {};
    public payments = [];
    public payeeClientList = [];
    public statusTypes = [];
    public travelersList = [];
    public packagePrice = 0;
    public totalPaid = 0;
    public bookings = [];
    public  bookingWithPayments = [];
    public bookingNumberList = [];
    public addBookingLoading =false;
    public loading = false;
    public bookingInfo = {};
    public bookingNumber = '';
    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    }
    @Input('tripObject') tripObject;
    @Input('travelerDetails') travelerDetails;
    @ViewChild('btnPaymentModelClose') btnPaymentModelClose: ElementRef;
    @Output() updateCount = new EventEmitter();
    @Output() isReflectPayment = new EventEmitter();
    @Input('showBookingTab') showBookingTab;
    public newPayment = {
        'payeeClientId': '', 
        'bookingNumber': '', 
        'paymentDate': this._datePipe.transform(new Date(),'yyyy-MM-dd'),
        'paymentAmount': "0", 
        'paymentType': '', 
        'clientCreditCard': '', 
        'description': '', 
        'paymentStatus': 'Active',
        'tripId': '',
        '_id': 0
    };
    public prevPaymentAmount=0;

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _tripService: TripService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef,
        public _paymentService:PaymentService,
        public _bookingService:BookingService,
        private _datePipe: DatePipe,
        public _clientService : ClientService
    ) {
        this._commonAppService.getCurrentUserSession( (user)  => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            } else {
               // this.RefreshPayments();
                this.getStatusTypes();
              
            }
        });
    }
    
    public ngAfterViewInit() {
        this.getPayments(this.pageCount, this.limit);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tripObject) {
            if (!this._commonAppService.isUndefined(this.tripObject) &&
            !this._commonAppService.isUndefined(this.tripObject._id)) {
                this.RefreshPayments();
                let travelerDetails = this.tripObject.travelerDetails;
                this.travelersList = this.getTravelerList(travelerDetails);
             
                //this.doAsyncTask();
            }
        }
        // if(changes.travelerDetails){
        //     this.travelersList = this.getTravelerList(this.travelerDetails);
        // }
        if(changes.showBookingTab){
            this.travelersList = this.getTravelerList(this.travelerDetails);
            
        }
        
    }

    public ngOnInit() {
        this._bookingService.initEditBooking$.subscribe(_bookingInfo => {
            if (!this._commonAppService.isUndefined(_bookingInfo._id)){
                  this.bookingInfo = _bookingInfo;
                  this.packagePrice = _bookingInfo.packagePrice;
                //   this.bookingNumber = _bookingInfo.bookingNumber;
                  this.RefreshPayments();
                // this.commisionNametoShow = _bookingInfo.alternateCommision;
            }
          });
          this._commonAppService.spinner.show();
    }

    public getTravelerList(travelerDetails){
        var list = [],person;
        
        for(var i=0;i<travelerDetails.length;i++)
        {
            person = travelerDetails[i];
            if(person.travelerType == 'primary'){
                this._clientService.getClientById(this.currentUser,person.travelerId)
                .subscribe((data:any)=> {
                    if(data.status != '0')
                    {
                        list.push({
                            name:data.result.client.firstName + ' ' + data.result.client.lastName,
                            val: data.result.client._id
                        })
                    }
                });
            }
        }
        return list;
    }
    
    public getNewPayment() {
        return {
            'payeeClientId': '', 
             'bookingNumber': this.bookingInfo['bookingNumber'], 
             'paymentDate': this._datePipe.transform(new Date(),'yyyy-MM-dd'),
             'paymentAmount': this.getBalance().toString(), 
            'paymentType': '', 
            'clientCreditCard': '', 
            'description': '', 
            'paymentStatus': 'Active',
            'tripId': this.tripObject._id,
            '_id': 0
        };
    }
       
    public getBalance(){
        var paid= 0,balance = 0,packagePrice = this.bookingInfo['packagePrice'],
        bookingNumber = this.bookingInfo['bookingNumber'];

        if(packagePrice!==''){
            balance = parseFloat(packagePrice);
        }

        for(var i=0;i<this.payments.length;i++){
            if(this.payments[i]['bookingNumber'] === bookingNumber){
                paid = paid + parseFloat(this.payments[i]['paymentAmount']);
            }
        }
        paid = paid - this.prevPaymentAmount;
        balance = balance-paid;
       return balance;
    }

    public RefreshPayments() {
     if(!this._commonAppService.isUndefined(this.tripObject._id)){
        if(this.bookingInfo && this.bookingInfo['_id'] &&
            this.tripObject._id ){
                 this.getPayments(0, 10);
         }
     }
    }

    public getClientName(id){
        
        /*this._clientService.getClientById(this.currentUser,id)
            .subscribe((data:any)=> {
                if(data.status != '0')
                {
                    return data.result.client.firstName + ' ' + data.result.client.lastName;
                }
            });*/
                
        for(var i = 0;i<this.travelersList.length;i++){
            if(this.travelersList[i].val === id){
                 return this.travelersList[i].name;
            }
        }
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

    public addNewPayment() {
        /*setTimeout(() => {
            this.btnPaymentModelClose.nativeElement.click();
        }, 2000);*/
        this.newPayment = this.getNewPayment();
        if(this.getBalance()== 0){
           
            this._commonAppService.showErrorMessage('Alert', "No balance is remaining in this booking", function (alertRes) {
            });

            return;
        }

        if(this.travelersList.length ==0)
        {
            this.btnPaymentModelClose.nativeElement.click();
            this._commonAppService.showAlertBox("Travellers are not added to this trip yet. <br/> Add Traveller before doing any payment.","","error");
            
            
            return;
        }
    }

    public editPayment(_payment) {
        // this.newTask = _task;
        this.newPayment = _payment;
        this.prevPaymentAmount = parseFloat(this.newPayment.paymentAmount);
    }
    public getPayments(pageCount, limit) {
        //this.loading = true;
        this.currentPageCount = pageCount;
        let data = {
            "pageCount": pageCount,
            "limit": limit,
            tripId: this.tripObject._id,
            bookingNumber: this.bookingInfo['bookingNumber'] 
        };

        this._commonAppService.spinner.show();
        this._paymentService.getPayments(this.currentUser, data)
            .subscribe((data: any) => {
                if (data.status === '1') {
                    this.payments = data.result.payments;
                    this.totalRecords = data.result.totalRecords;
                    this.updateCount.emit({payments:this.totalRecords});
                    let _pList = this._commonAppService.getPagerList(this.totalRecords, this.limit, pageCount);
                    this.pgList = (_pList) ? _pList : [];
                    
                    this.setTotalPaid();
                    this.payeeClientList =[];
                    
                    // don till here
                    for(var i = 0;i< this.payments.length;i++)
                    {
                        this.payments[i].clientName = this.getClientName(this.payments[i].payeeClientId);
                        this.payeeClientList.push(this.getClientName(this.payments[i].payeeClientId));
                        
                    }
            

                } else {
                    this.payments = [];
                    this.totalRecords = 0;
                    this.updateCount.emit({payments:this.totalRecords});
                    this.pagerList = [];
                    this.pgList['pages'] = [];
                }
                
                this._commonAppService.spinner.hide();
            },
            (error: any) => {
                console.log(' Error while getAllPayments :  ' + JSON.stringify(error));
                
                this._commonAppService.spinner.hide();
            });
        setTimeout( ()=> {
            this._commonAppService.spinner.hide();
        }, 1000);
    }

    public setTotalPaid(){
        var _payments =  this.payments;
        var _totalPaid = 0;
         for(var i = 0;i<_payments.length;i++){
              _totalPaid = _totalPaid + parseFloat(_payments[i].paymentAmount);
         }
         this.totalPaid = _totalPaid;
    }

    public savePayment() {
        if(this.getBalance()== 0){
           
            this._commonAppService.showErrorMessage('Alert', "No balance is remaining in this booking", function (alertRes) {
            });
            return;
        }
       
        
        if(parseFloat(this.newPayment.paymentAmount) < 1 )
        {
            this._commonAppService.showErrorMessage('Alert', "Payment amount cannot be 0.", function (alertRes) {
            });
            return;
        }
        if(parseFloat(this.newPayment.paymentAmount) > ( Number(this.packagePrice) +this.prevPaymentAmount -this.totalPaid))
        {
            
            this._commonAppService.showErrorMessage('Alert', "Payment amount should not more than balance amount.", function (alertRes) {
            });
            return;
        }
        this.prevPaymentAmount =0;
        var data = this.newPayment;
        if (!this.isValidatedData(data)) {
            return;
        }

        this.saveData(data,  (res) => {
            this.btnPaymentModelClose.nativeElement.click();
            this._commonAppService.showSuccessMessage('Alert', res.result.message, function (alertRes) {
            });
            this.RefreshPayments();
            this.totalRecords = res.result.totalRecords;
        });
    }

    public saveData(data, callback) {
        //this.loading = true;
        if (data["_id"] !== 0) {
            this._paymentService.updatePaymentById(this.currentUser, data)
                .subscribe((res: any) => {
                    if (res.status === '1') {
                        callback(res);
                    } else {
                        this._commonAppService.showErrorMessage('Alert', res.result.message, function (alertRes) {
                        });
                    }
                },
                (error: any) => {
                    console.log(' Error while updatePaymentById :  ' + JSON.stringify(error));
                });
        } else {
            this._paymentService.addPayment(this.currentUser, data)
                .subscribe((res: any) => {
                    if (res.status === '1') {
                        callback(res);
                    } else {
                        this._commonAppService.showErrorMessage('Alert', res.result.message, function (alertRes) {
                        });
                    }
                    this.reflectPayment();
                },
                (error: any) => {
                    console.log(' Error while addPayment :  ' + JSON.stringify(error));
                });
        }
    }

    public reflectPayment(){
        this.isReflectPayment.emit(true);
    }

    public showValidationMessage(message) {
        this._commonAppService.showErrorMessage('Alert', message, function (alertRes) {
        });
    }

    public isValidatedData(payment) {
        if (payment.bookingNumber.trim() === '') {
            this.showValidationMessage('Booking Number is required');
            return false;
        }
        if(payment.paymentDate.trim() === ''){
            this.showValidationMessage('Payment Date is required');
            return false;
        }
        if(payment.paymentAmount.agentId === ''){
            this.showValidationMessage('Payment Amount To is required');
            return false;
        }
        if(payment.paymentType === ''){
            this.showValidationMessage('Payment Type is required');
            return false;
        }
      
        return true;
    }
    // public bookingSelectChange(_payment,val){
    //     _payment.paymentAmount = this.bookingNumberList.filter(x => x.bookingNumber ==val)[0].balance;
    // }

//    public doAsyncTask() {
//         this.addBookingLoading = true;
//         Promise.all([
//             this.getBookingsAsync(),
//             this.getPaymentsAsync()
//         ]).then(value => {
//           var _bookings = this.bookings;
//           var _bookingWithPayments =this.bookingWithPayments;
//           this.bookingNumberList = [];
//           for(var i = 0;i<_bookings.length;i++){
//               var _bookingNumberItem = {};
//               _bookingNumberItem ={  
//                 bookingNumber:_bookings[i].bookingNumber,
//                 packagePrice:_bookings[i].packagePrice,
//                 paid:0,
//                 balance:0
//             };
//            if(this.setPaymentDetailsByBookingNumber(_bookingNumberItem)){
//               this.bookingNumberList.push(_bookingNumberItem);
//            }
           
//           }
//           this.addBookingLoading = false;
//         });
//     }
    
    // public setPaymentDetailsByBookingNumber(_bookingNumberItem){
    //     var paid= 0,balance = 0;
    //     if(_bookingNumberItem.packagePrice!==''){
    //         balance = parseFloat(_bookingNumberItem.packagePrice);
    //     }

    //     for(var i=0;i<this.bookingWithPayments.length;i++){
    //         if(this.bookingWithPayments[i]['bookingNumber'] === _bookingNumberItem.bookingNumber){
    //             paid = paid + parseFloat(this.bookingWithPayments[i]['paymentAmount']);
    //         }
    //     }
    //     if(balance != paid){
    //     balance = balance-paid;
    //     _bookingNumberItem.paid = paid;
    //     _bookingNumberItem.balance = balance;
    //     return _bookingNumberItem;
    //     }
    //     else{
    //         return null;
    //     }
    // }
        // public getBookingsAsync(){
    //     var promise = new Promise((resolve, reject) => {
    //         let THIS = this;
    //         let data = {
    //             "pageCount": 0,
    //             "limit": 50,
    //             tripId: THIS.tripObject._id,
    //         };
    //         THIS._bookingService.getBookings(THIS.currentUser, data)
    //             .subscribe((data: any) => {
    //                 if (data.status === '1') {
    //                     THIS.bookings = data.result.bookings;
    //                     resolve();
    //                 } else {
    //                     THIS.bookings = [];
    //                     resolve();
    //                 }
    //             },
    //             (error: any) => {
    //                 reject();
    //             });
    //       });
    //       return promise;  
    // }
    // public getPaymentsAsync(){
    //     var promise = new Promise((resolve, reject) => {
    //     let data = {
    //         tripId: this.tripObject._id
    //     };
    //     this._paymentService.getAllBookingWithPayments(this.currentUser, data)
    //         .subscribe((data: any) => {
    //             if (data.status === '1') {
    //                 this.bookingWithPayments =data.result.payments;
    //                 resolve();
    //             } else {
    //                 this.bookingWithPayments = [];
    //                 resolve();
    //             }
    //         },
    //         (error: any) => {
    //             reject();
    //         });
    //     });
    //     return promise;  
    // }
}
