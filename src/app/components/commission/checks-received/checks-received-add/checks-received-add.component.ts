/**
 * Checks Received Page Component.
 */
import { Component, ViewChild, NgModule, OnInit, Output, AfterViewInit, EventEmitter, OnDestroy, ElementRef, NgZone, Renderer, Directive, Inject, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAppService, UserService,CommissionService,BookingService } from '../../../../services/index';
import { GlobalVariable } from '../../../../services/static-variable';

@Component({
    providers: [
        CommonAppService,
        UserService,
        CommissionService,
        BookingService
    ],
    styleUrls: ['./checks-received-add.component.css'],
    templateUrl: './checks-received-add.component.html'
})

export class ChecksReceivedAddComponent implements OnInit, AfterViewInit {
    public currentUser: any;
    public checkId:string;
    public isEditMode = false;
    public check = {
        checkNumber : "",
        sender : "",
        senderId : "",
        recipient : "",
        date : new Date(),
        amount: 0,
        datevalue: "",
        status : "",
        reconciledAmount : 0,
        bookingPayments: 0
    }
    public suppliersList = [];
    public selectedSender= '';

    public UPbookings = [];
    public UPpageCount = 0;
    public UPlimit = 10;
    public UPtotalRecords = 0;
    public UPcurrentPageCount = 0;
    public UPpagerList = [];
    public UPpgList = {};
    public UPsearchObject = {};

    public Pbookings = [];
    public PpageCount = 0;
    public Plimit = 10;
    public PtotalRecords = 0;
    public PcurrentPageCount = 0;
    public PpagerList = [];
    public PpgList = {};
    public PsearchObject = {};

    public prevReceived=0;
    public currentReconciliation="";
    public receivedModel = {
        receivedAmount : 0,
        bookingId : "",
        limit:0,
        commisionEarned: 0
    }
    @ViewChild('btnModelClose') btnModelClose: ElementRef;
    
    spinnerConfig = {
        bdColor: '#333',
        size: 'large',
        color: '#fff'
    }

    constructor(
        public _route: ActivatedRoute,
        public _router: Router,
        public _commonAppService: CommonAppService,
        public _userService: UserService,
        public _viewContainerRef: ViewContainerRef,
        public _commissionService : CommissionService,
        public _bookingService : BookingService
    ) {
        this._commonAppService.getCurrentUserSession( (user) => {
            this.currentUser = user;
            if (this._commonAppService.isUndefined(this.currentUser)) {
                window.location.href = '/login';
            }
        });

        this.checkId =  _route.snapshot.params['id'];
    }

    public ngOnInit() {
        if(!this._commonAppService.isUndefined(this.checkId))
        {
            this._commissionService.getCheckById(this.currentUser,this.checkId)
            .subscribe((data:any) => {
                if(data.status == "1")
                {
                    this.isEditMode = true;
                    this.check.checkNumber = data.result.check.checkNumber;
                    this.check.date = data.result.check.checkDate;
                    this.check.senderId = data.result.check.senderId;
                    this.check.amount = data.result.check.checkAmount;
                    this.check.recipient = "CupCake Castles Travel Company";
                    this.check.status = data.result.check.status;
                    this.check.reconciledAmount = data.result.check.reconciledAmount;

                    if(data.result.check.bookingPayments != null || data.result.check.bookingPayments!= undefined )
                    {
                        console.log(data.result.check.bookingPayments);
                        this.check.bookingPayments = data.result.check.bookingPayments;
                    }

                    var c = new Date(this.check.date);

                    
                    var tmp =  c.getMonth() + 1;
                    var month = "" + tmp;

                    var day = ""+ c.getDate();
                    var year = ""+ c.getFullYear();
                    
                    if(month.length == 1) month = "0"+ month;
                    if(day.length == 1) day = "0"+ day;
                    this.check.datevalue = "" + year + "-" + month + "-" + day;
                    

                }
                
            })
        }
        else
        {
            this.check.checkNumber = "";
            this.check.date = new Date();
            this.check.senderId = "";
            this.check.amount = 0;
            this.check.recipient = "CupCake Castles Travel Company";
        }
        
        this.getSupplierList();
        this.refreshUPbookingsList();
        this.refreshPbookingsList();
        //this.UPgetBookings(0,10);
    }

    public ngAfterViewInit() {
    }

    public senderSelectChange(e) {
        let id = e.item._id;
        let sender = this.suppliersList.find(i => i._id == id);

        this.check.senderId = sender._id;
        this.check.sender = sender.name;
        
        //this.isValidatedTripData();
    }

