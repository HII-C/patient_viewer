/*
    Description: This file defines the data display for the conditions component
    Date: 3/19/18
    Version: 1.0
    Creator: Steven Tran
*/
import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { CarePlan } from '../models/carePlan.model';

import { ScratchPadService } from '../services/scratchPad.service';

import { ContextMenuComponent } from './contextMenu.component';


@Component({
    selector: 'careplanDisplay',
    templateUrl: '/careplanDisplay.html'
})
export class CarePlanDisplay {
    // The currently selected careplan in the list.
    selected: CarePlan;

    // This is the array of conditions to be displayed
    @Input() carePlans: Array<CarePlan>;
    @Output() careplanSelected: EventEmitter<CarePlan> = new EventEmitter();

    @ViewChild('menu') menu: ContextMenuComponent;

    
    // ===============================================================================================================================================
    // ================================================================== EVENT METHODS ==============================================================
    // ==================================================================---------------==============================================================

    constructor(private scratchPadService: ScratchPadService){}

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
    
    // Refactor the code for care plans
    /*
    //whenver a line is selected
    selectCondition(condition: Condition) {
        this.selected = condition;
        this.conditionSelected.emit(this.selected);
        for (let c of this.scratchPadService.totalConditions) {
            c['selected'] = (c.id == this.selected.id);
        }
    }

    // check if the element has already been selected (n^2 time lol)
    checkClicked(condition: Condition) {
        if (this.scratchPadService.checkedMapConditions.get(condition)){
            return true;
        }

        return false;
    }

    // WHENEVER A CHECKBOX IS CLICKED OR UNCLICKED, IT REGISTERS IT IN THE SCRATCHPADSERVICE (not actually the scratch pad yet)
    checkCondition(checked: boolean, checkedCondition: Condition) {
        this.scratchPadService.checkCondition(checked, checkedCondition);
    }

    expand(parent: string) {
        for (let c of this.carePlans) {
            if (c.parent == parent) {
                c.isVisible = true;
                c.parent = "";
                c.isParent = false;
            }
        }
    }
    */

}