import { Component, Input, ViewChild } from '@angular/core';
import { FhirService } from '../services/fhir.service';
import { TimelineService } from '../services/timeline.service';
import { Timeline } from '../models/timeline.model';
import { Patient } from '../models/patient.model';
import { HoverBoxComponent } from '../components/hoverBox.component';

declare var $: any; //Necessary in order to use jQuery to open popup.

@Component({
  selector: 'timeline-popup',
  templateUrl: '/timeline_popup.html'
})
export class TimelinePopupComponent {
  condition = null;

  constructor(private fhirService: FhirService, private timelineService: TimelineService) { }

  show(timelineItem) {
    this.condition = timelineItem;
    $('#timeline_popup').modal({});
  }

  @ViewChild('hover1') hover1: HoverBoxComponent;
  @ViewChild('hover2') hover2: HoverBoxComponent;

  open(t1, t2, t3, event) {
    if (t1 != null) {
      // document.getElementById('c1').innerHTML = '<h2>' + t1.code['text'] + '</h2>\n<p>' + t1.clinicalStatus + '</p>\n<p>' + new Date(t1.onsetDateTime).toDateString() + '</p>';
      // document.getElementById('c1').style.display = 'inline-block';
      // document.getElementById('c1').hidden = false;
     this.hover1.show([t1.code['text'], t1.clinicalStatus, new Date(t1.onsetDateTime).toDateString()], event);
      
    }
    if (t2 != null) {
      // document.getElementById('c2').innerHTML = '<h2>' + t2.code['text'] + '</h2>\n<p>' + t2.clinicalStatus + '</p>\n<p>' + new Date(t2.onsetDateTime).toDateString() + '</p>';
      // document.getElementById('c2').style.display = 'inline-block';
      // document.getElementById('c2').hidden = false;
      this.hover2.show([t2.code['text'], t2.clinicalStatus, new Date(t2.onsetDateTime).toDateString()], event);
    }
    // if (t3 != null) {
    //   document.getElementById('c3').innerHTML = '<h2>' + t3.code['text'] + '</h2>\n<p>' + t3.clinicalStatus + '</p>\n<p>' + new Date(t3.onsetDateTime).toDateString() + '</p>';
    //   document.getElementById('c3').style.display = 'inline-block';
    //   document.getElementById('c3').hidden = false;
    // }
  }

  close(event) {
    // document.getElementById('c1').innerHTML = '';
    // document.getElementById('c2').innerHTML = '';
    // document.getElementById('c3').innerHTML = '';
    // document.getElementById('c1').style.display = 'none';
    // document.getElementById('c2').style.display = 'none';
    // document.getElementById('c3').style.display = 'none';
    // document.getElementById('c1').hidden = true;
    // document.getElementById('c2').hidden = true;
    // document.getElementById('c3').hidden = true;

    this.hover1.hide(event);
    this.hover2.hide(event);
    
  }
}
