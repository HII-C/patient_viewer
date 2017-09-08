import {Component, Input, ElementRef} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

import {Patient} from '../models/patient.model';
import {DoctorService} from '../services/doctor.service';
import {ChartTimelineService} from '../services/chartTimeline.service';
import {ToolBarService} from '../services/toolbar.service';


@Component({
	selector: 'toolbar',
	templateUrl: 'toolbar.html'
	// animations: [
	// 	trigger('fadeIn', [
	// 		state('in', style({ opacity: '1' })),
	// 		transition('void => *', [
	// 			style({ opacity: '0' }),
	// 			animate('800ms ease-in')
	// 		])
	// 	])
	// ]
})
export class ToolbarComponent {

	@Input() patient: Patient;

    nav2: boolean = false;

	constructor(private doctorService: DoctorService, private chartService: ChartTimelineService, private elRef:ElementRef, private toolbarService:ToolBarService) {
		console.log("ToolbarComponent created...");
	}

    switchNav() {
		this.nav2 = !this.nav2;
    }

		openGraph() {
			this.chartService.buttonClicked(true);

		}
		updatePosition(ref: ElementRef) {
			console.log(this.elRef.nativeElement.querySelector('div').style.left);
			console.log(this.elRef.nativeElement.querySelector('div').style.top);

			let left = this.elRef.nativeElement.querySelector('div').style.left;
			let top = this.elRef.nativeElement.querySelector('div').style.top;

			this.toolbarService.leftPosition =  (parseInt(left.replace(/px/,""))+150)+"px";
			this.toolbarService.topPosition = (parseInt(top.replace(/px/,""))+100)+"px";

		}


}
