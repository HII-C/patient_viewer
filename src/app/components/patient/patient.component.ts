import { Component, Injectable, Input, Output, ViewChild } from '@angular/core';
import { Http } from '@angular/http';

import { DoctorService } from 'app/services/doctor.service';
import { ConditionService } from 'app/services/condition.service';
import { EncounterService } from 'app/services/encounter.service';
import { CookieService } from 'angular2-cookie/core';

import { HomeComponent } from 'app/components/home/home.component';
import { HoverBoxComponent } from 'app/components/hoverBox/hoverBox.component';

import { Encounter } from 'app/models/encounter.model';
import { Patient } from 'app/models/patient.model';
import { Server } from 'app/models/server.model';
import { Condition } from 'app/models/condition.model';

@Injectable()
@Component({
  selector: 'patient',
  templateUrl: './patient.html'
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
  hoverStyling: boolean = false;
  reason: string = '';

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
      this.loadAllergies();
      this.loadEncounters();
    }
  }

  private loadAllergies(): void {
    this.conditionService.loadAllergies(this.patient).subscribe(allergies => {
      if (allergies) {
        //add allergy strings to allergies
        this.allergies = allergies.map(allergy => allergy.code.text);

        //construct displayed allergy string
        if (this.allergies.length == 1) { //singular allergy
          this.allergy = this.allergies[0];
        }

        else { //multiple allergies
          this.allergy = "multiple...";
          this.hoverStyling = true;
        }
      }
      else { //no allergies
        this.allergy = "none";
      }
    });
  }

  private loadEncounters(): void {
    // TODO: Display the reason for visit retrieved here onto the page.
    this.encounterService.loadEncounters(this.patient).subscribe(res => {
      // Cast the array of encounters to the proper model (Encounter).
      let encounters = <Array<Encounter>>res;

      for (let enc of encounters) {
        let reasonText = enc.getReason();

        // Only print if reasonText is not null.
        if (reasonText) {
          this.reason = reasonText;
        }
      }
    });
  }

  showAllergyHover(event) {
    // Don't show hover box if there is only one allergy.
    if (this.allergies.length > 1) {
      this.hover.show(this.allergies, event);
    }
  }
}
