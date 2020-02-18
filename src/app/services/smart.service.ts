import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { FhirService } from '../services/fhir.service';
import { PatientService } from '../services/patient.service';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class SmartService {
  constructor(private fhirService: FhirService, private patientService: PatientService, private http: Http, private cookieService: CookieService) { }

  fhirBaseUrl: string;
  authorizeUrl: string;
  tokenUrl: string;
  clientId: string = "2c304df8-711d-4de9-afbe-330c01a5ca8e";
  launch: string;
  scope: string = "launch patient/*.* openid profile";
  // redirectUri: string = "http://patient-viewer.healthcreek.org";
  redirectUri: string = "http://localhost:9000";
  state: string;
  aud: string;

  authenticate() {
    this.fhirBaseUrl = this.findGetParameter("iss");

    if (this.fhirBaseUrl) {
      // Occurs when arriving to the site for the first time.

      this.aud = this.fhirBaseUrl;
      this.launch = this.findGetParameter("launch");

      this.fhirService.setUrl(this.fhirBaseUrl);
      this.patientService.setPath("/metadata");

      this.patientService.index(false).subscribe(data => {
        var smartExtension = data.rest[0].security.extension.filter(function(e) {
          return (e.url === "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris");
        });

        var auth;
        var tok;

        smartExtension[0].extension.forEach(function(arg, index, array) {
          if (arg.url === "authorize") {
            auth = arg.valueUri;
          } else if (arg.url === "token") {
            tok = arg.valueUri;
          }
        });

        this.tokenUrl = tok;
        this.authorizeUrl = auth;

        this.cookieService.put('tokenUrl', this.tokenUrl);
        this.cookieService.put('fhirBaseUrl', this.fhirBaseUrl);

        this.requestAuth();
      });
    } else {
      // Occurs when arriving to the site after the redirect.

      if (this.cookieService.get('state') == this.findGetParameter('state')) {
        return this.getToken();
      }
      else {
        console.log('Stop cross-site scripting please, thanks');
      }
    }
  }

  getToken() {
    var code = this.findGetParameter("code");

    var body = 'code=' + code
      + '&redirect_uri=' + encodeURI(this.redirectUri)
      + '&token_url=' + this.cookieService.get('tokenUrl');

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post("https://mongo-proxy.herokuapp.com/token",
      body, { headers: headers }).map(res => res.json());
  }

  requestAuth() {
    //TODO Fix hashing method - not sure best way to do it

    this.state = (Md5.hashStr("testing Hasing")).toString();
    this.cookieService.put('state', this.state);

    var request = this.authorizeUrl + "?response_type=code"
      + "&client_id=" + this.clientId
      + "&redirect_uri=" + this.redirectUri
      + "&launch=" + this.launch
      + "&scope=" + this.scope
      + "&state=" + this.state
      + "&aud=" + this.aud;

    // Comment out the below line for debugging purposes.
    window.location.href = encodeURI(request);
  }

  findGetParameter(parameterName) {
    var result = null,
      tmp = [];

    location.search.substr(1).split("&").forEach(function(item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });

    return result;
  }
}