    // getAgentList, getAgentListOptions and agentslist completed
    public getSupplierList() {
        let THIS = this;
        THIS._commissionService.getAllSuppliers(THIS.currentUser, {})
            .subscribe((data: any) => {
                if (data.status == '1') {
                        THIS.selectedSender = ''; 
                        THIS.suppliersList = THIS.getSupplierListOptions(data.result.suppliers);
                                           
                } else {
                    THIS.suppliersList = [];
                }
                // THIS.getClientList();
            },
                (error: any) => {
                    console.log(' Error while getAllSuppliers :  ' + JSON.stringify(error));
                });

    }

    public getSupplierListOptions(suppliers) {
        var supplierList = [];
        for (var i = 0; i < suppliers.length; i++) {
            supplierList.push({
                name: suppliers[i].name,
                _id: suppliers[i]._id,
            });

            if(suppliers[i]._id == this.check.senderId )
            {
                this.selectedSender = suppliers[i].name;
                this.check.sender = this.selectedSender;
               
            }

        }
        
        return supplierList;
    }   
    
    public saveCheck(close =0)
    {
        if(!this.isValidatedData())
        {
            return;
        }

        if(this.isEditMode)
        {
            var data = {
                checkNumber : this.check.checkNumber,
                checkDate : this.check.datevalue ,
                senderId : this.check.senderId,
                recipient : this.check.recipient,
                checkAmount : this.check.amount
            }
            
            this._commissionService.updateCheckById(this.currentUser,data,this.checkId)
            .subscribe((res:any) => {
                if(res.status == '1')
                {
                    this._commonAppService.showSuccessMessage('Alert', res.result.message, (alertRes) => {});
                    setTimeout (() => {
                        if(close == 1)
                        this._router.navigate(['/checksreceiveds']);
                    }, 2000);
                }
                else
                {
                    this._commonAppService.showErrorMessage('Alert',res.result.message, (alertRes)=>{} );
                }
                
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
            });
        }
        else
        {
            var data = {
                checkNumber : this.check.checkNumber,
                checkDate : this.check.datevalue ,
                senderId : this.check.senderId,
                recipient : this.check.recipient,
                checkAmount : this.check.amount
            }
            this._commissionService.addCheck(this.currentUser,data)
            .subscribe((res:any) => {
                if(res.status == '1')
                {
                    this._commonAppService.showSuccessMessage('Alert', res.result.message, (alertRes) => {});
                    setTimeout (() => {
                        if(close == 0)
                        this._router.navigate(['/checksreceived/editChecksReceived/'+res.result._id]);    
                        else
                        this._router.navigate(['/checksreceiveds']);
                    }, 2000);
                }
                else
                {
                    this._commonAppService.showErrorMessage('Alert',res.result.message, (alertRes)=>{} );
                }
                
            },
            (error: any) => {
                this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
            });
        
        }
    }

