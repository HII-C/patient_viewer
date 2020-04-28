import { Component, ViewChild, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { HoverBoxComponent } from '../../components/hoverBox/hoverBox.component';
import { EncounterService } from '../../services/encounter.service';

import { Encounter } from '../../models/encounter.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'timeline-popup',
  templateUrl: './timeline_popup.html'
})

export class TimelinePopupComponent {
  @ViewChild('hoverBox', { static: false }) hoverBox: HoverBoxComponent;
  @Input() patient: Patient;

  constructor(private encounterService: EncounterService) { }

   datePipe: DatePipe = new DatePipe('en-US');
   encounters: Array<Encounter> = [];
   e: Encounter;
   details : Array<String>;

   ngOnChanges(){
     this.loadEncounters();
   }
   
  open(index : any, event: MouseEvent): void {
    console.log('patient3',this.patient);
    console.log("e is here like : ",this.encounters[index]);
    let details: Array<String>  = [
      'Date: ' + this.datePipe.transform(this.encounters[index].getStartDate(),'MM-dd-yyyy').toString(),
      'Reason: ' + (this.encounters[index].getReason() || 'None')
   ];
 
    this.hoverBox.show(details, event);
     
  }

  close(event: MouseEvent): void {
    this.hoverBox.hide(event);
  }

  private loadEncounters(){
    if (this.patient) {
      this.encounterService.loadEncounters(this.patient).subscribe(encounters => {
        this.encounters = this.encounters.concat(encounters);
        console.log('Loaded ' + this.encounters.length + ' encounters.');
        console.log(this.encounters);

        encounters.forEach(enc => enc.position = enc.getLogValue()/5 + "%")
        encounters.forEach(enc =>  console.log('Log Val pos: ' + enc.getStartDate()))
      });
    }

  }
}

