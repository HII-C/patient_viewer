import { Component, Input } from '@angular/core';

import { FhirService } from '../services/fhir.service';
import { TimelineService } from '../services/timeline.service';
import { EncounterService } from '../services/encounter.service';
import { DoctorService } from '../services/doctor.service';
import { Timeline } from '../models/timeline.model';
import { Encounter } from '../models/encounter.model';
import { Patient } from '../models/patient.model';

@Component({
  selector: 'timelines',
  templateUrl: '/timeline.html'
})
export class TimelineComponent {
  selected: Timeline;
  timeline: Array<Timeline> = [];
  encounters: Array<Encounter> = [];
  @Input() patient: Patient;

  // For options: https://github.com/BTMorton/angular2-grid
  constructor(
    private fhirService: FhirService,
    private timelineService: TimelineService,
    private encounterService: EncounterService,
    private doctorService: DoctorService
  ) { }

  ngOnChanges() {
    if (this.patient) {
      this.loadEncounters();
      this.timelineService.index(this.patient).subscribe(data => {
        if (data.entry) {
          this.timeline = <Array<Timeline>>data.entry.map(r => r['resource']);
          this.timeline = this.timeline.reverse();
          console.log("Loaded " + this.timeline.length + " timelines.");
          console.log(this.timeline);
        } else {
          this.timeline = new Array<Timeline>();
          console.log("No timelines for patient.");
        }
      });
    }
  }

  private loadEncounters(): void {
    if (this.patient) {
      this.encounterService.loadEncounters(this.patient).subscribe(encounters => {
        this.encounters = encounters;
        console.log('Loaded ' + this.encounters.length + ' encounters.');
        console.log(this.encounters);
      });
    }
  }
}
