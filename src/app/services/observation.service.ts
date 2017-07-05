import {Component, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {FhirService} from './fhir.service';
import {Patient} from '../models/patient.model';
import {Observation} from '../models/observation.model';

@Injectable()
@Component({
})
export class ObservationService {
    condensedObservations: Array<Observation> = [];
    temp: any;
    categorizedObservations: any;
    groupList: any;
    count: number = 0;
    private path = '/Observation';
    constructor(private fhirService: FhirService, private http: Http) {
      this.groupList = {
        "1-1":["8302-2","3141-9","2710-2"],
        "1-2":[],
        "1-3":[],
        "1-4":["39156-5","8310-5"],
        "1-5":[],
        "2-1":["2571-8"],
        "2-2-1":["789-8","3094-0","72166-2"],
        "2-2-2":[],
        "2-2-3":["2823-3"]
      };
      this.temp = {"categories":[
        {
          "display":"Vitals",
          "id":"1",
          "count":0,
          "child":[
            {
              "display":"Weight",
              "data":[],
              "count":0,
              "id":"1-1"
            },
            {
              "display":"Blood Pressure",
              "data":[],
              "count":0,
              "id":"1-2"
            },
            {
              "display":"Heart Rate",
              "data":[],
              "count":0,
              "id":"1-3"
            },
            {
              "display":"Respiration Rate",
              "data":[],
              "count":0,
              "id":"1-4"
            },
            {
              "display":"Temperature",
              "data":[],
              "count":0,
              "id":"1-5"
            }
          ]
        },

        {
          "display":"Patient History / Review of Systems",
          "id":"2",
          "count":0,
          "child":[
            {
              "display":"Constitutional Symptoms",
              "data":[],
              "count":0,
              "id":"2-1"
            },
            {
              "display":"Body Systems",
              "child":[
                {
                  "display":"Eyes",
                  "data":[],
                  "count":0,
                  "id":"2-2-1"
                },
                {
                  "display":"Ears, Nose, Mouth and Throat (ENT)",
                  "data":[],
                  "count":0,
                  "id":"2-2-2"
                },
                {
                  "display":"Cardiovascular",
                  "data":[],
                  "count":0,
                  "id":"2-2-3"
                }
              ],
              "count":0,
              "id":"2-2"
            }
          ]
        },
        {
          "display":"Other",
          "id":"3",
          "count":0,
          "data":[]
        }
      ]};
        console.log("ObservationService created...");

    }

    index(patient: Patient): Observable<any> {
        var url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;
		// console.log("ESNUTH");
        return this.http.get(url, this.fhirService.options(true)).map(res => res.json());
    }

    indexNext(url: string): Observable<any> {
      return this.http.get(url, this.fhirService.options(true)).map(res => res.json());

    }
    getKey(value) {
      for(let x in this.groupList) {
        for(let y of this.groupList[x]) {
          if(value==y) {
            return x;
          }
        }
      }

      return "3";
    }
    filterCategory(observations: Array<Observation>) {
      for(let obs of observations) {
        if(!this.containsObject(obs)) {
          console.log(obs['code']['coding'][0]['code']);
          obs.grouping = this.getKey(obs['code']['coding'][0]['code']);
          this.condensedObservations.push(obs);
        }
      }

    }

    containsObject(obj) {
    for (let obs of this.condensedObservations) {
        if (obs['code']['coding'][0]['code'] == obj['code']['coding'][0]['code']) {
            return true;
        }
    }

    return false;
}

populate(obj) {
  let totalcount = 0;
  let count = 0;
  for(let prop = obj.length - 1; prop >= 0; prop--) {
    if (obj[prop].data){
      for(let obs of this.condensedObservations) {
        if(obs.grouping == obj[prop].id) {
          count++;
          obj[prop].data.push({"name":obs['code']['coding'][0]['display'],"date":obs.effectiveDateTime,"code":obs['code']['coding'][0]['code']});
        }
      }
    }
    if(obj[prop].data == "") {
      obj.splice(prop,1);
    }
    else if (obj[prop].data){
        obj[prop].count += count;
        totalcount += count;
        count = 0;
      continue;
    }

    else if (typeof obj[prop] === 'object') {
      totalcount += count;

      let newcount = this.populate(obj[prop].child);
      console.log(newcount,JSON.stringify(obj[prop]));
      obj[prop].count += newcount;

      if(obj[prop].child =="") {
        obj.splice(prop,1);
      }

    }
  }
  //console.log("returning("+JSON.stringify(obj)+") "+totalcount);
  return totalcount;
}

    // get(id): Observable<any> {
    //     var url = this.fhirService.getUrl() + this.path + '/' + id;
    //     return this.http.get(url, this.fhirService.options()).map(res => res.json());
    // }

}
