import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonAppService, CruiseService } from '../../../services/index';
import { UserService } from '../../../services/user.service';
import { Router,ActivatedRoute } from '@angular/router';
import { ShipService } from '../../../services/ship.service';
import { PortService } from '../../../services/port.service';

@Component({
  selector: 'app-add-cruise-itineraries',
  providers: [
    CommonAppService,
    UserService,
    CruiseService,
    ShipService,
    PortService

  ],
  templateUrl: './add-cruise-itineraries.component.html',
  styleUrls: ['./add-cruise-itineraries.component.css']
})
export class AddCruiseItinerariesComponent implements OnInit {

  public currentContent = '';
  @ViewChild('noteEditor') noteEditor: ElementRef;


  public currentUser: any;
  public cruiseLines = [];
  public ships = [];
  public ports = [];
  public shipName = '';
  public cruiseLineName = '';
  public portName = '';
  public cruiseItineraryObject = {
    '_id': '',
    'title': '',
    'cruise_line_id':'',
    'shipId': '',
    'departure_port_id': '',
    'no_of_day': '',
    'itinerary': [],
    'price': '',
    'descriptionHTML': '',

  };

  public disabledSubmitBtn = false;

  public cruiseItineraryList = [];

  public isinEditMode = false;

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public _commonAppService: CommonAppService,
    public _userService: UserService,
    public _cruiseService: CruiseService,
    public _shipService: ShipService,
    public _portService: PortService
  ) {
	
    _commonAppService.getCurrentUserSession((user) => {
      this.currentUser = user;
      if (_commonAppService.isUndefined(this.currentUser)) {
        window.location.href = '/login';
      } else if (!_commonAppService.isManagerOrAdmin(this.currentUser.user.roleName)) {
        window.location.href = '/dashboard';
      }
    });

    let cruiseItinerariesId = _route.snapshot.params['cruiseItinerariesId'];
   

    if (!_commonAppService.isUndefined(cruiseItinerariesId)) {
              this.isinEditMode = true;
            _cruiseService.getCruiseItineraryById(this.currentUser, cruiseItinerariesId)
            .subscribe((data: any) => {
                console.log(data);
                setTimeout(() => {
                    this.cruiseItineraryObject = data.result.cruiseitinerary;
                    console.log(data);
                    this.getAllShips();
                    this.getAllCruiseLines();
                    this.getAllPorts();
                }, 0);
            },
            (error: any) => {
                console.log(' Error while getCruiseItineraryById :  ' + JSON.stringify(error));
            });
    }
  }

  public noOfDaysChange(value: string) {
    
     let no = parseInt(value);

if(isNaN(no)){
    this.cruiseItineraryObject.itinerary = [];
}else if(no <= 30){
           if(parseInt(value) > this.cruiseItineraryObject.itinerary.length)
           {let pushNo = parseInt(value) - this.cruiseItineraryObject.itinerary.length;
                    for(let i=0;i<pushNo+1;i++){
                      this.cruiseItineraryObject.itinerary.push({
                       "depTime": "", "arrivalTime": "", "port_id": "", "dayNo": i
                      });
                  }
           }else if(this.cruiseItineraryObject.itinerary.length > parseInt(value)){
             let pushNo = this.cruiseItineraryObject.itinerary.length - parseInt(value);
              for(let i=0;i<pushNo-1;i++){
                this.cruiseItineraryObject.itinerary.pop();
              }
           }
}else{
       this.cruiseItineraryObject.no_of_day = '';
        this.cruiseItineraryObject.itinerary = [];
       this._commonAppService.showErrorMessage('Alert','More than 30 days is not allowed.', function (alertRes) { });
     }
  }

  ngOnInit() {
    this.getAllShips();
    this.getAllCruiseLines();
    this.getAllPorts();
  }

	
  public getAllShips() {
    let data: any;
    this._shipService.getShips(this.currentUser, data)
      .subscribe(data => {
        this.ships = data.result.ships;
        if(this.isinEditMode){
            this.ships.forEach((obj) => {
                if(obj._id === this.cruiseItineraryObject['shipId']){
                  this.shipName = obj.name;
                }
            });
        }
      });
  }

  public getAllCruiseLines() {
    let data;
    this._cruiseService.getAllCruiseLines(this.currentUser, data)
      .subscribe(data => {
        this.cruiseLines = data.result.cruiselines;
        if(this.isinEditMode){
  this.cruiseLines.forEach((obj) => {
      if(obj._id === this.cruiseItineraryObject['cruise_line_id'])
      {
      this.cruiseLineName = obj.name;
      }
            })
        }
      });
  }


  public inputTextAllItinerary(index,value){
      this.cruiseItineraryObject.itinerary[index].port = value;
      this.cruiseItineraryObject.itinerary[index].port_id = "";

  }

  public getAllPorts() {
    let data;
    this._portService.getAllPorts(this.currentUser, data)
      .subscribe(data => {
        this.ports = data.result.ports;
        if(this.isinEditMode){

this.ports.forEach((obj) => {
  
  if(obj._id === this.cruiseItineraryObject['departure_port_id']){
    this.portName = obj.name;
  }

})
  
this.cruiseItineraryObject['itinerary'].forEach((obj) => {
        if(obj){
              this.ports.map((obj1) => {
                if(obj.port_id === obj1._id){
                  obj.port = obj1.name;
                  obj1.port_id = "";
                }
              })
        }
     });
  }
      });
  }

  public validatePrice(value: string) {
    let re = value;
    let result = re.toString().includes(".");
    if(parseInt(re) <= 0){
      return "Negative value is not allowed"
    }else {
      if (result) {
        let value_splitted = re.toString().split('.');
        if (value_splitted[1].length > 2) {
          return "More than 2 digits are not allowed";
        } else {
          return parseFloat(re);
        }
      } else {
        return parseInt(re);
      }
    }
    
  }

  public  validateShip(value:any){
        let result = false;
        this.ships.forEach((obj) => {
            let objLowerCase = obj.name.toLowerCase();
            let valLowerCase = value.toLowerCase();
            if(objLowerCase === valLowerCase){
                this.cruiseItineraryObject['shipId'] = obj._id;
                result = true;
            }
        });
        return result;
  }


  public  validateCruiseLine(value:any){
    let result = false;
        this.cruiseLines.forEach((obj) => {
            let objLowerCase = obj.name.toLowerCase();
            let valLowerCase = value.toLowerCase();
            if(objLowerCase === valLowerCase){
                this.cruiseItineraryObject['cruise_line_id'] = obj._id;
                result = true;
            }
        });
        return result;
  }

  public validatePort(value:any){
     let result = false;
        this.ports.forEach((obj) => {
          let objLowerCase = obj.name.toLowerCase();
          let valLowerCase = value.toLowerCase();
            if(objLowerCase === valLowerCase){
                this.cruiseItineraryObject['departure_port_id'] = obj._id;
                result = true;
            }
        });
        return result;
  }

  public validateAllPorts(index,value){

    var result = this.ports.filter((obj) => {
          return obj.name.toLowerCase() === value.toLowerCase();
    });

    console.log(result);

    if(result.length){
      this.cruiseItineraryObject.itinerary[index].port_id = result[0]._id;
      this.cruiseItineraryObject.itinerary[index].port = result[0].name;
      }else{
      this.cruiseItineraryObject.itinerary[index].port_id = "";
      this.cruiseItineraryObject.itinerary[index].port = "";
      }
 
  }

  public saveCruiseItinerary(flag) {
    let valPort = this.validatePort(this.portName);
    let valCruiseLine = this.validateCruiseLine(this.cruiseLineName);
    let valShip = this.validateShip(this.shipName);
    console.log('this is cruiseLine',valCruiseLine,'this is a port',valPort,'this is a ship',valShip);
    let res = this.validatePrice(this.cruiseItineraryObject['price']);
    if (this.cruiseItineraryObject['title'] === '') {
      this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function (alertRes) { });
    }else if(!valPort){
       this._commonAppService.showErrorMessage('Alert', 'please select right port' , function (alertRes) { });
    }else if(!valCruiseLine){
       this._commonAppService.showErrorMessage('Alert', 'please select right cruise' , function (alertRes) { });
    }else if(!valShip){
       this._commonAppService.showErrorMessage('Alert', 'please select right ship' , function (alertRes) { });
    }else if(res==="More than 2 digits are not allowed" || res==="Negative value is not allowed"){
        this._commonAppService.showErrorMessage('Alert', res, function (alertRes) { });
    }
    else {
      this._cruiseService.addUpdateCruiseItinerary(this.currentUser, this.cruiseItineraryObject, this.cruiseItineraryObject['_id'])
        .subscribe((data: any) => {
          if (data.status == '1') {
            this._commonAppService.showSuccessMessage('Alert', data.result.message, function (alertRes) { });
          }
          if (data.status == '1' && this.cruiseItineraryObject['_id'] == '') {
            this.cruiseItineraryObject['_id'] = data.result._id;
          }
          if (data.status == '0') {
            this._commonAppService.showErrorMessage('Alert', 'Something bad happens', function (alertRes) { });
          }
          if (flag == true) {
            this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes){});
              setTimeout(() => {
                    this.closePage();
              },1000);

          }
        },
        (error: any) => {
          this._commonAppService.showErrorMessage('Alert', error, function (alertRes) { });
        });
    }
  }

  public typeaheadOnShipSelect(e: any): void {
    this.shipName = e.item.name;
    this.cruiseItineraryObject['shipId'] = e.item._id;
  }

  public typeaheadOnCruiseLineSelect(e: any): void {
    this.cruiseLineName=e.item.name;
    this.cruiseItineraryObject['cruise_line_id'] = e.item._id;

  }

  public typeaheadOnDeparturePortSelect(e: any): void {
    this.portName = e.item.name;
    this.cruiseItineraryObject['departure_port_id'] = e.item._id;
  }

  public inputShip(value:any){
      this.shipName = value;
  }

  public inputCruiseLine(value:any){
      this.cruiseLineName = value;
  }

  public inputPort(value:any){
      this.portName = value;
  }



  public typeaheadOnPortSelect(event, index) {
    this.cruiseItineraryObject['itinerary'][index].port_id = event.item._id;
    this.cruiseItineraryObject['itinerary'][index].port = event.item.name;
    console.log(this.cruiseItineraryObject);
  }
  // public newCruiseItinerarie() {
  //   let _tempcruiseItinerarieList = this.cruiseItineraryList;
  //   _tempcruiseItinerarieList.push({ 'dayNo': '', 'port_id': '', 'arrivalTime': '', 'depTime': '' });
  //   this.cruiseItineraryList = _tempcruiseItinerarieList;
  //   this.cruiseItineraryObject['itinerary'] = this.cruiseItineraryList;
  // }

  public removeCruiseItinerarie(index) {
    this.cruiseItineraryList.splice(index, 1);
  }

  public closePage() {
    this._router.navigate(['cruiseitineraries']);
  }

  public editorOption = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled button
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ align: ['', 'right', 'center', 'justify'] }],
      ['link', 'image'],
    ]
  }

  public EditorContentChange(event) {
    this.cruiseItineraryObject['descriptionHTML'] = event;
  }

  

}
