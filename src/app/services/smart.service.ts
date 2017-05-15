import {Component, Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {FhirService} from '../services/fhir.service';
import {ServerService} from '../services/server.service';
import {PatientService} from '../services/patient.service';

@Component({
    selector: 'smart',
    templateUrl: ''
})
export class SmartService {
    fhirBaseUrl: string;
    authorizeUrl: string;
    tokenUrl: string;
    clientId: string = "160324a1-e8fa-440c-8068-0f482701f1e8";
    launch: string;
    scope: string = "launch patient/*.* openid profile";
    redirectUri: string = "http://localhost:9000";
    state: string = "test";
    aud: string;
    token: string;
    patient: string;

    constructor(private fhirService: FhirService, private patientService: PatientService, private http: Http) {
        console.log("AppComponent has been initialized.");
    }

    authenticate() {
      this.fhirBaseUrl = this.findGetParameter("iss");
      if(this.fhirBaseUrl) {
        this.aud = this.fhirBaseUrl;
        this.launch = this.findGetParameter("launch");

        this.fhirService.setUrl(this.fhirBaseUrl);
        this.patientService.setPath("/metadata");
        this.patientService.index2().subscribe(data => {
            this.authorizeUrl = data.rest[0].security.extension[0].extension[0].valueUri;
            this.tokenUrl = data.rest[0].security.extension[0].extension[1].valueUri;
            this.requestAuth();
        });
      }
      else {
        this.getToken();
      }


    }

    getToken() {
      console.log("getting token");
      var code = this.findGetParameter("code");
      var body = 'code='+code+'&redirect_uri='+encodeURI(this.redirectUri);

      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http
        .post("http://mongo-proxy.healthcreek.org/token",
          body, {
            headers: headers
          })
          .map(response => response.json())
          .subscribe(data => {
                console.log("data:"+JSON.stringify(data));
                console.log(data.access_token);
                this.token = data.access_token;
                this.patient = data.patient;
                this.fhirService.setToken(this.token);
          });
    }
    requestAuth() {
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
