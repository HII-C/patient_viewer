import { Component, Input, OnDestroy } from '@angular/core';
import {DraggableWidget} from './draggable_widget.component';
import {NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent} from 'angular2-grid';
import {Subscription} from 'rxjs/Subscription';
import {DoctorService} from '../services/doctor.service';
import {ScratchPadService} from '../services/scratchPad.service';
import {LoupeService} from '../services/loupe.service';
import {Patient} from '../models/patient.model';
import {Condition} from '../models/condition.model';

@Component({
    selector: 'scratchPad',
    templateUrl: 'scratchPad.html'
})

export class ScratchPadComponent implements DraggableWidget, OnDestroy{
    @Input() patient: Patient;
    currentCondSpArray: Array<Condition> = this.scratchPadService.currentCondSpArray;
    subscription: Subscription;
    gridItemConfiguration: NgGridItemConfig = {
		'col': 1,               //  The start column for the item
		'row': 1,               //  The start row for the item
		'sizex': 30,             //  The start width in terms of columns for the item
		'sizey': 30,             //  The start height in terms of rows for the item
		'dragHandle': null,     //  The selector to be used for the drag handle. If null, uses the whole item
		'resizeHandle': null,   //  The selector to be used for the resize handle. If null, uses 'borderSize' pixels from the right for horizontal resize,
		//    'borderSize' pixels from the bottom for vertical, and the square in the corner bottom-right for both
		'borderSize': 15,
		'fixed': false,         //  If the grid item should be cascaded or not. If yes, manual movement is required
		'draggable': this.doctorService.configMode,      //  If the grid item can be dragged. If this or the global setting is set to false, the item cannot be dragged.
		'resizable': this.doctorService.configMode,      //  If the grid item can be resized. If this or the global setting is set to false, the item cannot be resized.
		'payload': null,        //  An optional custom payload (string/number/object) to be used to identify the item for serialization
		'maxCols': 0,           //  The maximum number of columns for a particular item. This value will only override the value from the grid (if set) if it is smaller
		'minCols': 0,           //  The minimum number of columns for a particular item. This value will only override the value from the grid if larger
		'maxRows': 0,           //  The maximum number of rows for a particular item. This value will only override the value from the grid (if set) if it is smaller
		'minRows': 0,           //  The minimum number of rows for a particular item. This value will only override the value from the grid if larger
		'minWidth': 0,          //  The minimum width of a particular item. This value will override the value from the grid, as well as the minimum columns if the resulting size is larger
		'minHeight': 0,         //  The minimum height of a particular item. This value will override the value from the grid, as well as the minimum rows if the resulting size is larger
	}
    constructor(private doctorService: DoctorService, private scratchPadService: ScratchPadService, private loupeService: LoupeService) { 
        console.log("ScratchPadComponent Created...");
        this.subscription = this.scratchPadService.buttonInCondCompClicked$.subscribe(clicked => {
            this.addToScratchPad();
        });
    }

    addToScratchPad(){
        for (let c of this.scratchPadService.toAddToCondSpArray){
            if (this.scratchPadService.currentCondSpArray.indexOf(c) == -1){
                this.scratchPadService.currentCondSpArray.push(c);
            }
            else{
                console.log("This Condition already exists on the scratchPad, duplicates are not allowed");
            }
        };
        this.currentCondSpArray = this.scratchPadService.currentCondSpArray;
        console.log(this.currentCondSpArray);
        // Recursively subscribes, do NOT change the onDestroy method or there will be memory leaks
        this.subscription = this.scratchPadService.buttonInCondCompClicked$.subscribe(clicked => {
            this.addToScratchPad();
        });
    }
    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

}