import { Component, Injectable, Input, Output, ViewChild } from '@angular/core';

import { DoctorService } from '../../services/doctor.service';
import { ConditionService } from '../../services/condition.service';
import { EncounterService } from '../../services/encounter.service';
import { CookieService } from 'ngx-cookie-service';

import { HomeComponent } from '../../components/home/home.component';
import { HoverBoxComponent } from '../hoverBox/hoverBox.component';

import { Encounter } from '../../models/encounter.model';
import { Patient } from '../../models/patient.model';
import { Server } from '../../models/server.model';
import { Condition } from '../../models/condition.model';

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

  @ViewChild('hover', { static: false }) hover: HoverBoxComponent;

  constructor(
    private cookieService: CookieService,
    private doctorService: DoctorService,
    private homeComponent: HomeComponent,
    private conditionService: ConditionService,
    private encounterService: EncounterService
  ) {
    this.graphConfig = JSON.parse(this.cookieService.get('graphConfig') || '{}');
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

        // Construct displayed allergy string
        if (this.allergies.length == 0) {
          this.allergy = "None";
        } else if (this.allergies.length == 1) {
          this.allergy = this.allergies[0];
        } else {
          this.allergy = "Multiple...";
          this.hoverStyling = true;
        }
      }
      else { //no allergies
        this.allergy = "None";
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
