/*
    Description: This file defines the data display for the observations component
    Date: 3/19/18
    Version: 1.0
    Creator: Steven Tran
*/
import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { Observation } from '../models/observation.model';

import { ScratchPadService } from '../services/scratchPad.service';

import { ContextMenuComponent } from './contextMenu.component';


@Component({
    selector: 'observationsDisplay',
    templateUrl: '/observationsDisplay.html'
})
export class ObservationsDisplay {
    // The currently selected condition in the list.
    selected: Observation;

    // This is the array of conditions to be displayed
    @Input() observations: Array<Observation>;
    @Output() observationSelected: EventEmitter<Observation> = new EventEmitter();

    @ViewChild('menu') menu: ContextMenuComponent;

    // ===============================================================================================================================================
    // ================================================================== EVENT METHODS ==============================================================
    // ==================================================================---------------==============================================================

    constructor(private scratchPadService: ScratchPadService){}

    ngOnChanges() {}

    ngOnInit() {}

    //=================================================================== CONTEXT MENU ==============================================================

    // Can only access view child after the view has been initialized.
    ngAfterViewInit() {
        // Add options to the context menu shown when right clicking conditions.
        this.menu.addOption({
            'icon': 'glyphicon-pencil',
            'text': 'Add to Scratch Pad',
            'exec': function(data) {
                console.log(data);
            }
        });

    this.menu.addOption({
        'icon': 'glyphicon-stats',
        'text': 'Add to Trend Tool',
        'exec': function(data) {
            console.log(data);
        }
    });

    this.menu.addOption({
        'icon': 'glyphicon-random',
            'text': 'Open Association Tool',
            'exec': function(data) {
                console.log(data);
            }
        });
    }

    // FOR MAINTAINING CHECK STATE AFTER LOSING FOCUS
    
    //whenver a line is selected
    selectObservation(observation: Observation) {
        this.selected = observation;
        this.observationSelected.emit(this.selected);

        for (let o of this.scratchPadService.totalObservations) {
            o['selected'] = (o.id == this.selected.id);
        }
    }

    // check if the element has already been selected (n^2 time lol)
    checkClicked(observation: Observation) {
        if (this.scratchPadService.checkedMapObservations.get(observation)){
            return true;
        }

        return false;
    }

    // WHENEVER A CHECKBOX IS CLICKED OR UNCLICKED, IT REGISTERS IT IN THE SCRATCHPADSERVICE (not actually the scratch pad yet)
    checkObservation(checked: boolean, checkedObservation: Observation) {
        this.scratchPadService.checkObservation(checked, checkedObservation);
    }

    expand(parent: string) {
        /** 
        for (let c of this.conditions) {
            if (c.parent == parent) {
                c.isVisible = true;
                c.parent = "";
                c.isParent = false;
            }
        }
        */
    }

}