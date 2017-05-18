import {Component, Input} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

import {DraggableWidget} from './draggable_widget.component';

import {Patient} from '../models/patient.model';

@Component({
	selector: 'toolbar',
	templateUrl: '/toolbar.html',

	animations: [
		trigger('fadeIn', [
			state('in', style({ opacity: '1' })),
			transition('void => *', [
				style({ opacity: '0' }),
				animate('800ms ease-in')
			])
		])
	]
})
export class ToolbarComponent implements DraggableWidget {

	@Input() patient: Patient;

    nav2: boolean = false;
	gridItemConfiguration = {}; // For options: https://github.com/BTMorton/angular2-grid

	constructor() {
		console.log("ToolbarComponent created...");

	}

    switchNav() {
		this.nav2 = !this.nav2;
    }

}
