import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'angular2-cookie/core';
import { FhirService } from '../services/fhir.service';
import { PatientService } from '../services/patient.service';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class SmartService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private fhirService: FhirService,
    private patientService: PatientService
  ) { }

  readonly clientId: string = "2c304df8-711d-4de9-afbe-330c01a5ca8e";
  readonly scope: string = "launch patient/*.* openid profile";
  readonly redirectUri: string = "http://localhost:9000";

  fhirBaseUrl: string;
  authorizeUrl: string;
  tokenUrl: string;
  launch: string;
  state: string;
  aud: string;

  authenticate() {
    this.fhirBaseUrl = this.findGetParameter("iss");

    if (this.fhirBaseUrl) {
      // Occurs when arriving to the site for the first time.
      this.aud = this.fhirBaseUrl;
      this.launch = this.findGetParameter("launch");

      this.fhirService.setUrl(this.fhirBaseUrl);

      const url = this.fhirService.getUrl() + '/metadata';
      this.http.get(url, this.fhirService.getRequestOptions(false)).subscribe(data => {
        var smartExtension = data['rest'][0].security.extension.filter(e => {
          return (e.url === "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris");
        });

        var auth;
        var tok;

        smartExtension[0].extension.forEach(arg => {
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
      } else {
        console.log('Stop cross-site scripting please, thanks');
      }
    }
  }

  getToken() {
    var code = this.findGetParameter("code");

    var body = 'code=' + code
      + '&redirect_uri=' + encodeURI(this.redirectUri)
      + '&token_url=' + this.cookieService.get('tokenUrl');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post("https://mongo-proxy.herokuapp.com/token",
      body, { headers: headers });
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
    let result = null;
    let tmp = [];

    location.search.substr(1).split("&").forEach(item => {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });

    return result;
  }
}
