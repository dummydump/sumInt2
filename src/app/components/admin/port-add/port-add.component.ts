import { trim } from 'jquery';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonAppService } from '../../../services/index';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PortService } from '../../../services/port.service';
import { CountryService } from '../../../services/country.service';
import { StateService } from '../../../services/state.service';
import { CityService } from '../../../services/city.service';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-port-add',
  providers: [
    CommonAppService,
    PortService,
    CountryService,
    StateService,
    CityService
  ],
  templateUrl: './port-add.component.html',
  styleUrls: ['./port-add.component.css']
})
export class PortAddComponent implements OnInit {
  public currentUser: any;
  public portObject = {
    '_id': '',
    'name': '',
    'city': '',
    'state': '',
    'country': '',
    'main_image_url': '',
    'descriptionHTML': ''

  };
  public currentContent = '';
  @ViewChild('noteEditor') noteEditor: ElementRef;

  public countries = [];
  public cities = [];
  public stateList = [];

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public _commonAppService: CommonAppService,
    public _portService: PortService,
    public _countryService: CountryService,
    public _stateService: StateService,
    private _sanitizer: DomSanitizer,
    public _cityService: CityService
  ) {
    _commonAppService.getCurrentUserSession((user) => {
      this.currentUser = user;
      if (_commonAppService.isUndefined(this.currentUser)) {
        window.location.href = '/login';
      } else {
        this.portObject = {
          '_id': '',
          'name': '',
          'city': '',
          'state': '',
          'country': '',
          'main_image_url': '',
          'descriptionHTML': ''
        };


        let portId = _route.snapshot.params['portId'];
        if (!this._commonAppService.isUndefined(portId)) {
          this._portService.getPortById(this.currentUser, portId)
            .subscribe((data: any) => {
              if (data && data.status == '0') {
                window.location.href = '/dashboard';
              } else {
                setTimeout(() => {
                  this.portObject = data.result.port;
                  console.log(this.portObject);
                  this.getStateByselectedCountry(this.portObject.country);
                  this.getCityByselectedState(this.portObject.state);
                }, 0);

              }
            },
              (error: any) => {
                console.log(' Error while portById :  ' + JSON.stringify(error));
              });
        }
      }
    });

  }

  ngOnInit() {


  let data = {};
        this._countryService.getAllCountries(this.currentUser,data)
           .subscribe(data => {
                   console.log('country',data.result.countries);
                    for(let i =0 ;i<data.result.countries.length;i++){
                      this.countries.push(data.result.countries[i]);
                   }



           });


  }


  public getStateByselectedCountry(value){

  this._stateService.getAllStatesByCountryId(this.currentUser,value)
      .subscribe(data => {

        console.log('STATES->', data.result.states);
        for (let i = 0; i < data.result.states.length; i++) {
          this.stateList.push(data.result.states[i]);
        }

      });



  }


  public getCityByselectedState(value){
this._cityService.getAllCitiesByStateId(this.currentUser, value)
      .subscribe(data => {

        console.log('CITIES->', data.result.cities);
        for (let i = 0; i < data.result.cities.length; i++) {
          this.cities.push(data.result.cities[i]);
        }

      });
  }


  public countrySelected($event) {
    this.portObject.state = '';
    this.portObject.city = '';
    this.stateList = [];
    this.cities = [];
    console.log('HEREEE');
    console.log('==>', $event.target.value);
    let data = {};
    this._stateService.getAllStatesByCountryId(this.currentUser, $event.target.value)
      .subscribe(data => {

        console.log('STATES->', data.result.states);
        for (let i = 0; i < data.result.states.length; i++) {
          this.stateList.push(data.result.states[i]);
        }

      });

  }

  public stateSelected($event) {
    // this.portObject.state = '';
    this.portObject.city = '';
    this.cities = [];
    console.log('HEREEE');
    console.log('==>', $event.target.value);
    let data = {};
    this._cityService.getAllCitiesByStateId(this.currentUser, $event.target.value)
      .subscribe(data => {

        console.log('CITIES->', data.result.cities);
        for (let i = 0; i < data.result.cities.length; i++) {
          this.cities.push(data.result.cities[i]);
        }

      });

  }


  public sanitizeHtml(_content) {
    return this._sanitizer.bypassSecurityTrustHtml(_content);
  }

  public formateInnerHtml(htmlString, callback) {
    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(htmlString, "text/html");
    $(htmlDoc.body).find("p").attr("style", "font-size : 10px !important;");
    $(htmlDoc.body).find("h1").attr('style', 'font-size : 12px !important;');
    $(htmlDoc.body).find("h2").attr('style', 'font-size : 12px !important;');
    $(htmlDoc.body).find("h3").attr('style', 'font-size : 12px !important;');
    $(htmlDoc.body).find("h4").attr('style', 'font-size : 12px !important;');
    $(htmlDoc.body).find("h5").attr('style', 'font-size : 12px !important;');
    $(htmlDoc.body).find("strong").attr('style', 'font-size : 12px !important;');
    $(htmlDoc.body).find("b").attr('style', 'font-size : 12px !important;');

    let HTML = htmlDoc.body.innerHTML;
    console.log("HTML : " + HTML);
    // let test = this._sanitizer.bypassSecurityTrustHtml(HTML+"<script>ourSafeCode()</script>");
    let test = this.sanitizeHtml(HTML);
    callback(HTML);
  }

  public savePort(flag) {

    if (this.portObject['name'] == '') {
      this._commonAppService.showErrorMessage('Alert', this._commonAppService.requiredFieldMessage, function (alertRes) {

      });
    } else {
      this.formateInnerHtml(this.portObject.descriptionHTML, (html) => {

        html = html.toString().replace("SafeValue must use [property]=binding:", "");
        html = html.toString().replace("(see http://g.co/ng/security#xss)", "");

        this.portObject.descriptionHTML = html.replace(/"/g, "'");

        this._portService.addUpdatePort(this.currentUser, this.portObject, this.portObject['_id'])
        .subscribe((data: any) => {
            if(data.status == '1'){
                console.log(data);
                this._commonAppService.showSuccessMessage('Alert', data.result.message, function(alertRes){});
            }
            if (data.status == '1' && this.portObject['_id'] == '') {

                this.portObject['_id'] = data.result._id;

            }

            if (data.status == '0') {
              this._commonAppService.showErrorMessage('Alert', data.result.error, function (alertRes) { });
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
      });
    }
  }


  public closePage() {
    this._router.navigate(['ports']);
  }



  public editorOption = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      //['blockquote', 'code-block'],

      // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      //[{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      //[{ 'font': [] }],
      [{ align: ['', 'right', 'center', 'justify'] }],
      // [{ align: ''},{align: 'right'},{align: 'center'} ,{ align: 'justify' }],

      // ['clean'],                                         // remove formatting button
      ['link', 'image'],

      // ['link', 'image', 'video']                         // link and image, video
    ]
  }

  public EditorContentChange(event) {
    this.portObject.descriptionHTML = event;
    console.log(this.portObject);
  }


}
