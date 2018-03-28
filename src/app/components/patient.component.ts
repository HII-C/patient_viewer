import {Component, Injectable, Input, Output, ViewChild} from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { ConditionService } from "../services/condition.service";
import { Patient } from '../models/patient.model';
import { Server } from '../models/server.model';
import { Condition } from '../models/condition.model';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { HomeComponent } from '../components/home.component';
import { AllergyHoverComponent } from '../components/allergyHover.component';
import {ContextMenuComponent} from "./contextMenu.component";


@Injectable()
@Component({
  selector: 'patient',
  templateUrl: '/patient.html'
})
export class PatientComponent {
  @Input() patient: Patient;
  server: Server;
  selectedCondition: Condition;
  advancedSearch = false;
  graphConfig: any;

  //allergy details
  allergyArray: Array<string> = [];
  allergy: string = '';
  allAllergies: string = '';

  @ViewChild('hover') hover: AllergyHoverComponent;

  // For options: https://github.com/BTMorton/angular2-grid

  constructor(private http: Http,
    private cookieService: CookieService,
    private doctorService: DoctorService,
    private homeComponent: HomeComponent,
    private conditionService: ConditionService) {

    this.graphConfig = this.cookieService.getObject("graphConfig");
    // this.cookieService.remove("graphConfig");
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
  }

  ngOnChanges() {
      if (this.patient) {
          this.conditionService.loadAllergies(this.patient, true).subscribe(allergies => {
              if (allergies.entry) {
                  //add allergy strings to allergyArray
                  let entries = allergies.entry;
                  for (let e of entries) {
                      this.allergyArray.push(e.resource.code.text);
                  }

                  //construct displayed allergy string
                  if (this.allergyArray.length == 1) { //singular allergy
                      this.allergy = entries[0].resource.code.text;
                  }

                  else { //multiple allergies
                      this.allergy = "multiple";
                      for (let a of this.allergyArray) {
                          this.allAllergies += a + ", ";
                          console.log(this.allAllergies);
                      }
                  }
              }
              else { //no allergies
                  this.allergy = "none";
              }
          });
      }
  }

  mouseEnter() {
      console.log("mouse entered");

  }

  mouseLeave() {
      console.log("mouse left");
  }
}
