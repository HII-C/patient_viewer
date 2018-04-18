import { Component, Injectable, Input, Output, ViewChild } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { ConditionService } from '../services/condition.service';
import { EncounterService } from '../services/encounter.service';
import { Encounter } from '../models/encounter.model';
import { Patient } from '../models/patient.model';
import { Server } from '../models/server.model';
import { Condition } from '../models/condition.model';
import { Http, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { HomeComponent } from '../components/home.component';
import { ContextMenuComponent } from './contextMenu.component';
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
    private conditionService: ConditionService,
    private encounterService: EncounterService) {

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
        else { //no allergies
          this.allergy = "none";
        }
      });

      // TODO: Display the reason for visit retrieved here onto the page.
      this.encounterService.loadEncounters(this.patient).subscribe(res => {
        // Cast the array of encounters to the proper model (Encounter).
        let encounters = <Array<Encounter>>res;

        for (let enc of encounters) {
          let reasonText = enc.getReason();

          // Only print if reasonText is not null.
          if (reasonText) {
            console.log(reasonText);
          }
        }
      });
    }
  }

  showAllergyHover(event) {
    // Don't show hover box if there is only one allergy.
    if (this.allergies.length > 1) {
      this.hover.show(this.allergies, event);
    }
  }
}
