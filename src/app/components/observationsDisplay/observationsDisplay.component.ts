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

/**
 * Component for displaying observations within 
 * the observations list of the triple list.
 */
@Component({
  selector: 'observationsDisplay',
  templateUrl: './observationsDisplay.html'
})
export class ObservationsDisplay {
  /**
   * Trick to allow access to static methods of Observation class in pug template
   */
  Observation = Observation;

  /**
   * The currently selected observation in the list.
   */
  selected: Observation;

  /**
   * Whether the checkbox for checking all observations are currently checked.
   */
  isAllChecked : boolean = false;

  /**
   * The array of observations to be displayed.
   */
  @Input() observations: Array<Observation>;
  
  /**
   * Emit an event whenever an observation is selected.
   */
  @Output() observationSelected: EventEmitter<Observation> = new EventEmitter();

  @ViewChild('menu', { static: false }) menu: ContextMenuComponent;

  constructor(
    private associationService: AssociationService, 
    private scratchPadService: ScratchPadService
  ) { }

  /**
   * Setup the context menu with options. We can only access the view child after 
   * the view has been initialized.
   */
  ngAfterViewInit() {
    // NOTE: 'exec' functions must be bound to 'this' to access scratchPadService.
    // This is a strange behavior with scoping in Typescript/Javascript.
    
    // Add options to the context menu shown when right clicking observations.
    this.menu.addOption({
      'icon': 'glyphicon-pencil',
      'text': 'Add to Scratch Pad',
      'exec': (obs => {
        // Add every checked observation to the scratch pad
        this.scratchPadService.checkedMapObservations.forEach((isChecked, observation) => {
          if (isChecked) {
            this.scratchPadService.addObservation(observation);
          }
        });
      }).bind(this)
    });

    this.menu.addOption({
      'icon': 'glyphicon-stats',
      'text': 'Add to Trend Tool',
      'exec': (obs => {
        console.log(obs);
      }).bind(this)
    });

    this.menu.addOption({
      'icon': 'glyphicon-random',
      'text': 'Open Association Tool',
      'exec': (obs => {
        console.log(obs);
      }).bind(this)
    });
  }

  /**
   * Handle the selection of an observation.
   * @param observation The selected observation.
   */
  selectObservation(observation: Observation) {
    this.selected = observation;
    this.observationSelected.emit(this.selected);

    for (let o of this.scratchPadService.totalObservations) {
      o['selected'] = (o.id == this.selected.id);
    }
  }

  /**
   * Determine whether an observation is currently checked.
   */
  isObservationChecked(observation: Observation): boolean {
    return this.scratchPadService.checkedMapObservations.get(observation) || false;
  }

  /**
   * Change the state of an observation to either checked or unchecked.
   * @param checked Whether to set to checked or unchecked.
   * @param checkedObservation The observation to adjust the state of.
   */
  checkObservation(checked: boolean, checkedObservation: Observation) {
    this.scratchPadService.checkObservation(checked, checkedObservation);
  }
  
  /**
   * Either check or uncheck all observations.
   * @param checked Whether to check or uncheck.
   */
  checkAllObservations(checked){
    this.isAllChecked = checked;
    for (let c of this.observations){
      this.scratchPadService.checkObservation(checked, c);
    }
  }

  /**
   * Determine whether an observation is currently associated,
   * based on the associations tool.
   */
  isObservationAssociated(observation: Observation): boolean {
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