import {Component, Input} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';

import {DraggableWidget} from './draggable_widget.component';

import {Patient} from '../models/patient.model';

@Component({
	selector: 'toolbar',
	templateUrl: '/toolbar.html'
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

	// angular2-grid: https://github.com/BTMorton/angular2-grid
	gridItemConfiguration: NgGridItemConfig = {
		'col': 50,               //  The start column for the item
		'row': 1,               //  The start row for the item
		'sizex': 40,             //  The start width in terms of columns for the item
		'sizey': 4,             //  The start height in terms of rows for the item
		'dragHandle': null,     //  The selector to be used for the drag handle. If null, uses the whole item
		'resizeHandle': null,   //  The selector to be used for the resize handle. If null, uses 'borderSize' pixels from the right for horizontal resize,
		//    'borderSize' pixels from the bottom for vertical, and the square in the corner bottom-right for both
		'borderSize': 15,
		'fixed': false,         //  If the grid item should be cascaded or not. If yes, manual movement is required
		'draggable': true,      //  If the grid item can be dragged. If this or the global setting is set to false, the item cannot be dragged.
		'resizable': false      //  If the grid item can be resized. If this or the global setting is set to false, the item cannot be resized.
		// 'payload': null,        //  An optional custom payload (string/number/object) to be used to identify the item for serialization
		// 'maxCols': 38,           //  The maximum number of columns for a particular item. This value will only override the value from the grid (if set) if it is smaller
		// 'minCols': 38,           //  The minimum number of columns for a particular item. This value will only override the value from the grid if larger
		// 'maxRows': 8,           //  The maximum number of rows for a particular item. This value will only override the value from the grid (if set) if it is smaller
		// 'minRows': 8,           //  The minimum number of rows for a particular item. This value will only override the value from the grid if larger
		// 'minWidth': 0,          //  The minimum width of a particular item. This value will override the value from the grid, as well as the minimum columns if the resulting size is larger
		// 'minHeight': 0,         //  The minimum height of a particular item. This value will override the value from the grid, as well as the minimum rows if the resulting size is larger
	}

	constructor() {
		console.log("ToolbarComponent created...");

	}

    switchNav() {
		this.nav2 = !this.nav2;
    }

}
