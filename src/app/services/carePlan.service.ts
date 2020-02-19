import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FhirService } from './fhir.service';

import { Patient } from '../models/patient.model';
import { CarePlan } from '../models/carePlan.model';
import { Medication } from '../models/medication.model';
import { Bundle } from '../models/bundle.model';

@Injectable()
export class CarePlanService {
  private path = '/CarePlan';

  constructor(
    private fhirService: FhirService,
    private http: HttpClient
  ) { }

  // Retrieve care plans for a given patient
  loadCarePlans(patient: Patient): Observable<Array<CarePlan>> {
    let url = this.fhirService.getUrl() + this.path + "?patient=" + patient.id;

    return this.http.get<Bundle>(url, this.fhirService.getRequestOptions())
      .pipe(map(bundle => {
        if (bundle.entry) {
          return <Array<CarePlan>>bundle.entry.map(r => r.resource);
        } else {
          // The patient has no care plans, so return an empty array
          return new Array<CarePlan>();
        }
      }));
  }

  // Retrieve medications for a given patient.
  // If a given medication is taken over multiple periods, it is merged into one.
  loadMedications(patient: Patient): Observable<Array<Medication>> {
    return this.loadCarePlans(patient).pipe(map(carePlans => {
      let medicationMap: Map<string, Medication> = new Map();

      for (let cp of carePlans) {
        let dosageUnits = cp.activity[0].detail.dailyAmount.code;

        // Retrieve the existing medication, or create it if it does not yet exist.
        let med: Medication = medicationMap.get(cp.title) || new Medication(cp.title, dosageUnits);

        // Add a period of usage to the medication.
        med.periods.push({
          start: new Date(cp.period.start),
          end: new Date(cp.period.end),
          dosage: cp.activity[0].detail.dailyAmount.value
        });

        medicationMap.set(cp.title, med);
      }

      return Array.from(medicationMap.values());
    }));
  }
}