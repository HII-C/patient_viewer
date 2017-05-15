import {Component, Compiler} from '@angular/core';
import {FhirService} from '../services/fhir.service';
import {ServerService} from '../services/server.service';
import {PatientService} from '../services/patient.service';
import {Patient} from '../models/patient.model';
import {Server} from '../models/server.model';
import {Condition} from '../models/condition.model';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {Http, Headers} from '@angular/http';

@Component({
    selector: 'patients',
    templateUrl: '/patient.html',

    animations: [
      trigger('fadeIn', [
        state('in', style({opacity: '1'})),
        transition('void => *', [
          style({opacity: '0'}),
          animate('800ms ease-in')
        ])
      ])
    ]
})
export class PatientComponent {
    selected: Patient;
    patients: Array<Patient>;
    server: Server;
    servers: Server[] = ServerService.servers;
    selectedCondition: Condition;
    nav2: boolean = false;
    fhirBaseUrl: string;
    authorizeUrl: string;
    tokenUrl: string;
    clientId: string = "160324a1-e8fa-440c-8068-0f482701f1e8";
    launch: string;
    scope: string = "launch patient/*.* openid profile";
    redirectUri: string = "http://localhost:9000";
    state: string = "test";
    aud: string;

    constructor(private fhirService: FhirService, private patientService: PatientService, private compiler: Compiler, private http: Http) {
		this.compiler.clearCache();
        this.authenticate();

        this.selectServer(this.servers[0]);
        this.loadPatients();

    }


    authenticate() {
      this.fhirBaseUrl = this.findGetParameter("iss");
      if(this.fhirBaseUrl) {
        this.aud = this.fhirBaseUrl;
        this.launch = this.findGetParameter("launch");

        this.fhirService.setUrl(this.fhirBaseUrl);
        this.patientService.setPath("/metadata");
        this.patientService.index().subscribe(data => {
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
          });
    }
    requestAuth() {
      //encodeURI

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

    loadPatients() {
      this.patientService.setPath("/Patient");

        this.patientService.index().subscribe(data => {
            console.log(data);
            this.patients = <Array<Patient>>data.entry.map(r => r['resource']);
            console.log("Loaded " + this.total() + " patients.");
            if (this.patients.length > 0) {
                this.select(this.patients[0].id);
            }
        });
    }

    total(): number {
        var t = 0;
        if (this.patients) {
            t = this.patients.length;
        }
        return t;
    }

    select(id) {
        console.log("Selected patient: " + id);
        this.patientService.get(id).subscribe(d => {
            console.log("Fetching: " + d);
            this.selected = <Patient>d; //.entry['resource'];
        });
    }

	selectServer(server: Server) {
		console.log("Setting server to: " + server.url);
		this.server = server;
		this.fhirService.setUrl(server.url);
		this.loadPatients();
	}


    selectServerForUrl(url: string) {
		this.selectServer(this.serverFor(url));
    }

    serverFor(url: string) {
        var obj: Server = null;
        for(var server of this.servers) {
            if (server.url == url) {
                obj = server;
                break;
            }
        }
        return obj;
    }
    genderString(patient: Patient) {
        var s = 'Unknown';
        switch (patient.gender) {
            case 'female':
                s = 'Female';
                break;
            case 'male':
                s = 'Male';
                break;
        }
        return s;
    }

    selectCondition(condition) {
      this.selectedCondition = condition;
      console.log(this.selectedCondition);
    }

    switchNav() {
      this.nav2 = !this.nav2;
    }
}
