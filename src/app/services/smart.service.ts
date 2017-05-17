import {Component, Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {CookieService} from 'angular2-cookie/core';
import {FhirService} from '../services/fhir.service';
<<<<<<< HEAD
import {ServerService} from '../services/server.service';
import {PatientService} from '../services/patient.service';
import {Md5} from 'ts-md5/dist/md5';

@Component({
    selector: 'smart',
    templateUrl: ''
})
export class SmartService {
    fhirBaseUrl: string;
    authorizeUrl: string;
    tokenUrl: string;
    clientId: string = "22e46ae8-7adb-42d8-a92c-ce9e9067b06e";
    launch: string;
    scope: string = "launch patient/*.* openid profile";
    redirectUri: string = "http://localhost:9000";
    state: string = "test";
    aud: string;

    constructor(private fhirService: FhirService, private patientService: PatientService, private http: Http, private cookieService: CookieService) {
        console.log("AppComponent has been initialized.");
    }
=======
import {PatientService} from '../services/patient.service';
import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class SmartService {

    constructor(private fhirService: FhirService, private patientService: PatientService, private http: Http, private cookieService: CookieService) {
        console.log("SmartService has been initialized.");
    }

    fhirBaseUrl: string;
    authorizeUrl: string;
    tokenUrl: string;
    clientId: string = "e647d169-5139-4a4e-8b72-3c8dedb72a73";
    launch: string;
    scope: string = "launch patient/*.* openid profile";
    redirectUri: string = "http://localhost:9000";
    state: string;
    aud: string;

>>>>>>> Dev

    authenticate() {
      this.fhirBaseUrl = this.findGetParameter("iss");
      if(this.fhirBaseUrl) {
        this.aud = this.fhirBaseUrl;
        this.launch = this.findGetParameter("launch");

        this.fhirService.setUrl(this.fhirBaseUrl);
        this.patientService.setPath("/metadata");
<<<<<<< HEAD
        this.patientService.index().subscribe(data => {
            this.authorizeUrl = data.rest[0].security.extension[0].extension[0].valueUri;
            this.tokenUrl = data.rest[0].security.extension[0].extension[1].valueUri;
            this.cookieService.put('tokenUrl', this.tokenUrl);
=======
        this.patientService.index(false).subscribe(data => {
            this.authorizeUrl = data.rest[0].security.extension[0].extension[0].valueUri;
            this.tokenUrl = data.rest[0].security.extension[0].extension[1].valueUri;
            this.cookieService.put('tokenUrl', this.tokenUrl);
            this.cookieService.put('fhirBaseUrl', this.fhirBaseUrl);
>>>>>>> Dev
            this.requestAuth();
        });
      }
      else {
        if (this.cookieService.get('state') == this.findGetParameter('state')){
<<<<<<< HEAD
            console.log("Verification working");
            console.log(this.state);
            this.getToken();
=======
            return this.getToken();
>>>>>>> Dev
          }
        else{
          console.log('Stop cross-site scripting please, thanks');
        }
      }


    }

    getToken() {
<<<<<<< HEAD
      console.log("getting token");
=======
>>>>>>> Dev
      var code = this.findGetParameter("code");
      var body = 'code='+code+'&redirect_uri='+encodeURI(this.redirectUri)+'&token_url='+this.cookieService.get('tokenUrl');

      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

<<<<<<< HEAD
      this.http
        .post("http://mongo-proxy.healthcreek.org/token",
          body, {
            headers: headers
          })
          .map(response => response.json())
          .subscribe(data => {
                console.log("data:"+JSON.stringify(data));
                console.log(data.access_token);
          });
=======
      return this.http.post("http://mongo-proxy.healthcreek.org/token",body, {headers: headers}).map(response => response.json());
>>>>>>> Dev
    }
    requestAuth() {
      //encodeURI
      //TODO Fix hashing method - not sure best way to do it
      this.state = (Md5.hashStr("testing Hasing")).toString();
      this.cookieService.put('state', this.state);
      var request = this.authorizeUrl+"?response_type=code"
      + "&client_id="+this.clientId
      + "&redirect_uri="+this.redirectUri
      + "&launch="+this.launch
      + "&scope="+this.scope
      + "&state="+this.state
      + "&aud="+this.aud;

      window.location.href = encodeURI(request);
    }
    findGetParameter(parameterName) {
      var result = null,
          tmp = [];
      location.search
      .substr(1)
          .split("&")
          .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
      });
      return result;
    }

}
