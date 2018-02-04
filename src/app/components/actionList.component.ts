import { Component, Compiler } from '@angular/core';
import { FhirService } from '../services/fhir.service';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.model';
import { Server } from '../models/server.model';
import { Condition } from '../models/condition.model';

@Component({
  selector: 'actionList',
  templateUrl: '/activities.html'
})
export class ActionListComponent {
  constructor(private fhirService: FhirService, private patientService: PatientService, private compiler: Compiler) { }
}