    public deleteCheck()
    {
        this._commonAppService.showConfirmDialog(this._commonAppService.removeConfirmMessage,  (confirmRes) => {
            if (confirmRes == true) {

                this._commissionService.removeCheckById(this.currentUser,this.checkId)
                .subscribe((data: any) => {
                    if(data.status == true){
                        
                        this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) {
                        });

                        setTimeout (() => {
                            this._router.navigate(['/checksreceived/addChecksReceived']);    
                         }, 2000);
                        
                        
                    }
                    else{
                    
                        this._commonAppService.showErrorMessage('Error', data.result.message, function (alertRes) {
                        });
                    }
                    
                },
                (error: any) => {
                    this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
                });
                
            }
        });
    
    }

    public isValidatedData(){
        if (this.check.checkNumber.trim() === '') {
            this.showValidationMessage('Check Number is required');
            return false;
        }
        if (!this.check.amount) {
            this.showValidationMessage('Check amount is required');
            return false;
        }
        if(this.check.amount <1){
            this.showValidationMessage('Check amount cannot be negative');
            return false;
        }
        if(this.check.datevalue.trim() === '' )
        {
            this.showValidationMessage('Check Date is required');
            return false;
        }
        if(this.selectedSender.trim() === '' )
        {
            this.showValidationMessage('Sender is required');
            return false;
        }
        return true;
    }

    public showValidationMessage(message) {
        this._commonAppService.showErrorMessage('Alert', message, function (alertRes) {
        });
    }

    public UPcurrentPageCountEvent($event){
        this.UPcurrentPageCount = $event;
        this.UPgetBookings(this.UPcurrentPageCount, this.UPlimit);
    }

    public UPlimitChangeEvent($event){
        this.UPlimit = $event;
        this.UPgetBookings(0, this.UPlimit);
    }

    public UPgetBookings(pageCount, limit){
        
        let data = { 'pageCount': this.UPcurrentPageCount, 'limit': limit };
        data['search'] = this.UPsearchObject;
        data['forCheck'] = true;

        if(this.UPsearchObject['Number'] || this.UPsearchObject['startDate'] || this.UPsearchObject['groupNumber'] || this.UPsearchObject['tripDescription'] || this.UPsearchObject['clientName'] ){}
        else
        {
            this._commonAppService.spinner.show();
        }

        // filter by commission recieved

        this._bookingService.getBookings(this.currentUser, data)
            .subscribe((data:any) => {
                if(data.status == '1')
                {
                    this.UPbookings = data.result.bookings;
                    this.UPtotalRecords = data.result.totalRecords;
                    let _pList = this._commonAppService.getPagerList(this.UPtotalRecords, this.UPlimit, this.UPcurrentPageCount);
                    this.UPpgList = (_pList) ? _pList : [];
                    
                    console.log(this.UPbookings);
                }
                else
                {
                    this.UPbookings = [];
                    this.UPtotalRecords = 0;
                    this.UPpagerList = [];
                    this.UPpgList['pages'] = [];
                    console.log("err");
                }

                this._commonAppService.spinner.hide();

            },(err:any)=>{

                console.log(' Error while getAllChecks :  ' + JSON.stringify(err));
                this._commonAppService.spinner.hide();
            });
    }

    public refreshUPbookingsList(){
        this.UPsearchObject = {};
        this.UPbookings = [];
        this.UPpageCount = 0;
        this.UPlimit = 10;
        this.UPtotalRecords = 0;
        //this.currentPageCount = 0;
        
        this.UPpagerList = [];
        this.UPpgList['pages'] = [];
     
        this.UPgetBookings(this.UPcurrentPageCount, this.UPlimit);

    }

    public PcurrentPageCountEvent($event){
        this.PcurrentPageCount = $event;
        this.PgetBookings(this.PcurrentPageCount, this.Plimit);
    }

    public PlimitChangeEvent($event){
        this.Plimit = $event;
        this.PgetBookings(0, this.Plimit);
    }

    public PgetBookings(pageCount, limit){
        
        let data = { 'pageCount': this.PcurrentPageCount, 'limit': limit };
        data['search'] = this.UPsearchObject;
        

        if(this.PsearchObject['Number'] || this.PsearchObject['startDate'] || this.PsearchObject['groupNumber'] || this.PsearchObject['tripDescription'] || this.PsearchObject['clientName'] ){}
        else
        {
            this._commonAppService.spinner.show();
        }

        // filter by commission recieved

        this._commissionService.getPaidBookings(this.currentUser, this.checkId)
            .subscribe((data:any) => {
                console.log(data);
                if(data.status == '1')
                {
                    this.Pbookings = data.result.reconciliations;
                    this.PtotalRecords = data.result.totalRecords;
                    let _pListP = this._commonAppService.getPagerList(this.UPtotalRecords, this.UPlimit, this.UPcurrentPageCount);
                    this.PpgList = ( _pListP) ? _pListP: [];
                    for(var i=0;i<this.Pbookings.length;i++)
                    {
                        for(var j=0;j<data.result.bookings.length;j++)
                        {
                            console.log(data.result.bookings[j])
                            if(this.Pbookings[i].bookingId == data.result.bookings[j]._id)
                            {
                                
                                this.Pbookings[i]['bookingNumber'] = data.result.bookings[j].bookingNumber;
                                this.Pbookings[i]['tourOperator'] = data.result.bookings[j].tourOperatorId;
                                this.Pbookings[i]['description'] = data.result.bookings[j].description;
                                this.Pbookings[i]['earned'] = data.result.bookings[j].commisionEarned;
                                break;
                            }
                        }
                        
                    }
                    console.log(this.Pbookings);
                }
                else
                {
                    this.Pbookings = [];
                    this.PtotalRecords = 0;
                    this.PpagerList = [];
                    this.PpgList['pages'] = [];
                    console.log("err");
                }

                this._commonAppService.spinner.hide();

            },(err:any)=>{

                console.log(' Error while getAllChecks :  ' + JSON.stringify(err));
                this._commonAppService.spinner.hide();
            });
    }

    public refreshPbookingsList(){
        this.PsearchObject = {};
        this.Pbookings = [];
        this.PpageCount = 0;
        this.Plimit = 10;
        this.PtotalRecords = 0;
        //this.currentPageCount = 0;
        
        this.PpagerList = [];
        this.PpgList['pages'] = [];
     
        this.PgetBookings(this.PcurrentPageCount, this.Plimit);

    }

    public addReconciliation(bookingId, index)
    {
        console.log(this.UPbookings[index]);
        console.log(bookingId);
        
        for(var i=0;i<this.Pbookings.length ;i++)
        {
            if(bookingId == this.Pbookings[i].bookingId)
            {
                this._commonAppService.showErrorMessage('Alert', "Booking already reconciled against this check", function (alertRes) {});
                setTimeout(()=>{
                    this.btnModelClose.nativeElement.click();
                },1000);
                
                return ;
            }
        }
        
        this.receivedModel.bookingId = bookingId;
        var x = 0;
        if(this.UPbookings[index].commisionReceived)
        {
            x = this.UPbookings[index].commisionReceived;
        }
        this.receivedModel.commisionEarned = this.UPbookings[index].commisionEarned;
        this.receivedModel.receivedAmount = this.UPbookings[index].commisionEarned - x;
        this.receivedModel.limit = this.UPbookings[index].commisionEarned - x;
        console.log(this.receivedModel.receivedAmount + " " + this.UPbookings[index].commisionEarned );
    }

    public saveReconciliation()
    {
        if(this.prevReceived)
        {
            this.saveEditReconciliation();
            return ;   
        }
        if(this.receivedModel.receivedAmount < 0)
        {
            this._commonAppService.showErrorMessage('Alert', "Amount cannot be negative", function (alertRes) {});
            return ;
        }
        else if(!this.receivedModel.receivedAmount)
        {
            this._commonAppService.showErrorMessage('Alert', "Amount cannot be zero", function (alertRes) {});
            return ;
        }
        else if(this.receivedModel.receivedAmount + this.check.reconciledAmount > this.check.amount )
        {
            this._commonAppService.showErrorMessage('Alert', "Reconciliation amount exceeded check amount", function (alertRes) {});
            return ;
        }
        else if(this.receivedModel.receivedAmount > this.receivedModel.limit )
        {
            this._commonAppService.showErrorMessage('Alert', "You can't receive more than Commission earned ", function (alertRes) {});
            return ;
        }

        this.btnModelClose.nativeElement.click();

        var data = {
            receivedAmount : Number(this.receivedModel.receivedAmount),
            checkId : this.checkId,
            bookingId : this.receivedModel.bookingId
        }

        this._commissionService.addReconciliation(this.currentUser ,data)
            .subscribe((data:any) => {
                if(data.status=='1')
                {
                    this._commonAppService.showSuccessMessage('Alert', data.result.message, (alertRes) => {});    
                    this.refreshUPbookingsList();
                    this.refreshPbookingsList();
                    this.check.reconciledAmount = Number(this.check.reconciledAmount) + Number(this.receivedModel.receivedAmount);
                    this.check.bookingPayments = Number(this.check.bookingPayments) + Number(this.receivedModel.commisionEarned);
                }
                else
                {
                    this._commonAppService.showErrorMessage('Alert', data.result.error, function (alertRes) { });
                }
            },
            (err)=>{
                this._commonAppService.showErrorMessage('Alert', err, function (alertRes) { });
            });

    }

    public editReconcilation(reconciliationId,bookingId,receivedAmount){
        console.log(reconciliationId);
        console.log(bookingId);
        console.log(receivedAmount);
        this.prevReceived = receivedAmount;
        this.currentReconciliation = reconciliationId;
        this.receivedModel.receivedAmount = this.prevReceived; 
        this.receivedModel.bookingId = bookingId;

    }

    public saveEditReconciliation()
    {
        
        if(this.receivedModel.receivedAmount < 0)
        {
            this._commonAppService.showErrorMessage('Alert', "Amount cannot be negative", function (alertRes) {});
            return ;
        }
        else if(!this.receivedModel.receivedAmount)
        {
            this._commonAppService.showErrorMessage('Alert', "Amount cannot be zero", function (alertRes) {});
            return ;
        }
        else if(this.receivedModel.receivedAmount + this.check.reconciledAmount > this.check.amount )
        {
            this._commonAppService.showErrorMessage('Alert', "Reconciliation amount exceeded check amount", function (alertRes) {});
            return ;
        }
        else if(this.receivedModel.receivedAmount > this.receivedModel.limit )
        {
            this._commonAppService.showErrorMessage('Alert', "You can't receive more than Commission earned ", function (alertRes) {});
            return ;
        }

        var data = {
            bookingId : this.receivedModel.bookingId,
            checkId : this.checkId,
            receivedAmount : this.receivedModel.receivedAmount-this.prevReceived,
            reconciliationId : this.currentReconciliation
        }

        this._commissionService.editReconciliation(this.currentUser,data)
            .subscribe((data:any)=>{
                if(data.status== '1')
                {
                    this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) {
                    });
                }
                else
                {
                    this._commonAppService.showSuccessMessage('Alert', data.result.error, function (alertRes) {
                    });
                }
            });

        this.prevReceived = 0;
    }

}
