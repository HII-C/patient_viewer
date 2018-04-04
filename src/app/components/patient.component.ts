import { Component, Injectable, Input, Output, ViewChild } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { ConditionService } from "../services/condition.service";
import { Patient } from '../models/patient.model';
import { Server } from '../models/server.model';
import { Condition } from '../models/condition.model';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { HomeComponent } from '../components/home.component';
import { ContextMenuComponent } from "./contextMenu.component";
import { HoverBoxComponent } from './hoverBox.component';


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
  allergies: Array<string> = [];
  allergy: string = '';

  @ViewChild('hover') hover: HoverBoxComponent;

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
          //add allergy strings to allergies
          let entries = allergies.entry;
          for (let e of entries) {
            this.allergies.push(e.resource.code.text);
          }

          //construct displayed allergy string
          if (this.allergies.length == 1) { //singular allergy
            this.allergy = entries[0].resource.code.text;
          }

          else { //multiple allergies
            this.allergy = "multiple";
          }
        }
<<<<<<< HEAD
        else { //no allergies
          this.allergy = "none";
        }
      });
    }
  }

  showAllergyHover(event) {
    // Don't show hover box if there is only one allergy.
    if (this.allergies.length > 1) {
      this.hover.show(this.allergies, event);
=======
    }

    showAllergyHover(event) {
        if (this.allergies.length > 1) {
            this.hover.show(this.allergies, event);
        }
>>>>>>> d630cf874b230cafa262c229981be00ed8cb23fb
    }
  }
}
