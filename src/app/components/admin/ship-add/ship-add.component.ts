import { Component, OnInit } from '@angular/core';
import { CommonAppService, CruiseService } from '../../../services/index';
import { ShipService } from '../../../services/ship.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ship-add',
  providers: [
    CommonAppService,
    ShipService,
    CruiseService
  ],
  templateUrl: './ship-add.component.html',
  styleUrls: ['./ship-add.component.css']
})
export class ShipAddComponent implements OnInit {

  public currentUser: any;
  public shipObject = {
    '_id': '',
    'name': '',
    'cruiseLineId':'',
  };


  public cruiseLines = [];
  public cruiseLineName= '';

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public _commonAppService: CommonAppService,
    public _shipService: ShipService,
    public _cruiseService:CruiseService
  ) {
    _commonAppService.getCurrentUserSession((user) => {
      this.currentUser = user;
      if (_commonAppService.isUndefined(this.currentUser)) {
        window.location.href = '/login';
      } else {
        this.shipObject = {
          '_id': '',
          'name': '',
          'cruiseLineId':'',
        };


        let shipId = _route.snapshot.params['shipId'];
        if (!this._commonAppService.isUndefined(shipId)) {
          this._shipService.getShipById(this.currentUser, shipId)
            .subscribe((data: any) => {
              if (data && data.status == '0') {
                window.location.href = '/dashboard';
              } else {
                setTimeout(() => {
                  this.shipObject = data.result.ship;
                  
                }, 0);

              }
            },
            (error: any) => {
              console.log(' Error while shipById :  ' + JSON.stringify(error));
            });
        }

        this.getAllCruiseLines();
      }
    });

  }

  public ngOnInit() {

  }

  
  public saveShip(flag){

    console.log(this.shipObject);

if(this.shipObject['name']=='' || this.shipObject['cruiseLineId']==''){

    
        this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function (alertRes) {
        });
      
        
    }

     else {
        this._shipService.addUpdateShip(this.currentUser, this.shipObject, this.shipObject['_id'])
        .subscribe((data: any) => {
            if(data.status == '1'){
                this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes){});
            }
            if (data.status == '1' && this.shipObject['_id'] == '') {
                this.shipObject['_id'] = data.result._id;
            }
            if(data.status == '0') {
                this._commonAppService.showErrorMessage('Alert', data.result.error, function(alertRes){});
            }
            if(flag == true){
                this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes){});
              setTimeout(() => {

                    this.closePage();

              },1000);
            }
        },
        (error: any) => {
            this._commonAppService.showErrorMessage('Alert', error, function(alertRes){});
        });
    }
}

public closePage() {

  this._router.navigate(['ships']);
}

public typeaheadOnCruiseLineSelect(e: any): void {
  this.shipObject['cruiseLineId'] = e.item._id;
}

public getAllCruiseLines() {
  let data;
  this._cruiseService.getAllCruiseLines(this.currentUser, data)
    .subscribe(data => {
      this.cruiseLines = data.result.cruiselines;
      this.getCruiseLineById(this.shipObject['cruiseLineId']);
    });   
}

public getCruiseLineById(cruiseLineId) {
  var obj = this.cruiseLines.find((obj) => { return obj._id === cruiseLineId; }); 
    this.cruiseLineName = obj?obj.name:'';
 }
  
  
}

  





