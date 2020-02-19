/*
    Description: This file defines the data display for the observations component
    Date: 3/19/18
    Version: 1.0
    Creator: Steven Tran
*/
import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';

import { ScratchPadService } from '../../services/scratchPad.service';
import { AssociationService } from '../../services/association.service';

import { ContextMenuComponent } from '../contextMenu/contextMenu.component';

import { Observation } from '../../models/observation.model';

@Component({
  selector: 'observationsDisplay',
  templateUrl: './observationsDisplay.html'
})
export class ObservationsDisplay {
  // Trick to allow access to static methods of Observation class in pug template
  Observation = Observation;

  // The currently selected condition in the list.
  selected: Observation;

  //Whether the checkbox for checking all observations are currently checked
  isAllChecked : boolean = false;

  // This is the array of conditions to be displayed
  @Input() observations: Array<Observation>;
  @Output() observationSelected: EventEmitter<Observation> = new EventEmitter();

  @ViewChild('menu') menu: ContextMenuComponent;

  // ===============================================================================================================================================
  // ================================================================== EVENT METHODS ==============================================================
  // ==================================================================---------------==============================================================

  constructor(
    private associationService: AssociationService, 
    private scratchPadService: ScratchPadService
  ) { }

  ngOnChanges() {
    //console.log(this.observations);
  }

  ngOnInit() { }

  //=================================================================== CONTEXT MENU ==============================================================

  // Can only access view child after the view has been initialized.
  ngAfterViewInit() {
    // NOTE: 'exec' functions must be bound to 'this' to access scratchPadService.
    // This is a strange behavior with scoping in Typescript/Javascript.
    
    // Add options to the context menu shown when right clicking observations.
    this.menu.addOption({
      'icon': 'glyphicon-pencil',
      'text': 'Add to Scratch Pad',
      'exec': function(obs) {
        // Add every checked observation to the scratch pad
        this.scratchPadService.checkedMapObservations.forEach((isChecked, observation) => {
          if (isChecked) {
            this.scratchPadService.addObservation(observation);
          }
        });
      }.bind(this)
    });

    this.menu.addOption({
      'icon': 'glyphicon-stats',
      'text': 'Add to Trend Tool',
      'exec': function(obs) {
        console.log(obs);
      }.bind(this)
    });

    this.menu.addOption({
      'icon': 'glyphicon-random',
      'text': 'Open Association Tool',
      'exec': function(obs) {
        console.log(obs);
      }.bind(this)
    });
  }

  // FOR MAINTAINING CHECK STATE AFTER LOSING FOCUS

  // Whenever a line is selected
  selectObservation(observation: Observation) {
    this.selected = observation;
    this.observationSelected.emit(this.selected);

    for (let o of this.scratchPadService.totalObservations) {
      o['selected'] = (o.id == this.selected.id);
    }
  }

  // Determine whether an observation is currently checked.
  isObservationChecked(observation: Observation) {
    return this.scratchPadService.checkedMapObservations.get(observation) || false;
  }

  // WHENEVER A CHECKBOX IS CLICKED OR UNCLICKED, IT REGISTERS IT IN THE SCRATCHPADSERVICE (not actually the scratch pad yet)
  checkObservation(checked: boolean, checkedObservation: Observation) {
    this.scratchPadService.checkObservation(checked, checkedObservation);
  }
  
  //Check or uncheck all observations
  checkAllObservations(checked){
    this.isAllChecked = checked;
    for (let c of this.observations){
      this.scratchPadService.checkObservation(checked, c);
    }
  }

  // Determine whether an observation is currently associated (based on associations tool)
  isObservationAssociated(observation: Observation) {
    return this.associationService.associatedMapObservations.get(observation) || false;
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
